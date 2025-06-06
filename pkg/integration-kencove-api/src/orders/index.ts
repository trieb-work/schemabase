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
    OrderShipmentStatus,
    OrderStatus,
    Prisma,
    PrismaClient,
} from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "../client";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/utils/uniqueStringOrderline";
import { KencoveApiOrder } from "../types";
import { apiLineItemsWithSchemabase } from "./lineItems";
import { normalizeStrings } from "@eci/pkg/normalization";
import async from "async";
import { shippingMethodMatch } from "@eci/pkg/utils/shippingMethodMatch";
import { KencoveApiWarehouseSync } from "../warehouses";
import { SyncToOdooEDI } from "./syncToOdooEDI";

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

    /**
     * Stores KencoveId as key and our internal addressId as value.
     */
    private addressCache: Map<string, string> = new Map();

    private mainContactCache: Map<string, string> = new Map();

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
    private async syncMainContact(order: KencoveApiOrder): Promise<string> {
        const email = order.billingAddress.email.toLowerCase();
        if (this.mainContactCache.has(email)) {
            const contactId = this.mainContactCache.get(email);
            if (!contactId) {
                throw new Error("Doing this just for typescript");
            }
            return contactId;
        }
        const billingAddress = order.billingAddress;
        const kenContactId = billingAddress.customerCode;
        const existingContact = await this.db.contact.upsert({
            where: {
                email_tenantId: {
                    email,
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
            create: {
                id: id.id("contact"),
                email,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
                kencoveApiContacts: {
                    connectOrCreate: {
                        where: {
                            id_kencoveApiAppId: {
                                id: kenContactId,
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        },
                        create: {
                            id: kenContactId,
                            kencoveApiApp: {
                                connect: {
                                    id: this.kencoveApiApp.id,
                                },
                            },
                        },
                    },
                },
            },
            update: {},
        });
        this.mainContactCache.set(email, existingContact.id);
        return existingContact.id;
    }

    /**
     * Try to find the address by the KencoveId. If not found, return undefined
     * @param kenAddressId
     * @returns
     */
    private async getAddress(
        kenAddressId: string,
    ): Promise<string | undefined> {
        if (this.addressCache.has(kenAddressId)) {
            return this.addressCache.get(kenAddressId);
        }
        const existingAddress = await this.db.kencoveApiAddress.findUnique({
            where: {
                id_kencoveApiAppId: {
                    id: kenAddressId,
                    kencoveApiAppId: this.kencoveApiApp.id,
                },
            },
        });
        if (!existingAddress) {
            this.logger.warn(`Address ${kenAddressId} not found!`);
            return;
        }
        this.addressCache.set(kenAddressId, existingAddress.addressId);
        return existingAddress.addressId;
    }

    /**
     * using the order lines qty_delivered information to gather the shipment status
     * every orderline has qty_delivered and quantity. When all qty_delivered are
     * equal to the quantity, we have a full shipment. When some orderlines have
     * not all of the quantity delivered, we have a partial shipment.
     * @param order
     */
    private matchOrderShippmentStatus(
        order: KencoveApiOrder,
    ): OrderShipmentStatus {
        if (order.all_qty_delivered) {
            return OrderShipmentStatus.shipped;
        }
        if (!order.orderLines) {
            return OrderShipmentStatus.pending;
        }
        const allDelivered = order.orderLines.every(
            (ol) => ol.qty_delivered === ol.quantity,
        );
        if (allDelivered) {
            return OrderShipmentStatus.shipped;
        }
        const noneDelivered = order.orderLines.every(
            (ol) => ol.qty_delivered === 0,
        );
        if (noneDelivered) return OrderShipmentStatus.pending;
        const someDelivered = order.orderLines.some(
            (ol) => ol.qty_delivered < ol.quantity,
        );
        if (someDelivered) {
            return OrderShipmentStatus.partiallyShipped;
        }
        return OrderShipmentStatus.pending;
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
            case "draft":
                return OrderStatus.draft;
            case "cancel":
                return OrderStatus.canceled;
            case "done":
                return OrderStatus.confirmed;
            default:
                throw new Error(`Unknown order status ${status}`);
        }
    }

    public async syncToECI(fromDate?: Date, customerCode?: string) {
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

        if (fromDate) {
            createdGte = fromDate;
            this.logger.info(`Setting GTE date to ${createdGte}.`);
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);
        const apiOrdersStream = client.getOrdersStream(
            createdGte,
            customerCode,
        );

        /**
         * Helper to match warehouse
         */
        const whHelper = new KencoveApiWarehouseSync({
            db: this.db,
            kencoveApiApp: this.kencoveApiApp,
            logger: this.logger,
        });

        for await (const apiOrders of apiOrdersStream) {
            this.logger.info(`Found ${apiOrders.length} orders to sync`, {
                orderNumbers: apiOrders.map((o) => o.orderNumber),
            });
            if (apiOrders.length === 0) {
                return;
            }

            // filter for existing email and maybe other filters
            const filtered = apiOrders.filter((x) => x.billingAddress.email);

            const existingKencoveApiOrders =
                await this.db.kencoveApiOrder.findMany({
                    where: {
                        id: {
                            in: filtered.map((o) => o.id.toString()),
                        },
                        kencoveApiAppId: this.kencoveApiApp.id,
                    },
                });
            const toCreate = filtered.filter(
                (o) =>
                    !existingKencoveApiOrders.find(
                        (eo) => eo.id === o.id.toString(),
                    ),
            );
            const toUpdate = filtered.filter((o) =>
                existingKencoveApiOrders.find(
                    (eo) => eo.id === o.id.toString(),
                ),
            );

            this.logger.info(
                `Got ${toCreate.length} orders with email address set to create and ${toUpdate.length} orders to update`,
            );

            /**
             * Parallel processing did always produce issues, so we do it one by one
             */
            await async.eachLimit(toCreate, 1, async (order) => {
                const updatedAt = new Date(order.updatedAt);
                const createdAt = new Date(order.createdAt);
                /**
                 * The actual date, when the order was placed
                 */
                const date = new Date(order.date_order);
                if (!order.billingAddress?.email) {
                    this.logger.warn(
                        `No email found in order ${order.id}. Don't sync!`,
                    );
                    return;
                }

                const mainContactPromise = this.syncMainContact(order);
                const billingAddressPromise = this.getAddress(
                    order.billingAddress.billingAddressId.toString(),
                );
                const shippingAddressPromise = this.getAddress(
                    order.shippingAddress.shippingAddressId.toString(),
                );

                const [billingAddressId, shippingAddressId, mainContactId] =
                    await Promise.all([
                        billingAddressPromise,
                        shippingAddressPromise,
                        mainContactPromise,
                    ]);
                if (!mainContactId) {
                    throw new Error(
                        // eslint-disable-next-line max-len
                        `No main contact found for order ${order.id} - ${order.orderNumber}. This should not happen!`,
                    );
                }
                this.logger.debug(
                    `Working on order ${order.id} - ${order.orderNumber}`,
                    {
                        mainContactId,
                        billingAddressId,
                        shippingAddressId,
                        date,
                        shipmentStatus: this.matchOrderShippmentStatus(order),
                    },
                );
                if (!order.amount_total) return;
                const carrier = shippingMethodMatch(
                    order.carrier.delivery_type || "",
                );
                if (!order.orderLines || order.orderLines.length === 0) {
                    this.logger.info(
                        `Order ${order.id} - ${order.orderNumber} has no order lines. Don't sync!`,
                    );
                    return;
                }
                try {
                    const wareHouseNames = order?.orderLines?.map(
                        (ol) => ol.warehouseCode,
                    );
                    /**
                     * Populate the internal warehouse cache
                     */
                    for (const wh of wareHouseNames) {
                        if (wh) await whHelper.getWareHouseId(wh);
                    }

                    await this.db.kencoveApiOrder.create({
                        data: {
                            id: order.id.toString(),
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
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("order"),
                                        orderStatus: this.matchOrderStatus(
                                            order.state,
                                        ),
                                        shipmentStatus:
                                            this.matchOrderShippmentStatus(
                                                order,
                                            ),
                                        date,
                                        language: "EN",
                                        currency: "USD",
                                        carrier,
                                        shippingMethodName:
                                            order?.carrier?.name,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                        orderNumber: order.orderNumber,
                                        billingAddress: billingAddressId
                                            ? {
                                                  connect: {
                                                      id: billingAddressId,
                                                  },
                                              }
                                            : undefined,
                                        shippingAddress: shippingAddressId
                                            ? {
                                                  connect: {
                                                      id: shippingAddressId,
                                                  },
                                              }
                                            : undefined,
                                        totalPriceGross: order.amount_total,
                                        totalPriceNet: order.amount_untaxed,
                                        mainContact: {
                                            connect: {
                                                id: mainContactId,
                                            },
                                        },
                                        orderLineItems: {
                                            create: order?.orderLines?.map(
                                                (ol, index) => {
                                                    /**
                                                     * in the description, we have the product name like
                                                     * "[MCCHD] Cut Out Switch -Heavy Duty"
                                                     * productName is just the product name without the sku
                                                     */
                                                    const productName =
                                                        ol.description.replace(
                                                            /\[.*?\]\s/g,
                                                            "",
                                                        );
                                                    const normalizedName =
                                                        normalizeStrings.productNames(
                                                            productName,
                                                        );
                                                    return {
                                                        id: id.id("lineItem"),
                                                        uniqueString:
                                                            uniqueStringOrderLine(
                                                                order.orderNumber,
                                                                ol.itemCode,
                                                                ol.quantity,
                                                                index,
                                                            ),
                                                        quantity: ol.quantity,
                                                        productVariant: {
                                                            connectOrCreate: {
                                                                where: {
                                                                    sku_tenantId:
                                                                        {
                                                                            sku: ol.itemCode,
                                                                            tenantId:
                                                                                this
                                                                                    .kencoveApiApp
                                                                                    .tenantId,
                                                                        },
                                                                },
                                                                create: {
                                                                    id: id.id(
                                                                        "variant",
                                                                    ),
                                                                    sku: ol.itemCode,
                                                                    tenant: {
                                                                        connect:
                                                                            {
                                                                                id: this
                                                                                    .kencoveApiApp
                                                                                    .tenantId,
                                                                            },
                                                                    },
                                                                    product: {
                                                                        connectOrCreate:
                                                                            {
                                                                                where: {
                                                                                    normalizedName_tenantId:
                                                                                        {
                                                                                            normalizedName,
                                                                                            tenantId:
                                                                                                this
                                                                                                    .kencoveApiApp
                                                                                                    .tenantId,
                                                                                        },
                                                                                },
                                                                                create: {
                                                                                    id: id.id(
                                                                                        "product",
                                                                                    ),
                                                                                    normalizedName,
                                                                                    name: productName,
                                                                                    tenant: {
                                                                                        connect:
                                                                                            {
                                                                                                id: this
                                                                                                    .kencoveApiApp
                                                                                                    .tenantId,
                                                                                            },
                                                                                    },
                                                                                },
                                                                            },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                        tenant: {
                                                            connect: {
                                                                id: this
                                                                    .kencoveApiApp
                                                                    .tenantId,
                                                            },
                                                        },
                                                        warehouse:
                                                            ol.warehouseCode
                                                                ? {
                                                                      connect: {
                                                                          id: whHelper.getFromCache(
                                                                              ol.warehouseCode,
                                                                          ),
                                                                      },
                                                                  }
                                                                : undefined,
                                                        totalPriceGross:
                                                            ol.price_subtotal,
                                                        undiscountedUnitPriceGross:
                                                            ol.price_unit,
                                                        totalPriceNet:
                                                            ol.price_subtotal -
                                                            ol.orderLine_tax,
                                                    };
                                                },
                                            ),
                                        },
                                        shippingPriceGross:
                                            order.shipping_cost_total,
                                        shippingPriceNet:
                                            order.shipping_cost_net,
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
                        this.logger.error(
                            `Error working on order: ${order.id} - ${order.orderNumber}:`,
                        );
                        throw error;
                    }
                }
            });

            for (const order of toUpdate) {
                if (!order.billingAddress?.email) {
                    this.logger.warn(
                        `No email found in order ${order.id} - ${order.orderNumber}. Don't sync!`,
                    );
                    continue;
                }
                const updatedAt = new Date(order.updatedAt);
                const mainContactPromise = this.syncMainContact(order);

                /**
                 * Delivery method could be found in two places -
                 * carrier.delivery_type is number one.
                 *  when this one is not set, we check all orderLines
                 * line_carrier name. If all line items have the same carrier,
                 * we use this one. When both are not set, we use "" as default.
                 */
                let deliveryMethod = order.carrier.name || "";

                if (!deliveryMethod) {
                    const lineCarriers = order.orderLines?.map(
                        (line) => line.line_carrier?.name,
                    );

                    const uniqueCarriers = [...new Set(lineCarriers)];
                    if (uniqueCarriers.length === 1 && uniqueCarriers[0]) {
                        deliveryMethod = uniqueCarriers[0];
                    }
                }
                const carrier = shippingMethodMatch(deliveryMethod);
                const billingAddressPromise = this.getAddress(
                    order.billingAddress.billingAddressId.toString(),
                );
                const shippingAddressPromise = this.getAddress(
                    order.shippingAddress.shippingAddressId.toString(),
                );
                const [billingAddressId, shippingAddressId, mainContactId] =
                    await Promise.all([
                        billingAddressPromise,
                        shippingAddressPromise,
                        mainContactPromise,
                    ]);
                this.logger.debug(
                    `Updating order ${order.id} - ${order.orderNumber}`,
                    {
                        mainContactId,
                        billingAddressId,
                        shippingAddressId,
                        date: order.date_order,
                        carrier,
                        shippmentStatus: this.matchOrderShippmentStatus(order),
                        orderStatus: this.matchOrderStatus(order.state),
                    },
                );
                const res = await this.db.kencoveApiOrder.update({
                    where: {
                        id_kencoveApiAppId: {
                            id: order.id.toString(),
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
                                shipmentStatus:
                                    this.matchOrderShippmentStatus(order),
                                currency: "USD",
                                /**
                                 * These orders are for US only.
                                 */
                                language: "EN",
                                carrier,
                                totalPriceGross: order.amount_total,
                                totalPriceNet: order.amount_untaxed,
                                shippingPriceNet: order.shipping_cost_net,
                                shippingPriceGross: order.shipping_cost_total,
                                billingAddress: billingAddressId
                                    ? {
                                          connect: {
                                              id: billingAddressId,
                                          },
                                      }
                                    : undefined,
                                shippingAddress: shippingAddressId
                                    ? {
                                          connect: {
                                              id: shippingAddressId,
                                          },
                                      }
                                    : undefined,
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
                    whHelper,
                );
            }
        }
        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }

    public async syncFromECI(orderNumber?: string) {
        const odooEdiClass = new SyncToOdooEDI({
            logger: this.logger,
            kencoveApiApp: this.kencoveApiApp,
            db: this.db,
        });

        await odooEdiClass.sync(orderNumber);
    }
}
