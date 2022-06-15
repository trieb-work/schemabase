/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import { queryWithPagination, SaleorCronPaymentsQuery } from "@eci/pkg/saleor";
import {
  InstalledSaleorApp,
  PaymentMethodType,
  PrismaClient,
  Tenant,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
// import { id } from "@eci/pkg/ids";

interface SaleorPaymentSyncServiceConfig {
  saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPaymentsQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorPaymentSyncService {
  public readonly saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPaymentsQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorPaymentSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenant = config.tenant;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.tenant.id,
      appId: this.installedSaleorApp.id,
      db: this.db,
      syncEntity: "payments",
    });
  }

  /**
   * Pull payment metadata from braintree
   */
  //   private async braintreeGetPaymentDetails() {}

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let createdGte = format(yesterdayMidnight, "yyyy-MM-dd");
    if (!cronState.lastRun) {
      createdGte = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Year to: ${createdGte}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${createdGte}`);
    }

    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronPayments({
        first,
        after,
        createdGte,
        channel: this.channelSlug,
      }),
    );

    const payments = result.orders?.edges
      .map((order) => order.node)
      .map((x) => x.payments)
      .flat();

    if (!result.orders || result.orders.edges.length === 0 || !payments) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
      return;
    }
    this.logger.info(`Syncing ${payments?.length} payments`);

    for (const payment of payments) {
      if (!payment || !payment?.id) continue;
      if (!payment?.order?.id) {
        this.logger.warn(
          `Can't sync payment ${payment.id} - No related order id given`,
        );
        continue;
      }
      const order = payment.order;
      if (typeof order.number !== "string") continue;

      const paymentReference = payment.transactions?.[0]?.token;
      if (!paymentReference) {
        this.logger.error(
          `No payment gateway transaction Id given. We use this value as internal payment reference. Cant't sync ${payment.id}`,
        );
        continue;
      }
      const paymentMethod: PaymentMethodType =
        payment.paymentMethodType === "card"
          ? "card"
          : payment.paymentMethodType === "paypal"
          ? "paypal"
          : "unknown";
      if (paymentMethod === "unknown") {
        this.logger.warn(
          `Can't match the payment method with our internal type! ${payment.id}. Received type ${payment.paymentMethodType}`,
        );
      }

      const paymentCreateOrConnect = {
        connectOrCreate: {
          where: {
            referenceNumber_tenantId: {
              referenceNumber: paymentReference,
              tenantId: this.tenant.id,
            },
          },
          create: {
            id: id.id("payment"),
            amount: payment.total?.amount as number,
            referenceNumber: paymentReference,
            tenant: {
              connect: {
                id: this.tenant.id,
              },
            },
            paymentMethod: paymentMethod,
          },
        },
      };

      // check, if we already have this saleor order created, so that we can
      // connect the payment
      const existingSaleorOrder = await this.db.saleorOrder.findUnique({
        where: {
          id_installedSaleorAppId: {
            id: order.id,
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
      });
      let saleorOrderConnect;
      if (existingSaleorOrder)
        saleorOrderConnect = {
          connect: {
            id_installedSaleorAppId: {
              id: existingSaleorOrder?.id,
              installedSaleorAppId: this.installedSaleorApp.id,
            },
          },
        };

      await this.db.saleorPayment.upsert({
        where: {
          id_installedSaleorAppId: {
            id: payment?.id,
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
        create: {
          id: payment?.id,
          createdAt: payment?.created,
          updatedAt: payment?.modified,
          saleorOrder: saleorOrderConnect,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
          payment: paymentCreateOrConnect,
        },
        update: {
          createdAt: payment?.created,
          updatedAt: payment?.modified,
          saleorOrder: saleorOrderConnect,
          payment: paymentCreateOrConnect,
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  /**
   * Should be run AFTER syncToECI() - all orders with a related SaleorOrder
   * and related payments. Tries to create these payments in saleor
   */
  public async syncFromECI(): Promise<void> {
    const ordersWithPayments = await this.db.order.findMany({
      where: {
        saleorOrders: {
          some: {
            installedSaleorAppId: {
              in: this.installedSaleorApp.id,
            },
          },
        },
        payment: {
          some: {
            tenantId: {
              in: this.tenant.id,
            },
          },
        },
      },
    });
    console.log(
      `Received ${ordersWithPayments.length} orders with saleor order and payments`,
    );
  }
}
