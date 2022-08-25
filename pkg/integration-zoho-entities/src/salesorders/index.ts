import type { CreateSalesOrder, SalesOrder, Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { Language, Prisma, PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, isAfter, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { CustomFieldApiName } from "@eci/pkg/zoho-custom-fields/src/registry";
import addresses from "./addresses";
import { calculateDiscount, orderToZohoLineItems } from "./lineItems";
import { orderToMainContactId } from "./mainContact";


export class Warning extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

export interface ZohoSalesOrdersSyncConfig {
    logger: ILogger;
    zoho: Zoho;
    db: PrismaClient;
    zohoApp: ZohoApp;
}

export class ZohoSalesOrdersSyncService {
    private readonly logger: ILogger;

    private readonly zoho: Zoho;

    private readonly db: PrismaClient;

    private readonly zohoApp: ZohoApp;

    private readonly cronState: CronStateHandler;

    private readonly tenantId: string;

    public parseLanguage(language: string | undefined): Language | undefined {
        if (!language) {
            return undefined;
        }
        switch (language.toLowerCase()) {
            case "en":
                return Language.EN;
            case "de":
                return Language.DE;
            default:
                return undefined;
        }
    }

    public constructor(config: ZohoSalesOrdersSyncConfig) {
        this.logger = config.logger;
        this.zoho = config.zoho;
        this.db = config.db;
        this.zohoApp = config.zohoApp;
        this.tenantId = this.zohoApp.tenantId;
        this.cronState = new CronStateHandler({
            tenantId: this.zohoApp.tenantId,
            appId: this.zohoApp.id,
            db: this.db,
            syncEntity: "salesorders",
        });
    }

    public async syncToECI(): Promise<void> {
        const cronState = await this.cronState.get();

        const now = new Date();
        const yesterdayMidnight = setHours(subDays(now, 1), 0);
        let gteDate = format(yesterdayMidnight, "yyyy-MM-dd");

        if (cronState.lastRun === null) {
            gteDate = format(subYears(now, 2), "yyyy-MM-dd");
            this.logger.info(
                `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
            );
        } else {
            this.logger.info(`Setting GTE date to ${gteDate}`);
        }

        /**
         * All salesorder as overview. Sorted by salesorder date ascending
         */
        const salesorders = await this.zoho.salesOrder.list({
            createdDateStart: gteDate,
            sortColumn: "date",
            sortOrder: "ascending",
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

        for (const salesorder of salesorders) {
            // We first have to check, if we already have a Zoho Customer to be connected to
            // this salesorder
            const zohoCustomerExist = await this.db.zohoContact.findUnique({
                where: {
                    id_zohoAppId: {
                        id: salesorder.customer_id,
                        zohoAppId: this.zohoApp.id,
                    },
                },
            });
            if (zohoCustomerExist) {
                this.logger.info(
                    // eslint-disable-next-line max-len
                    `ZohoContact ${zohoCustomerExist.id} is related to ZohoSalesOrder ${salesorder.salesorder_id} - Order Number ${salesorder.salesorder_number}`,
                );
            } else {
                this.logger.info(
                    // eslint-disable-next-line max-len
                    `No internal contact found for zoho salesorder id ${salesorder.salesorder_id} - Order Number ${salesorder.salesorder_number}`,
                );
            }

            /**
             * The preferred user language can be set as custom field for the salesorder
             */
            const language = this.parseLanguage(
                (salesorder?.[CustomFieldApiName.PREFERRED_LANGUAGE] as string) ??
                undefined,
            );

            // Connect or create the internal contact using the email address
            // connected with this salesorder
            const contactConnectOrCreate: Prisma.ContactCreateNestedManyWithoutOrdersInput =
                salesorder.email
                    ? {
                        connectOrCreate: {
                            where: {
                                email_tenantId: {
                                    email: salesorder.email.toLowerCase(),
                                    tenantId: this.tenantId,
                                },
                            },
                            create: {
                                id: id.id("contact"),
                                email: salesorder.email.toLowerCase(),
                                tenant: {
                                    connect: {
                                        id: this.tenantId,
                                    },
                                },
                            },
                        },
                    }
                    : {};

            // Create or connect the internal order using the salesorder number as identifier
            const orderCreateOrConnect: Prisma.OrderUpdateOneRequiredWithoutZohoSalesOrdersNestedInput =
            {
                connectOrCreate: {
                    where: {
                        orderNumber_tenantId: {
                            orderNumber: salesorder.salesorder_number,
                            tenantId: this.tenantId,
                        },
                    },
                    create: {
                        id: id.id("order"),
                        orderNumber: salesorder.salesorder_number,
                        date: new Date(salesorder.date),
                        totalPriceGross: salesorder.total,
                        tenant: {
                            connect: {
                                id: this.tenantId,
                            },
                        },
                        contacts: contactConnectOrCreate,
                        language,
                    },
                },
            };
            const zohoContactConnect: Prisma.ZohoContactCreateNestedOneWithoutZohoSalesOrderInput =
                zohoCustomerExist
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
                    order: {
                        update: {
                            date: new Date(salesorder.date),
                        },
                    },
                    zohoContact: zohoContactConnect,
                },
                include: {
                    order: {
                        include: {
                            _count: {
                                select: {
                                    lineItems: true,
                                },
                            },
                        },
                    },
                },
            });

            const internalOrderId = createdSalesOrder.orderId;

            // LINE ITEMs and addresses sync - pulls the full salesorder from Zoho only
            // if something has changed or if we are missing data internally
            if (
                isAfter(
                    new Date(salesorder.last_modified_time),
                    createdSalesOrder.updatedAt,
                ) ||
                createdSalesOrder.order._count.lineItems === 0
            ) {
                this.logger.info(
                    // eslint-disable-next-line max-len
                    `Pulling full salesorder ${salesorder.salesorder_id} from Zoho - ${salesorder.salesorder_number}`,
                );
                const fullSalesorder = await this.zoho.salesOrder.get(
                    salesorder.salesorder_id,
                );

                if (!fullSalesorder) {
                    this.logger.error(
                        `No data returned from Zoho for SalesOrder ${salesorder.salesorder_id}`,
                    );
                    continue;
                }
                if (!fullSalesorder.line_items) {
                    this.logger.error(
                        `No line items for SalesOrder ${salesorder.salesorder_id}`,
                    );
                    continue;
                }
                const lineItems = fullSalesorder.line_items;

                for (const lineItem of lineItems) {
                    const uniqueString = uniqueStringOrderLine(
                        salesorder.salesorder_number,
                        lineItem.sku,
                        lineItem.quantity,
                    );

                    // Lookup of the product variant SKU in our internal DB
                    const productVariantLookup = await this.db.productVariant.findUnique({
                        where: {
                            sku_tenantId: {
                                sku: lineItem.sku,
                                tenantId: this.tenantId,
                            },
                        },
                    });
                    if (!productVariantLookup) {
                        this.logger.warn(
                            // eslint-disable-next-line max-len
                            `No internal product variant found for SKU ${lineItem.sku}! Can't process this line item`,
                        );
                        continue;
                    }

                    const warehouse = lineItem.warehouse_id
                        ? await this.db.zohoWarehouse.findUnique({
                            where: {
                                id_zohoAppId: {
                                    id: lineItem.warehouse_id,
                                    zohoAppId: this.zohoApp.id,
                                },
                            },
                        })
                        : null;

                    /**
                     * Only try to connect a warehouse, if we have one related to
                     * this line item.
                     */
                    const warehouseConnect = warehouse?.warehouseId
                        ? { connect: { id: warehouse.warehouseId } }
                        : {};

                    await this.db.zohoLineItem.upsert({
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
                                            tenantId: this.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("lineItem"),
                                        uniqueString,
                                        order: {
                                            connect: {
                                                id: internalOrderId,
                                            },
                                        },
                                        quantity: lineItem.quantity,
                                        discountValueNet: lineItem.discount_amount,
                                        taxPercentage: lineItem.tax_percentage,
                                        totalPriceNet: lineItem.item_total,
                                        warehouse: warehouseConnect,
                                        productVariant: {
                                            connect: {
                                                id: productVariantLookup.id,
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
                                    discountValueNet: lineItem.discount_amount,
                                    taxPercentage: lineItem.tax_percentage,
                                    totalPriceNet: lineItem.item_total,
                                },
                            },
                        },
                    });
                }

                // if we have payments connected, we can connect them internally as well
                for (const payment of fullSalesorder.payments) {
                    const zohoPaymentExist = await this.db.zohoPayment.findUnique({
                        where: {
                            id_zohoAppId: {
                                id: payment.payment_id,
                                zohoAppId: this.zohoApp.id,
                            },
                        },
                        include: {
                            payment: true,
                        },
                    });
                    if (zohoPaymentExist && zohoPaymentExist.paymentId) {
                        this.logger.info(
                            // eslint-disable-next-line max-len
                            `Connecting Zoho payment ${zohoPaymentExist.id} with internal order id ${internalOrderId}`,
                        );
                        await this.db.order.update({
                            where: {
                                id: internalOrderId,
                            },
                            data: {
                                payments: {
                                    connect: {
                                        id: zohoPaymentExist.paymentId,
                                    },
                                },
                            },
                        });
                    }
                }

                /**
                 * Update the order addresses in our internal db
                 */
                await addresses(
                    this.db,
                    internalOrderId,
                    this.tenantId,
                    this.logger,
                ).sync(
                    fullSalesorder.shipping_address,
                    fullSalesorder.billing_address,
                    fullSalesorder.contact_person_details,
                    fullSalesorder.customer_name,
                );
            }
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    public async syncFromECI(): Promise<void> {
        const ordersFromEciDb = await this.db.order.findMany({
            where: {
                tenant: {
                    id: this.zohoApp.tenantId,
                },
                // TODO: filter out orders that are cancled (for example in saleor)
                orderStatus: "confirmed",
                // filter out zohoSalesorders with the current AppId
                // like this we find the orders, that we do not
                // yet have a ZohoId in the DB
                zohoSalesOrders: {
                    none: {
                        zohoAppId: this.zohoApp.id,
                    },
                },
            },
            include: {
                lineItems: {
                    include: {
                        productVariant: {
                            include: {
                                zohoItem: {
                                    where: {
                                        zohoAppId: this.zohoApp.id
                                    }
                                }
                            }
                        },
                        warehouse: {
                            include: {
                                zohoWarehouse: {
                                    where: {
                                        zohoAppId: this.zohoApp.id
                                    }
                                }
                            }
                        }
                    }
                },
                mainContact: {
                    include: {
                        zohoContactPersons: {
                            where: {
                                zohoAppId: this.zohoApp.id,
                            }
                        },
                    }
                },
                contacts: {
                    where: {
                        tenantId: this.zohoApp.tenantId,
                    },
                    include: {
                        zohoContactPersons: {
                            where: {
                                zohoAppId: this.zohoApp.id,
                            }
                        },
                    },
                },
                shippingAddress: true, // TODO also include sub-model zohoaddress
                billingAddress: true, // TODO also include sub-model zohoaddress
            },
        });
        this.logger.info(
            `Received ${ordersFromEciDb.length
            } orders that are not synced with Zoho: ${ordersFromEciDb
                .map((o) => o.orderNumber)
                .join(",")}`,
        );

        const salesorderToConfirm: SalesOrder[] = [];
        for (const order of ordersFromEciDb) {
            // Create a salesorder in Zoho:
            // We need one main contact and a contact person to be related to the order.
            // We need to check if we have discounts on line item level or on salesorder level
            // We need to call create and check, if the returned total gross values matches the order gross from our DB
            // TODO create test with mocked client
            try {
                const discount_type = order.discountValueNet ? "entity_level" : "item_level";
                const createSalesOrderBody: CreateSalesOrder = {
                    salesorder_number: order.orderNumber,
                    reference_number: order.referenceNumber ?? undefined,
                    line_items: orderToZohoLineItems(order, discount_type),
                    customer_id: await orderToMainContactId(order, this.db, this.logger), // TODO check fallback
                    contact_persons: order.contacts.flatMap((eciContact) => eciContact.zohoContactPersons.map((zohoContactPerson) => zohoContactPerson.id)),
                    discount_type,
                    discount: calculateDiscount(order.discountValueNet, 'fixed'),
                    // TODO: create sync job: addresses.syncFromECI
                    // billing_address_id: order.billingAddress.zohoid..., // TODO check for multiple IDs and throw error if not exactly one as with others
                    // shipping_address_id: order.shippingAddressId.zohoid... // TODO check for multiple IDs and throw error if not exactly one as with others
                };
                const createdSalesOrder = await this.zoho.salesOrder.create(createSalesOrderBody);
                await this.db.zohoSalesOrder.create({
                    data: {
                        id: createdSalesOrder.salesorder_id,
                        order: {
                            connect: {
                                id: order.id,
                            }
                        },
                        zohoApp: {
                            connect: {
                                id: this.zohoApp.id,
                            }
                        },
                        // zohoContact // TODO is this needed? --> remove it from the schema if it is really not needed
                        // zohoContactPerson // TODO is this needed? --> remove it from the schema if it is really not needed
                    },
                });
                this.logger.info(
                    "Created new zoho SalesOrder for current order",
                    {
                        orderId: order.id,
                        mainContactId: order.mainContactId,
                        orderNumber: order.orderNumber,
                        referenceNumber: order.referenceNumber,
                        zohoAppId: this.zohoApp.id,
                        tenantId: this.tenantId,
                    },
                );
                if (createdSalesOrder.total !== order.totalPriceGross) {
                    throw new Error("IMPORTANT: Order totals from saleor and ECI do not match. The Order was therefore not confirmed automatically in Zoho, please check them manually and confirm the order in Zoho.");
                }
                salesorderToConfirm.push(createdSalesOrder);
            } catch (err) {
                if (err instanceof Warning) {
                    // TODO make an update on Order and increase Warning counter, if warning counter over threshold 5 -> log an error instead
                    this.logger.warn(err.message, { eciOrderId: order.id });
                } else if (err instanceof Error) {
                    this.logger.error(err.message, { eciOrderId: order.id });
                } else {
                    this.logger.error("An unknown Error occured: " + (err as any)?.toString(), { eciOrderId: order.id });
                }
            }
            try {
                await this.zoho.salesOrder.confirm(salesorderToConfirm.map((so) => so.salesorder_id));
            } catch(err){
                const errorMsg = err instanceof Error ? `${err.name}:\n${err.message}` : JSON.stringify(err)
                this.logger.error("Could not confirm all salesorders after creating them. Please check Zoho and confirm them manually.", {
                    submitedSalesorderIds: salesorderToConfirm.map((so) => so.salesorder_id),
                    submitedSalesorderNumbers: salesorderToConfirm.map((so) => so.salesorder_number),
                    zohoClientErrorMessage: errorMsg,
                })
            }
        }
    }
}
