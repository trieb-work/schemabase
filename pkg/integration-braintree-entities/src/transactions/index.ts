import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { setHours, subDays, subYears } from "date-fns";
import { BraintreeTransaction, BraintreeClient } from "@eci/pkg/braintree";

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
