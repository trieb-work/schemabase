import axios from "axios";
import { ILogger } from "@eci/pkg/logger";
import {
    KencoveApiApp,
    KencoveApiContact,
    Payment,
    PaymentMethod,
    PrismaClient,
} from "@eci/pkg/prisma";
import { krypto } from "@eci/pkg/krypto";

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
        const url = `${this.kencoveApiApp.ediEndpoint}`;
        if (!url) throw new Error("EDI endpoint is not configured");
        const response = await axios.post(url, order);
        if (response.status !== 200) {
            if (response.statusText.includes("duplicate key value violates")) {
                // if the order already exists in Odoo, we don't need to send it again
                this.logger.info(
                    `Order already exists in Odoo. We don't need to send it again.`,
                );
                return;
            }
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
            if (
                responseBody.payload.message.includes(
                    "duplicate key value violates",
                )
            ) {
                // if the order already exists in Odoo, we don't need to send it again
                this.logger.info(
                    `Order already exists in Odoo. We don't need to send it again.`,
                );
                return;
            }
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

    private getOdooContactId(
        kencoveApiContacts: KencoveApiContact[],
    ): string | undefined {
        if (kencoveApiContacts.length === 0) {
            return undefined;
        }
        if (kencoveApiContacts.length === 1) {
            return kencoveApiContacts[0].id;
        }
        // if there are multiple contacts, we can't match them savely.
        // in this case, we don't send the contact to Odoo EDI
        this.logger.warn(
            `Multiple contacts found for the same order. We can't match them savely. We will not send the contact to Odoo EDI.`,
        );
        return undefined;
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

    private async schemabaseToOdooPayments(
        payments: (Payment & { paymentMethod: PaymentMethod })[],
    ) {
        const returnPayments = [];
        for (const payment of payments) {
            const metadataString = payment.metadataJson
                ? await krypto.decrypt(payment.metadataJson as string)
                : undefined;
            const metadata = metadataString
                ? JSON.parse(metadataString)
                : undefined;

            returnPayments.push({
                amount: payment.amount,
                currency: payment.currency,
                created: payment.date,
                acquirerReference: payment.referenceNumber,
                paymentMethod: payment.paymentMethod.gatewayType,
                paymentMetadata: metadata,
                /**
                 * should be "authorized" | "sale"
                 */
                state:
                    payment.status === "authorized"
                        ? "authorized"
                        : payment.status === "paid"
                        ? "sale"
                        : "",
            });
        }
        return returnPayments;
    }

    public async sync(): Promise<void> {
        if (!this.kencoveApiApp.ediEndpoint) {
            this.logger.warn(
                `EDI endpoint is not configured. We will not send any orders to Odoo EDI.`,
            );
            return;
        }

        // Get all unprocessed orders from the database
        const schemabaseOrders = await this.db.order.findMany({
            where: {
                tenantId: this.kencoveApiApp.tenantId,
                kencoveApiOrders: {
                    none: {
                        kencoveApiAppId: this.kencoveApiApp.id,
                    },
                },
                orderStatus: {
                    notIn: ["canceled", "closed", "draft"],
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
                payments: {
                    include: {
                        paymentMethod: true,
                    },
                },
            },
        });

        this.logger.info(`Found ${schemabaseOrders.length} orders to sync`);

        // Send each order to Odoo EDI endpoint
        for (const schemabaseOrder of schemabaseOrders) {
            if (schemabaseOrder.payments.length === 0) {
                this.logger.warn(
                    `Order ${schemabaseOrder.orderNumber} has no payments. We will not send it to Odoo EDI.`,
                );
                continue;
            }
            const order = {
                orderNumber: schemabaseOrder.orderNumber,
                externalIdentifier1: schemabaseOrder.id,
                externalIdentifier2: schemabaseOrder.referenceNumber,
                date: schemabaseOrder.date,
                status: schemabaseOrder.orderStatus,
                totalPriceGross: schemabaseOrder.totalPriceGross,
                totalPriceNet: schemabaseOrder.totalPriceNet,
                mainContact: {
                    email: schemabaseOrder.mainContact.email,
                    firstName: schemabaseOrder.mainContact.firstName,
                    lastName: schemabaseOrder.mainContact.lastName,
                    phone: schemabaseOrder.mainContact.phone,
                    odooContactId: this.getOdooContactId(
                        schemabaseOrder.mainContact.kencoveApiContacts,
                    ),
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
                    countryCode: schemabaseOrder.shippingAddress?.countryCode,
                    state: schemabaseOrder.shippingAddress?.state,
                    zip: schemabaseOrder.shippingAddress?.plz,
                    city: schemabaseOrder.shippingAddress?.city,
                    phone: schemabaseOrder.shippingAddress?.phone,
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
                    countryCode: schemabaseOrder.billingAddress?.countryCode,
                    state: schemabaseOrder.billingAddress?.state,
                    zip: schemabaseOrder.billingAddress?.plz,
                    city: schemabaseOrder.billingAddress?.city,
                    phone: schemabaseOrder.shippingAddress?.phone,
                },
                orderLineItems: schemabaseOrder.orderLineItems.map(
                    (orderLineItem) => {
                        return {
                            quantity: orderLineItem.quantity,
                            totalPriceGross: orderLineItem.totalPriceGross,
                            totalPriceNet: orderLineItem.totalPriceNet,
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
                payments: await this.schemabaseToOdooPayments(
                    schemabaseOrder.payments,
                ),
                shippingMethod: {
                    totalPriceGross: schemabaseOrder.shippingPriceGross,
                    name: schemabaseOrder.shippingMethodName,
                    id: schemabaseOrder.shippingMethodId,
                },
            };
            this.logger.info(`Sending order ${order.orderNumber} to Odoo EDI`);
            await this.sendOrderToOdooEDI(order);
        }
    }
}
