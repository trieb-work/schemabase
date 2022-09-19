import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { PaymentMethodType, PrismaClient } from "@eci/pkg/prisma";
import { setHours, subDays, subYears } from "date-fns";
import { BraintreeTransaction, BraintreeClient } from "@eci/pkg/braintree";
import { PaymentInstrumentType } from "braintree";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";

interface BraintreeTransactionSyncServiceConfig {
  db: PrismaClient;
  logger: ILogger;
  braintreeClient: BraintreeClient;
  tenantId: string;
  braintreeAppId: string;
}

export class BraintreeTransactionSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  private readonly braintreeClient: BraintreeClient;

  private readonly cronState: CronStateHandler;

  private readonly braintreeAppId: string;

  private tenantId: string;

  public constructor(config: BraintreeTransactionSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.tenantId = config.tenantId;
    this.braintreeClient = config.braintreeClient;
    this.braintreeAppId = config.braintreeAppId;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.braintreeAppId,
      db: this.db,
      syncEntity: "braintreeTransactions",
    });
  }

  public async syncToECI() {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let createdGte = yesterdayMidnight;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Years to: ${createdGte}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${createdGte}`);
    }
    const transactionsStream = this.braintreeClient.listTransactionStream({
      createdAfter: createdGte,
    });
    for await (const chunk of transactionsStream) {
      const transaction: BraintreeTransaction = chunk;

      /**
       * An object to match the braintree method types with our internal one
       */
      const braintreePaymentMethodToECIMethod: {
        [key in PaymentInstrumentType]: PaymentMethodType;
      } = {
        android_pay_card: "card",
        apple_pay_card: "card",
        credit_card: "card",
        masterpass_card: "card",
        paypal_account: "paypal",
        samsung_pay_card: "card",
        venmo_account: "card",
        visa_checkout_card: "card",
      };

      const methodType =
        braintreePaymentMethodToECIMethod?.[transaction.paymentInstrumentType];
      if (!methodType) {
        this.logger.error(
          // eslint-disable-next-line max-len
          `Could not match braintree payment "${transaction.paymentInstrumentType}" type with our internal type!`,
        );
        continue;
      }

      const currency = checkCurrency(transaction.currencyIsoCode);

      const payPalTransactionId = transaction?.paypalAccount?.authorizationId;
      const payPalTransactionFee = payPalTransactionId
        ? parseFloat(
            transaction?.paypalAccount?.transactionFeeAmount.replace(
              /,/g,
              ".",
            ) || "0",
          )
        : undefined;

      await this.db.braintreeTransaction.upsert({
        where: {
          id_braintreeAppId: {
            id: transaction.id,
            braintreeAppId: this.braintreeAppId,
          },
        },
        create: {
          id: transaction.id,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          payPalTransactionId,
          status: transaction.status,
          payment: {
            connectOrCreate: {
              where: {
                referenceNumber_tenantId: {
                  referenceNumber: transaction.id,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("payment"),
                referenceNumber: transaction.id,
                amount: Number(transaction.amount),
                transactionFee: payPalTransactionFee,
                paymentMethod: {
                  // TODO: do we really want to create paymentMethods here or is it more safe to just 
                  // use an connect and let the saleorGateway/zohoBankAccount sync jobs handle the create of the paymentMethods?
                  connectOrCreate: {
                    where: {
                      gatewayType_methodType_currency_tenantId: {
                        gatewayType: "braintree",
                        methodType,
                        currency,
                        tenantId: this.tenantId,
                      },
                    },
                    create: {
                      id: id.id("paymentMethod"),
                      gatewayType: "braintree",
                      methodType,
                      currency,
                      tenant: {
                        connect: {
                          id: this.tenantId,
                        },
                      },
                    },
                  },
                },
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
              },
            },
          },
          braintreeApp: {
            connect: {
              id: this.braintreeAppId,
            },
          },
        },
        update: {
          updatedAt: new Date(transaction.updatedAt),
          status: transaction.status,
          payment: {
            update: {
              transactionFee: payPalTransactionFee,
            },
          },
        },
      });

      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
    }
  }
}
