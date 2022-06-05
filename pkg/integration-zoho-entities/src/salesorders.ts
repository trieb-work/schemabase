import type { Zoho } from "@trieb.work/zoho-ts/dist/v2";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";

type ZohoAppWithTenant = ZohoApp;

export interface ZohoSalesOrdersSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohoSalesOrdersSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoSalesOrdersSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "salesorders",
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

    const salesorders = await this.zoho.salesOrder.list({
      createdDateStart: gteDate,
    });

    this.logger.info(
      `We have ${salesorders.length} salesorders that changed since last sync run.`,
    );
    if (salesorders.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    const tenantId = this.zohoApp.tenantId;

    for (const salesorder of salesorders) {
      // We first have to check, if we already have a Zoho Customer to be connected to
      // this salesorder
      const customerExist = await this.db.zohoContact.findFirst({
        where: {
          id: salesorder.customer_id,
          zohoAppId: this.zohoApp.id,
        },
      });

      const orderCreateOrConnect = {
        connectOrCreate: {
          where: {
            orderNumber_tenantId: {
              orderNumber: salesorder.salesorder_number,
              tenantId,
            },
          },
          create: {
            id: id.id("order"),
            orderNumber: salesorder.salesorder_number,
            tenant: {
              connect: {
                id: tenantId,
              },
            },
          },
        },
      };
      const zohoContactConnect = customerExist
        ? {
            connect: {
              id_zohoAppId: {
                id: salesorder.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          }
        : {};

      const createdSalesOrder = await this.db.zohoSalesOrder.upsert({
        where: {
          id_zohoAppId: {
            id: salesorder.salesorder_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: salesorder.salesorder_id,
          createdAt: new Date(salesorder.created_time),
          updatedAt: new Date(salesorder.last_modified_time),
          number: salesorder.salesorder_number,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          order: orderCreateOrConnect,
          zohoContact: zohoContactConnect,
        },
        update: {
          createdAt: new Date(salesorder.created_time),
          updatedAt: new Date(salesorder.last_modified_time),
          order: orderCreateOrConnect,
          zohoContact: zohoContactConnect,
        },
      });

      // LINE ITEMs sync
      if (
        !cronState.lastRun ||
        new Date(salesorder.last_modified_time) > cronState.lastRun
      ) {
        this.logger.info(`Pulling orderlines for ${salesorder.salesorder_id}`);
        const fullSalesorder = await this.zoho.salesOrder.get(
          salesorder.salesorder_id,
        );
        const lineItems = fullSalesorder.line_items;

        for (const lineItem of lineItems) {
          const uniqueString = uniqueStringOrderLine(
            salesorder.salesorder_number,
            lineItem.sku,
            lineItem.quantity,
          );

          await this.db.zohoLineItems.upsert({
            where: {
              id_zohoAppId: {
                id: lineItem.line_item_id,
                zohoAppId: this.zohoApp.id,
              },
            },
            create: {
              id: lineItem.line_item_id,
              lineItem: {
                connectOrCreate: {
                  where: {
                    uniqueString_tenantId: {
                      uniqueString,
                      tenantId,
                    },
                  },
                  create: {
                    id: id.id("lineItem"),
                    uniqueString,
                    order: {
                      connect: {
                        id: createdSalesOrder.orderId,
                      },
                    },
                    quantity: lineItem.quantity,
                    productVariant: {
                      connect: {
                        sku_tenantId: {
                          sku: lineItem.sku as string,
                          tenantId,
                        },
                      },
                    },
                    tenant: {
                      connect: {
                        id: this.zohoApp.id,
                      },
                    },
                  },
                },
              },
              zohoApp: {
                connect: {
                  id: this.zohoApp.id,
                },
              },
            },
            update: {
              lineItem: {
                update: {
                  quantity: lineItem.quantity,
                },
              },
            },
          });
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
