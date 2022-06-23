import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import {
  PrismaClient,
  Prisma,
  ZohoApp,
  PaymentMethodType,
} from "@eci/pkg/prisma";
// import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoPaymentSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohoPaymentSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoPaymentSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "payments",
    });
  }

  public async syncToECI(): Promise<void> {
    // const tenantId = this.zohoApp.tenantId;

    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let gteDate = format(yesterdayMidnight, "yyyy-MM-dd");

    if (cronState.lastRun === null) {
      gteDate = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${gteDate}`);
    }

    const payments = await this.zoho.payment.list({
      dateStart: gteDate,
    });

    this.logger.info(
      `We have ${payments.length} payments that we need to sync.`,
    );
    if (payments.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const payment of payments) {
      const referenceNumber =
        payment.reference_number || payment.cf_gateway_transaction_id;
      // TODO: maybe add a second option as reference number identifier,
      // if no reference number is given
      if (!referenceNumber) {
        this.logger.info(
          `Can't process payment, as no reference number is given ${payment.payment_id}`,
        );
        continue;
      }

      /**
       * Match the different payment types that might come from Zoho to our
       * more generic internal types
       */
      const paymentMethodMatch: { [key: string]: PaymentMethodType } = {
        braintree: "braintree",
        banküberweisung: "banktransfer",
        banktransfer: "banktransfer",
        paypal: "paypal",
        onlinepayment: "onlinepayment",
      };
      const paymentMethod: PaymentMethodType =
        paymentMethodMatch[payment.payment_mode.toLowerCase()];

      if (!paymentMethod) {
        this.logger.error(
          // eslint-disable-next-line max-len
          `Can't match the payment method type of payment ${payment.payment_id}. Got type: ${payment.payment_mode} from Zoho`,
        );
        continue;
      }
      // We first have to check, if we already have a Zoho Customer to be connected to
      // this payment
      const customerExist = await this.db.zohoContact.findFirst({
        where: {
          id: payment.customer_id,
          zohoAppId: this.zohoApp.id,
        },
      });
      const zohoContactConnect = customerExist
        ? {
            connect: {
              id_zohoAppId: {
                id: payment.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          }
        : {};

      // We try to connect existing invoices with this payment using the invoice Ids
      const invoiceConnect =
        payment.invoice_numbers_array.length > 0
          ? {
              connect: payment.invoice_numbers_array.map((id) => ({
                invoiceNumber_tenantId: {
                  invoiceNumber: id,
                  tenantId: this.zohoApp.tenantId,
                },
              })),
            }
          : undefined;

      // connect or create the Zoho Payment with our internal payment entity
      const paymentConnectOrCreate = {
        connectOrCreate: {
          where: {
            referenceNumber_tenantId: {
              referenceNumber,
              tenantId: this.zohoApp.tenantId,
            },
          },
          create: {
            id: id.id("payment"),
            amount: payment.amount,
            referenceNumber,
            paymentMethod: paymentMethod,
            tenant: {
              connect: {
                id: this.zohoApp.tenantId,
              },
            },
            invoices: invoiceConnect,
          },
        },
      };

      await this.db.zohoPayment.upsert({
        where: {
          id_zohoAppId: {
            id: payment.payment_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: payment.payment_id,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          createdAt: new Date(payment.created_time),
          updatedAt: new Date(payment.last_modified_time),
          zohoContact: zohoContactConnect,
          payment: paymentConnectOrCreate,
        },
        update: {
          createdAt: new Date(payment.created_time),
          updatedAt: new Date(payment.last_modified_time),
          zohoContact: zohoContactConnect,
          payment: paymentConnectOrCreate,
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
