import { ILogger } from "@eci/pkg/logger";
import { queryWithPagination, SaleorCronPaymentsQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
// import { id } from "@eci/pkg/ids";

interface SaleorPaymentSyncServiceConfig {
  saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: Date;
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
      createdGte: Date;
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
    let createdGte = yesterdayMidnight;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Year to: ${createdGte.toISOString()}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${yesterdayMidnight.toISOString}`);
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
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
        },
        update: {
          createdAt: payment?.created,
          updatedAt: payment?.modified,
          saleorOrder: {
            connectOrCreate: {
              where: {
                id_installedSaleorAppId: {
                  id: payment.order?.id || "",
                  installedSaleorAppId: this.installedSaleorApp.id,
                },
              },
              create: {
                id: payment.order?.id,
                installedSaleorApp: {
                  connect: {
                    id: this.installedSaleorApp.id,
                  },
                },
                createdAt: payment.order.created,
                order: {
                  connectOrCreate: {
                    where: {
                      orderNumber_tenantId: {
                        orderNumber: order.number as string,
                        tenantId: this.tenant.id,
                      },
                    },
                    create: {
                      id: id.id("order"),
                      orderNumber: order.number,
                      createdAt: order.created,
                      tenant: {
                        connect: {
                          id: this.tenant.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
  }
}
