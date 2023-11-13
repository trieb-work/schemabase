/**
 * This class is used to export orders from schemabase to the offical Odoo EDI module as
 * JSON. This is used to import orders into Odoo. This is currently still mixed with
 * the kencove-api-app, as it is still not a generic service.
 */

import { Logger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiApp, Prisma } from "@prisma/client";

export class OdooEDIImport {
    private readonly logger: Logger;

    private readonly db: PrismaClient;

    private readonly kencoveApiApp: KencoveApiApp;

    constructor(
        logger: Logger,
        db: PrismaClient,
        kencoveApiApp: KencoveApiApp,
    ) {
        this.logger = logger;
        this.db = db;
        this.kencoveApiApp = kencoveApiApp;
    }

    public async run(gteDate: Date): Promise<void> {
        const dbInclude = {
            orderLineItems: {
                include: {
                    productVariant: {
                        include: {
                            kencoveApiProductVariant: {
                                where: {
                                    kencoveApiAppId: this.kencoveApiApp.id,
                                },
                            },
                        },
                    },
                    warehouse: {
                        include: {
                            kencoveApiWarehouse: {
                                where: {
                                    kencoveApiAppId: this.kencoveApiApp.id,
                                },
                            },
                        },
                    },
                },
            },
            mainContact: {
                include: {
                    kencoveApiContacts: {
                        where: {
                            kencoveApiAppId: this.kencoveApiApp.id,
                        },
                    },
                },
            },
            shippingAddress: {
                include: {
                    kencoveApiAddress: {
                        where: {
                            kencoveApiAppId: this.kencoveApiApp.id,
                        },
                    },
                },
            },
            billingAddress: {
                include: {
                    kencoveApiAddress: {
                        where: {
                            kencoveApiAppId: this.kencoveApiApp.id,
                        },
                    },
                },
            },
        };

        const ordersToCreate = await this.db.order.findMany({
            where: {
                tenantId: this.kencoveApiApp.tenantId,
                kencoveApiOrders: {
                    none: {
                        kencoveApiAppId: this.kencoveApiApp.id,
                    },
                },
            },
            include: dbInclude,
        });

        const exportOrders = ordersToCreate.map((order) => {
            const odooContactId = order.mainContact.kencoveApiContacts?.[0]
                ?.id as string | undefined;
            return {
                orderNumber: order.orderNumber,
                date: order.date,
                status: order.orderStatus,
                mainContact: {
                    email: order.mainContact.email,
                    firstName: order.mainContact.firstName,
                    lastName: order.mainContact.lastName,
                    phone: order.mainContact.phone,
                    odooContactId,
                },
                shippingAddress: {
                    fullName: order.shippingAddress?.fullname,
                    company: order.shippingAddress?.company,
                    street: order.shippingAddress?.street,
                    street2: order.shippingAddress?.additionalAddressLine,
                    odooAddressId:
                        order?.shippingAddress?.kencoveApiAddress?.[0]?.id,
                },
                billingAddress: {
                    fullName: order.billingAddress?.fullname,
                    company: order.billingAddress?.company,
                    street: order.billingAddress?.street,
                    street2: order.billingAddress?.additionalAddressLine,
                    odooAddressId:
                        order?.billingAddress?.kencoveApiAddress?.[0]?.id,
                },
                orderLineItems: order.orderLineItems.map((lineItem) => {
                    const odooProductId =
                        lineItem.productVariant.kencoveApiProductVariant?.[0]
                            ?.id;
                    const odooWarehouseId =
                        lineItem?.warehouse?.kencoveApiWarehouse?.[0]?.id;
                    return {
                        quantity: lineItem.quantity,
                        totalPriceGross: lineItem.totalPriceGross,
                        productVariant: {
                            sku: lineItem.productVariant.sku,
                            name: lineItem.productVariant.variantName,
                            odooProductId,
                        },
                        warehouse: {
                            name: lineItem?.warehouse?.name,
                            odooWarehouseId,
                        },
                    };
                }),
            };
        });

        

        
    }
}
