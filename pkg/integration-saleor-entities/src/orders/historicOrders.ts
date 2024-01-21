// Saleor class SaleorHistoricOrders sync, that is part of the syncFromECI workflow.
// It is responsible of fetching orders, from customers in Saleor, that have been created in other systems than Saleor
// and syncing them to Saleor. The bulkOrderCreate endpoint can take max 50 orders at once

import { ILogger } from "@eci/pkg/logger";
import {
    Address,
    CountryCode,
    InstalledSaleorApp,
    Language,
    OrderLineItem,
    OrderStatus as OrderStatusSchemabase,
    Payment,
    PaymentMethod,
    PrismaClient,
    Product,
    ProductVariant,
    SaleorProductVariant,
    SaleorTaxClass,
    SaleorWarehouse,
    Tax,
    Warehouse,
} from "@eci/pkg/prisma";
import {
    AddressInput,
    ErrorPolicyEnum,
    InputMaybe,
    LanguageCodeEnum,
    OrderBulkCreateInput,
    OrderBulkCreateOrderLineInput,
    OrderStatus,
    SaleorClient,
    CountryCode as SaleorCountryCode,
    TransactionCreateInput,
} from "@eci/pkg/saleor";

// Saleor. It is using the bulkOrderCreate endpoint of Saleor to create these orders in Saleor.
export class SaleorHistoricOrdersSync {
    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

    private readonly db: PrismaClient;

    private readonly installedSaleorApp: InstalledSaleorApp;

    private readonly tenantId: string;

    constructor({
        logger,
        saleorClient,
        db,
        installedSaleorApp,
        tenantId,
    }: {
        logger: ILogger;
        saleorClient: SaleorClient;
        db: PrismaClient;
        installedSaleorApp: InstalledSaleorApp;
        tenantId: string;
    }) {
        this.logger = logger;
        this.saleorClient = saleorClient;
        this.db = db;
        this.installedSaleorApp = installedSaleorApp;
        this.tenantId = tenantId;
    }

    /**
     * Our country codes are actually the same as saleors. We just
     * validate them here dynamically and return the right type
     * @param countryCode
     * @returns
     */
    private schemabaseCountryCodeToSaleorCountryCode(
        countryCode: CountryCode,
    ): SaleorCountryCode {
        const countryCodeValid = Object.values(SaleorCountryCode).includes(
            countryCode as any,
        );

        if (!countryCodeValid)
            this.logger.error(
                `Received non valid country code: ${countryCode}`,
            );

        return countryCode as SaleorCountryCode;
    }

    private schemabaseAddressToSaleorAddress(address: Address): AddressInput {
        /**
         * We don't have separated first and last name, but just fullname
         * We just write the first part of the name to firstName and the rest to lastName
         */
        const nameParts = (address?.fullname || "Name Missing").split(" ");
        const firstName = nameParts.shift();
        const lastName = nameParts.join(" ");
        if (!address?.countryCode)
            throw new Error(
                `No countryCode. This should never happen: ${JSON.stringify(
                    address,
                )}`,
            );
        this.logger.debug("schemabaseAddressToSaleorAddress", {
            firstName,
            lastName,
            companyName: address.company,
            phone: address.phone,
            streetAddress1: address.street,
            streetAddress2: address.additionalAddressLine,
            postalCode: address.plz,
            city: address.city,
            country: this.schemabaseCountryCodeToSaleorCountryCode(
                address.countryCode,
            ),
        });
        return {
            firstName,
            lastName,
            companyName: address.company,
            phone: address.phone,
            streetAddress1: address.street,
            streetAddress2: address.additionalAddressLine,
            postalCode: address.plz,
            city: address.city,
            countryArea: address.state,
            country: this.schemabaseCountryCodeToSaleorCountryCode(
                address.countryCode,
            ),
        };
    }

    /**
     * From schemabase order status to saleor order status
     * @param orderStatus
     * @returns
     */
    private schemabaseOrderStatusToSaleorOrderStatus(
        orderStatus: OrderStatusSchemabase,
    ): OrderStatus {
        const orderStatusMapping: {
            [key in OrderStatusSchemabase]: OrderStatus;
        } = {
            [OrderStatusSchemabase.canceled]: OrderStatus.Canceled,
            [OrderStatusSchemabase.closed]: OrderStatus.Fulfilled,
            [OrderStatusSchemabase.confirmed]: OrderStatus.Unfulfilled,
            [OrderStatusSchemabase.draft]: OrderStatus.Draft,
            [OrderStatusSchemabase.unconfirmed]: OrderStatus.Unconfirmed,
        };
        return orderStatusMapping[orderStatus];
    }

    private schemabaseLanguageToSaleorLanguage(
        language: Language,
    ): LanguageCodeEnum {
        switch (language) {
            case Language.DE:
                return LanguageCodeEnum.De;
            case Language.EN:
                return LanguageCodeEnum.En;
            default:
                return LanguageCodeEnum.De;
        }
    }

    /**
     * Transforms schemabase internal orderlines to saleor orderlines,
     * that can be used with the bulkOrderCreate endpoint
     * @param orderLineItems
     * @returns
     */
    private orderLineItemsToLines(
        orderLineItems: (OrderLineItem & {
            warehouse:
                | (Warehouse & { saleorWarehouse: SaleorWarehouse[] })
                | null;
            productVariant: ProductVariant & {
                product: Product;
                saleorProductVariant: SaleorProductVariant[];
                salesTax?:
                    | (Tax & {
                          saleorTaxClasses?: SaleorTaxClass[];
                      })
                    | null;
            };
        })[],
        defaultSaleorTaxRateId?: string,
    ): OrderBulkCreateOrderLineInput[] {
        return orderLineItems
            .filter((o) => o.quantity > 0)
            .map((line) => {
                if (!line.totalPriceGross)
                    throw new Error(
                        `No totalPriceGross. This should never happen: ${JSON.stringify(
                            line,
                        )}`,
                    );
                const warehouseId =
                    line?.warehouse?.saleorWarehouse?.[0]?.id ||
                    line.warehouseId;
                if (!warehouseId)
                    throw new Error(`No warehouseId. This should never happen`);
                const saleorProductVariantId =
                    line?.productVariant?.saleorProductVariant?.[0]?.id;
                const saleorTaxClass =
                    line?.productVariant?.salesTax?.saleorTaxClasses?.[0]?.id ||
                    defaultSaleorTaxRateId;
                if (!saleorTaxClass)
                    throw new Error(
                        `No saleorTaxClass and no default saleor tax class given for line item with SKU ${line.productVariant.sku} `,
                    );
                return {
                    createdAt: line.createdAt,
                    isGiftCard: false,
                    isShippingRequired: false,
                    productName: line.productVariant.product.name,
                    variantName: line.productVariant.variantName,
                    taxClassId: saleorTaxClass,
                    variantId: saleorProductVariantId ?? undefined,
                    quantity: line.quantity,
                    undiscountedTotalPrice: {
                        gross:
                            line.undiscountedTotalPriceGross ||
                            line.totalPriceGross,
                        net:
                            line.undiscountedTotalPriceNet ||
                            line.totalPriceNet,
                    },
                    totalPrice: {
                        gross: line.totalPriceGross,
                        net: line.totalPriceNet,
                    },
                    warehouse: warehouseId,
                };
            });
    }

    private schemabasePaymentToSaleorTransaction(
        payments:
            | (Payment & {
                  paymentMethod: PaymentMethod;
              })[]
            | null,
    ): InputMaybe<TransactionCreateInput[]> {
        if (!payments) return [];
        return payments.map((p) => {
            return {
                pspReference: p.referenceNumber,
                amountCharged: {
                    amount: p.amount,
                    currency: p.currency || "USD",
                },
            };
        });
    }

    // private schemabasePackageToFulfillment(
    //     packages: (Package & {
    //         packageLineItems: (PackageLineItem & {
    //             warehouse: any;
    //         })[];
    //     })[],
    // ): InputMaybe<Array<OrderBulkCreateFulfillmentInput>> {
    //     return packages.map((p) => {
    //         return {
    //             trackingCode: p.trackingId,
    //             lines: p.packageLineItems.map((l, i) => {
    //                 return {
    //                     orderLineIndex: i,
    //                     quantity: l.quantity,
    //                     warehouse: l.warehouse.saleorWarehouse[0].id as string,
    //                 };
    //             }),
    //         };
    //     });
    // }

    /**
     * Taking schemabase order schema and trying to transform it to saleor order schema.
     * Proceed only with orders, that match the schema
     * @param orders
     * @returns
     */
    private ordersToBulkOrders(
        orders: any,
        defaultSaleorTaxRateId?: string,
    ): OrderBulkCreateInput[] {
        const returningBulkOrdes: OrderBulkCreateInput[] = [];
        for (const order of orders) {
            try {
                const transformedOrder = {
                    status: this.schemabaseOrderStatusToSaleorOrderStatus(
                        order.orderStatus,
                    ),
                    channel: this.installedSaleorApp.defaultChannelSlug || "",
                    externalReference: order.orderNumber,
                    currency: order.currency,
                    createdAt: order.date,
                    shippingAddress: this.schemabaseAddressToSaleorAddress(
                        (order.shippingAddress ||
                            order.billingAddress) as Address,
                    ),
                    billingAddress: this.schemabaseAddressToSaleorAddress(
                        (order.billingAddress ||
                            order.shippingAddress) as Address,
                    ),
                    user: {
                        /**
                         * Either use saleor customer id or email address
                         */
                        id: order.mainContact.saleorCustomers[0].id,
                        email: !order.mainContact.saleorCustomers[0].id
                            ? order.mainContact.email
                            : undefined,
                    },

                    lines: this.orderLineItemsToLines(
                        order.orderLineItems,
                        defaultSaleorTaxRateId,
                    ),
                    // payments: order.payments,
                    // packages: order.packages,
                    languageCode: this.schemabaseLanguageToSaleorLanguage(
                        order.language,
                    ),
                    deliveryMethod: {
                        shippingMethodName: order.carrier,
                        shippingPrice: {
                            gross: order.shippingPriceGross || 0,
                            net: order.shippingPriceNet || 0,
                        },
                    },
                    // fulfillments: this.schemabasePackageToFulfillment(
                    //     order.packages,
                    // ),
                    transactions: this.schemabasePaymentToSaleorTransaction(
                        order.payments,
                    ),
                };
                returningBulkOrdes.push(transformedOrder);
            } catch (error) {
                this.logger.error(
                    `Error while transforming order ${order.orderNumber} to saleor order: ${error}`,
                );
            }
        }

        return returningBulkOrdes;
    }

    public async syncHistoricOrders(): Promise<void> {
        const orders = await this.db.order.findMany({
            where: {
                saleorOrders: {
                    none: {
                        installedSaleorAppId: this.installedSaleorApp.id,
                    },
                },
                mainContact: {
                    saleorCustomers: {
                        some: {
                            installedSaleorAppId: this.installedSaleorApp.id,
                        },
                    },
                },
            },
            include: {
                shippingAddress: true,
                billingAddress: true,
                mainContact: {
                    include: {
                        saleorCustomers: {
                            where: {
                                installedSaleorAppId:
                                    this.installedSaleorApp.id,
                            },
                        },
                    },
                },
                orderLineItems: {
                    include: {
                        warehouse: {
                            include: {
                                saleorWarehouse: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorApp.id,
                                    },
                                },
                            },
                        },
                        productVariant: {
                            include: {
                                salesTax: {
                                    include: {
                                        saleorTaxClasses: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorApp.id,
                                            },
                                        },
                                    },
                                },
                                saleorProductVariant: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorApp.id,
                                    },
                                },
                                product: true,
                            },
                        },
                    },
                },
                payments: true,
                packages: {
                    include: {
                        packageLineItems: {
                            include: {
                                warehouse: {
                                    include: {
                                        saleorWarehouse: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorApp.id,
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

        /**
         * When we don't have the tax class of an item, we can take this
         * default saleor tax rate.
         */
        const defaultSaleorTaxRateId = (
            await this.db.saleorTaxClass.findFirst({
                where: {
                    installedSaleorAppId: this.installedSaleorApp.id,
                    fallback: true,
                },
            })
        )?.id;

        if (orders.length === 0) {
            this.logger.info("No historic orders for saleor customers found");
            return;
        }

        this.logger.info(
            `Found ${orders.length} historic orders for saleor customers`,
        );

        /**
         * filter orders for which we have no saleor customer id or no shipping or billing address
         * we need to manually tell typescript, that these properties are no longer optional
         */
        const filteredOrders = orders.filter((order) => {
            if (!order.mainContact.saleorCustomers[0].id) {
                this.logger.warn(
                    `No saleor customer id for order ${order.orderNumber}. This should never happen`,
                );
                return false;
            }
            if (!order.shippingAddress && !order.billingAddress) {
                this.logger.warn(
                    `No shippingAddress and billing address for order ${order.orderNumber}. This should never happen`,
                );
                return false;
            }
            if (!order.shippingAddress && order.billingAddress) {
                this.logger.warn(
                    `No shippingAddress for order ${order.orderNumber}. Setting billing address as shipping address`,
                );
                order.shippingAddress = order.billingAddress;
            }
            if (!order.billingAddress && order.shippingAddress) {
                this.logger.warn(
                    `No billingAddress for order ${order.orderNumber}. Setting shipping address as billing address`,
                );
                order.billingAddress = order.shippingAddress;
            }
            return true;
        });

        try {
            const orderInput = this.ordersToBulkOrders(
                filteredOrders,
                defaultSaleorTaxRateId,
            );

            const chunkSize = 50;
            const chunks = [];
            for (let i = 0; i < orderInput.length; i += chunkSize) {
                chunks.push(orderInput.slice(i, i + chunkSize));
            }

            for (const chunk of chunks) {
                this.logger.debug("Sending bulkOrderCreate request", {
                    chunk: JSON.stringify(chunk),
                });
                const bulkOrderCreateResponse =
                    await this.saleorClient.bulkOrderCreate({
                        orders: chunk,
                        errorPolicy: ErrorPolicyEnum.IgnoreFailed,
                    });
                const bulkOrderResultErrors =
                    bulkOrderCreateResponse.orderBulkCreate?.results
                        .filter((x) => x.errors && x.errors?.length > 0)
                        .flatMap((x) => x.errors);
                if (
                    bulkOrderResultErrors &&
                    bulkOrderResultErrors?.length > 0
                ) {
                    for (const error of bulkOrderResultErrors) {
                        /**
                         * we already created an order with this externalReference. We store
                         * the corresponding Saleor Id in our DB. We need to parse the external
                         * reference out of the message field: "message":"Order with external_reference: 7331981 already exists."
                         */
                        if (
                            error?.code === "UNIQUE" &&
                            error.path === "external_reference"
                        ) {
                            const externalReference =
                                error.message?.split(" ")[3];
                            this.logger.info(error.message as string);
                            if (!externalReference) {
                                this.logger.error(
                                    "Could not parse external reference from error message",
                                );
                                continue;
                            }
                            console.log("external refernce", externalReference);
                            const saleorOrder =
                                await this.saleorClient.orderByReference({
                                    externalReference,
                                });
                            const saleorOrderId = saleorOrder.order?.id;
                            if (!saleorOrderId) {
                                this.logger.error(
                                    `Could not find saleor order with external reference "${externalReference}"`,
                                );
                                continue;
                            }
                            await this.db.saleorOrder.upsert({
                                where: {
                                    id_installedSaleorAppId: {
                                        id: saleorOrderId,
                                        installedSaleorAppId:
                                            this.installedSaleorApp.id,
                                    },
                                },
                                create: {
                                    id: saleorOrderId,
                                    createdAt: new Date(),
                                    installedSaleorApp: {
                                        connect: {
                                            id: this.installedSaleorApp.id,
                                        },
                                    },
                                    order: {
                                        connect: {
                                            orderNumber_tenantId: {
                                                orderNumber: externalReference,
                                                tenantId: this.tenantId,
                                            },
                                        },
                                    },
                                },
                                update: {
                                    order: {
                                        connect: {
                                            orderNumber_tenantId: {
                                                orderNumber: externalReference,
                                                tenantId: this.tenantId,
                                            },
                                        },
                                    },
                                },
                            });
                        } else {
                            this.logger.error(JSON.stringify(error));
                        }
                    }
                }
                if (
                    bulkOrderCreateResponse.orderBulkCreate?.errors &&
                    bulkOrderCreateResponse.orderBulkCreate?.errors?.length > 0
                ) {
                    this.logger.error(
                        `Error while creating historic orders in saleor: ${JSON.stringify(
                            bulkOrderCreateResponse.orderBulkCreate?.errors,
                        )}`,
                    );
                    continue;
                }
                const results =
                    bulkOrderCreateResponse.orderBulkCreate?.results || [];
                const successfulOrders = results.filter(
                    (r) => r.order && r.order?.id,
                );
                this.logger.info(
                    `Successfully created ${successfulOrders.length} historic orders in saleor`,
                    {
                        successfulOrders: successfulOrders.map(
                            (o) => o.order?.externalReference,
                        ),
                    },
                );
                if (!bulkOrderCreateResponse.orderBulkCreate?.results) {
                    this.logger.error(
                        `No results in bulkOrderCreate response. This should never happen`,
                    );
                    throw new Error(
                        `No results in bulkOrderCreate response. This should never happen`,
                    );
                }
                for (const result of successfulOrders) {
                    if (!result?.order?.id || !result.order.externalReference)
                        continue;
                    await this.db.order.update({
                        where: {
                            orderNumber_tenantId: {
                                orderNumber: result.order.externalReference,
                                tenantId: this.tenantId,
                            },
                        },
                        data: {
                            saleorOrders: {
                                create: {
                                    id: result.order.id,
                                    createdAt: new Date(),
                                    installedSaleorApp: {
                                        connect: {
                                            id: this.installedSaleorApp.id,
                                        },
                                    },
                                },
                            },
                        },
                    });
                }
            }
        } catch (error) {
            this.logger.error(
                `Error while creating historic orders in saleor: ${error}`,
            );
        }
    }
}
