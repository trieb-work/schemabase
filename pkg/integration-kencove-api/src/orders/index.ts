// KencoveApiAppOrderSyncService to sync orders with our internal DB. The orderNumber
// is the unique identifier
// to match our internal DB. We first make a decision to create or to update the order
// based on the existence of the orderNumber in our internal DB. If the orderNumber is not found,
// we create a new order. If the orderNumber is found, we check if the updatedAt timestamp
// has been updated since the last sync
// and if so, we update the order.
// Path: pkg/integration-kencove-api/src/orders.ts
import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import {
  KencoveApiApp,
  OrderStatus,
  Prisma,
  PrismaClient,
} from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "../client";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { KencoveApiOrder } from "../types";
import { apiLineItemsWithSchemabase } from "./lineItems";
// import { KencoveApiWarehouseSync } from "../warehouses";

interface KencoveApiAppOrderSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppOrderSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppOrderSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "orders",
    });
  }

  /**
   * Takes the order and creates the contact
   * internally if needed. Returns the internal contact Id
   */
  private async syncMainContact(order: KencoveApiOrder) {
    if (!order.billingAddress?.email) {
      this.logger.error(`No email found in order ${order.id}!`);
      return;
    }
    const email = order.billingAddress.email.toLowerCase();
    const existingContact = await this.db.contact.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId: this.kencoveApiApp.tenantId,
        },
      },
    });
    if (existingContact) {
      return existingContact.id;
    }
    const billingAddress = order.billingAddress;
    const newContact = await this.db.contact.create({
      data: {
        id: id.id("contact"),
        email,
        tenant: {
          connect: {
            id: this.kencoveApiApp.tenantId,
          },
        },
        kencoveApiContacts: {
          create: {
            id: billingAddress.customerCode,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
          },
        },
      },
    });
    return newContact.id;
  }

  /**
   * Match the order status from the Kencove API (odoo order status)
   * with our internal status
   * @param status
   */
  private matchOrderStatus(status: KencoveApiOrder["state"]): OrderStatus {
    switch (status) {
      case "sale":
        return OrderStatus.confirmed;
      case "sent":
        return OrderStatus.draft;
      case "cancel":
        return OrderStatus.canceled;
      default:
        throw new Error(`Unknown order status ${status}`);
    }
  }

  public async syncToECI() {
    const cronState = await this.cronState.get();
    const now = new Date();
    let createdGte: Date;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
      );
    } else {
      // for security purposes, we sync one hour more than the last run
      createdGte = subHours(cronState.lastRun, 1);
      this.logger.info(`Setting GTE date to ${createdGte}.`);
    }

    const client = new KencoveApiClient(this.kencoveApiApp);
    const apiOrders = await client.getOrders(createdGte);

    this.logger.info(`Found ${apiOrders.length} orders to sync`);
    if (apiOrders.length === 0) {
      return;
    }

    /**
     * Helper to match warehouse
     */
    // const whHelper = new KencoveApiWarehouseSync({
    //   db: this.db,
    //   kencoveApiApp: this.kencoveApiApp,
    //   logger: this.logger,
    // });

    const existingOrders = await this.db.kencoveApiOrder.findMany({
      where: {
        id: {
          in: apiOrders.map((o) => o.id),
        },
        kencoveApiAppId: this.kencoveApiApp.id,
      },
    });
    const toCreate = apiOrders.filter(
      (o) => !existingOrders.find((eo) => eo.id === o.id),
    );
    const toUpdate = apiOrders.filter((o) =>
      existingOrders.find((eo) => eo.id === o.id),
    );

    for (const order of toCreate) {
      const updatedAt = new Date(order.updatedAt);
      const createdAt = new Date(order.createdAt);
      const mainContactId = await this.syncMainContact(order);
      if (!mainContactId) continue;
      try {
        await this.db.kencoveApiOrder.create({
          data: {
            id: order.id,
            updatedAt,
            createdAt,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
            order: {
              connectOrCreate: {
                where: {
                  orderNumber_tenantId: {
                    orderNumber: order.orderNumber,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("order"),
                  orderStatus: this.matchOrderStatus(order.state),
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                  orderNumber: order.orderNumber,
                  date: new Date(order.date_order),
                  totalPriceGross: order.amount_total,
                  mainContact: {
                    connect: {
                      id: mainContactId,
                    },
                  },
                  orderLineItems: {
                    create: order.orderLines.map((ol, index) => {
                      return {
                        id: id.id("lineItem"),
                        uniqueString: uniqueStringOrderLine(
                          order.orderNumber,
                          ol.itemCode,
                          ol.quantity,
                          index,
                        ),
                        quantity: ol.quantity,
                        productVariant: {
                          connect: {
                            sku_tenantId: {
                              sku: ol.itemCode,
                              tenantId: this.kencoveApiApp.tenantId,
                            },
                          },
                        },
                        tenant: {
                          connect: {
                            id: this.kencoveApiApp.tenantId,
                          },
                        },
                      };
                    }),
                  },
                },
              },
            },
          },
        });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          this.logger.error(
            `Error while creating order ${order.id}: ${error.message}`,
          );
        } else {
          throw error;
        }
      }
    }

    for (const order of toUpdate) {
      const updatedAt = new Date(order.updatedAt);
      const mainContactId = await this.syncMainContact(order);
      const res = await this.db.kencoveApiOrder.update({
        where: {
          id_kencoveApiAppId: {
            id: order.id,
            kencoveApiAppId: this.kencoveApiApp.id,
          },
        },
        data: {
          updatedAt,
          order: {
            update: {
              mainContact: {
                connect: {
                  id: mainContactId,
                },
              },
              orderStatus: this.matchOrderStatus(order.state),
              totalPriceGross: order.amount_total,
            },
          },
        },
      });
      // We update the order line items in a separate process
      await apiLineItemsWithSchemabase(
        order,
        res.orderId,
        this.kencoveApiApp.tenantId,
        this.db,
        this.logger,
      );
    }
  }
}
