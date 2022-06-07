/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
  SaleorCronOrdersOverviewQuery,
  queryWithPagination,
  SaleorCronOrderDetailsQuery,
} from "@eci/pkg/saleor";
import {
  InstalledSaleorApp,
  PrismaClient,
  SaleorZohoIntegration,
  Tenant,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { setHours, subDays, subYears, format } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
// import { id } from "@eci/pkg/ids";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorCronOrderDetails: (variables: {
      id: string;
    }) => Promise<SaleorCronOrderDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  saleorZohoIntegration: SaleorZohoIntegration;
  logger: ILogger;
}

export class SaleorOrderSyncService {
  public readonly saleorClient: {
    saleorCronOrderDetails: (variables: {
      id: string;
    }) => Promise<SaleorCronOrderDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly saleorZohoIntegration: SaleorZohoIntegration;

  public constructor(config: SaleorOrderSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenant = config.tenant;
    this.db = config.db;
    this.saleorZohoIntegration = config.saleorZohoIntegration;
    this.cronState = new CronStateHandler({
      tenantId: this.tenant.id,
      appId: this.installedSaleorApp.id,
      db: this.db,
      syncEntity: "orders",
    });
  }

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
      this.saleorClient.saleorCronOrdersOverview({
        first,
        after,
        createdGte,
        channel: this.channelSlug,
      }),
    );

    if (!result.orders || result.orders.edges.length === 0) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
      return;
    }
    const orders = result.orders.edges.map((order) => order.node);

    this.logger.info(`Working on ${orders.length} orders`);

    for (const order of orders) {
      if (!order.number || typeof order.number === "undefined") {
        this.logger.error(`No orderNumber in order ${order.id} - Can't sync`);
        continue;
      }
      const prefixedOrderNumber = `${this.saleorZohoIntegration.orderPrefix}-${order.number}`;

      const upsertedOrder = await this.db.saleorOrder.upsert({
        where: {
          id_installedSaleorAppId: {
            id: order.id,
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
        create: {
          id: order.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
          createdAt: order.created,
          order: {
            connectOrCreate: {
              where: {
                orderNumber_tenantId: {
                  orderNumber: prefixedOrderNumber,
                  tenantId: this.tenant.id,
                },
              },
              create: {
                id: id.id("order"),
                orderNumber: prefixedOrderNumber,
                totalPriceGross: order.total.gross.amount,
                tenant: {
                  connect: {
                    id: this.tenant.id,
                  },
                },
              },
            },
          },
        },
        update: {},
      });

      const orderDetails = await this.saleorClient.saleorCronOrderDetails({
        id: order.id,
      });
      if (!orderDetails) {
        this.logger.error(
          `Can't get order details from saleor for order ${order.id}!`,
        );
        continue;
      }
      const lineItems = orderDetails.order?.lines;
      if (!lineItems) {
        this.logger.error(`No line items returned for order ${order.id}!`);
        continue;
      }

      // loop through all line items and upsert them in the DB
      for (const lineItem of lineItems) {
        if (!lineItem?.id) continue;
        if (!lineItem?.variant?.sku) continue;

        const productSku = await this.db.productVariant.findUnique({
          where: {
            sku_tenantId: {
              sku: lineItem.variant.sku,
              tenantId: this.tenant.id,
            }
          }
        })
        if (!productSku) {
          this.logger.warn(`No internal product variant found for SKU ${lineItem.variant.sku}! Can't create line Item`);
          continue;
        }

        const uniqueString = uniqueStringOrderLine(
          prefixedOrderNumber,
          lineItem.variant.sku,
          lineItem.quantity,
        );

        // Before Saleor 3.3.13, the discount value is calculated on the
        // gross price (which is just bullshit :D) so we have to calculate the discountValueNet
        // manually
        const discountValueNet =  lineItem.undiscountedUnitPrice.net.amount - lineItem.totalPrice.net.amount

        await this.db.saleorLineItem.upsert({
          where: {
            id_installedSaleorAppId: {
              id: lineItem.id,
              installedSaleorAppId: this.installedSaleorApp.id,
            },
          },
          create: {
            id: lineItem.id,
            lineItem: {
              connectOrCreate: {
                where: {
                  uniqueString_tenantId: {
                    uniqueString,
                    tenantId: this.tenant.id,
                  },
                },
                create: {
                  id: id.id("lineItem"),
                  tenant: {
                    connect: {
                      id: this.tenant.id,
                    },
                  },
                  uniqueString,
                  order: {
                    connect: {
                      id: upsertedOrder.orderId,
                    },
                  },
                  quantity: lineItem.quantity,
                  discountValueNet,
                  totalPriceNet: lineItem.totalPrice.net.amount,
                  totalPriceGross: lineItem.totalPrice.gross.amount,
                  taxPercentage: lineItem.taxRate * 100,
                  productVariant: {
                    connect: {
                      id: productSku.id,
                    },
                  },
                },
              },
            },
            installedSaleorApp: {
              connect: {
                id: this.installedSaleorApp.id,
              },
            },
          },
          update: {
            lineItem: {
              update: {
                quantity: lineItem.quantity,
                discountValueNet,
                totalPriceNet: lineItem.totalPrice.net.amount,
                totalPriceGross: lineItem.totalPrice.gross.amount,
                taxPercentage: lineItem.taxRate * 100,
                productVariant: {
                  connect: {
                    id: productSku.id,
                  },
                }, 
              }

            }
          },
        });
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
