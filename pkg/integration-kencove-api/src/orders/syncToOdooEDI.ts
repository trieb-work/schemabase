import axios from "axios";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";

// We send all unprocessed or updated orders to Odoo EDI endpoint for processing.
// Example of an order:
// {
//     "orderNumber": "321",
//     "date": "2023-12-29",
//     "status": "Draft",
//     "mainContact": {
//         "email": "john.doe@example.com",
//         "firstName": "John",
//         "lastName": "Doe",
//         "phone": "123456789",
//         "odooContactId": "C123"
//     },
//     "shippingAddress": {
//         "fullName": "John Doe",
//         "company": "ABC Inc.",
//         "street": "123 Main St",
//         "street2": "Apt 45",
//         "odooAddressId": "A456"
//     },
//     "billingAddress": {
//         "fullName": "John Doe",
//         "company": "ABC Inc.",
//         "street": "123 Main St",
//         "street2": "Apt 45",
//         "odooAddressId": "A456"
//     },
//     "orderLineItems": [
//         {
//             "quantity": 2,
//             "totalPriceGross": 100,
//             "productVariant": {
//                 "sku": "SKU001",
//                 "name": "Product 1",
//                 "odooProductId": "1"
//             },
//             "warehouse": {
//                 "name": "Warehouse 1",
//                 "odooWarehouseId": "1"
//             }
//         },
//         {
//             "quantity": 1,
//             "totalPriceGross": 50,
//             "productVariant": {
//                 "sku": "SKU002",
//                 "name": "Product 2",
//                 "odooProductId": "2"
//             },
//             "warehouse": {
//                 "name": "Warehouse 2",
//                 "odooWarehouseId": "2"
//             }
//         }
//     ]
// }

interface SyncToOdooEDIOptions {
    kencoveApiApp: KencoveApiApp;
    db: PrismaClient;
    logger: ILogger;
}
export class SyncToOdooEDI {
    private readonly logger: ILogger;

    private readonly kencoveApiApp: KencoveApiApp;

    private readonly db: PrismaClient;

    constructor(config: SyncToOdooEDIOptions) {
        this.logger = config.logger;
        this.kencoveApiApp = config.kencoveApiApp;
        this.db = config.db;
    }

    private async sendOrderToOdooEDI(order: any): Promise<void> {
        const url = `${this.kencoveApiApp.ediEndpoint}/api/v1/custom/saleor/order_create_async?db=kencove_20231224`;
        if (!url) throw new Error("EDI endpoint is not configured");
        const response = await axios.post(url, order);
        if (response.status !== 200) {
            throw new Error(
                `Failed to send order to Odoo EDI: ${response.statusText}`,
            );
        }
        // error can also be just in the body like that:
        // {
        // "payload": {
        //     "message": "duplicate key value violates unique constraint \"edi_exchange_record_external_identifier_uniq\"\nDETAIL:
        // Key (external_identifier, backend_id, type_id)=(321, 1, 1) already exists.\n",
        //     "ok": false
        // }
        // }
        const responseBody = response.data;
        if (responseBody?.payload?.ok === false) {
            throw new Error(
                `Failed to send order to Odoo EDI: ${responseBody.payload.message}`,
            );
        }

        // success message: {
        // "payload": {
        //     "data": {
        //     "id": 13,
        //     "order_number": "322"
        //     },
        //     "message": "Exchange record to create order successfully created.",
        //     "ok": true
        //     }
        //     }
        const exchangeRecordId = responseBody?.payload?.data?.id;
        if (!exchangeRecordId) {
            throw new Error(
                `Failed to send order to Odoo EDI: ${responseBody.payload.message}`,
            );
        }
        this.logger.info(
            `Successfully sent order to Odoo EDI. Exchange record: ${exchangeRecordId}`,
        );
        return exchangeRecordId;
    }

    /**
     * The EDI service is an async processing service.
     * We need to pull the status of the processing from
     * a different endpoint
     */
    // private async getOrderExchangeStatus(
    //     exchangeRecordId: string,
    // ): Promise<any> {
    //     const url = `${this.kencoveApiApp.ediEndpoint}/api/v1/custom/saleor/exchange_record_status?id=${exchangeRecordId}&db=kencove_20231224}`;
    //     const response = await axios.get(url);
    //     if (response.status !== 200) {
    //         throw new Error(
    //             `Failed to get order exchange status from Odoo EDI: ${response.statusText}`,
    //         );
    //     }
    //     return response.data;
    // }

    public async sync(): Promise<void> {
        // Get all unprocessed orders from the database
        const schemabaseOrders = await this.db.order.findMany({
            where: {
                tenantId: this.kencoveApiApp.tenantId,
                kencoveApiOrders: {
                    none: {
                        kencoveApiAppId: this.kencoveApiApp.id,
                    },
                },
            },
            include: {
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
            },
        });

        this.logger.info(`Found ${schemabaseOrders.length} orders to sync`);

        // Send each order to Odoo EDI endpoint
        for (const schemabaseOrder of schemabaseOrders) {
            const order = {
                orderNumber: schemabaseOrder.orderNumber,
                date: schemabaseOrder.date,
                status: schemabaseOrder.orderStatus,
                mainContact: {
                    email: schemabaseOrder.mainContact.email,
                    firstName: schemabaseOrder.mainContact.firstName,
                    lastName: schemabaseOrder.mainContact.lastName,
                    phone: schemabaseOrder.mainContact.phone,
                    odooContactId:
                        schemabaseOrder.mainContact.kencoveApiContacts[0]?.id,
                },
                shippingAddress: {
                    fullName: schemabaseOrder?.shippingAddress?.fullname,
                    company: schemabaseOrder.shippingAddress?.company,
                    street: schemabaseOrder.shippingAddress?.street,
                    street2:
                        schemabaseOrder.shippingAddress?.additionalAddressLine,
                    odooAddressId:
                        schemabaseOrder.shippingAddress?.kencoveApiAddress[0]
                            ?.id,
                },
                billingAddress: {
                    fullName: schemabaseOrder?.billingAddress?.fullname,
                    company: schemabaseOrder.billingAddress?.company,
                    street: schemabaseOrder.billingAddress?.street,
                    street2:
                        schemabaseOrder.billingAddress?.additionalAddressLine,
                    odooAddressId:
                        schemabaseOrder.billingAddress?.kencoveApiAddress[0]
                            ?.id,
                },
                orderLineItems: schemabaseOrder.orderLineItems.map(
                    (orderLineItem) => {
                        return {
                            quantity: orderLineItem.quantity,
                            totalPriceGross: orderLineItem.totalPriceGross,
                            productVariant: {
                                sku: orderLineItem.productVariant.sku,
                                name: orderLineItem.productVariant.variantName,
                                odooProductId:
                                    orderLineItem.productVariant
                                        .kencoveApiProductVariant[0]?.id,
                            },
                            warehouse: {
                                name: orderLineItem.warehouse?.name,
                                odooWarehouseId:
                                    orderLineItem?.warehouse
                                        ?.kencoveApiWarehouse[0]?.id,
                            },
                        };
                    },
                ),
            };
            await this.sendOrderToOdooEDI(order);
        }
    }
}
