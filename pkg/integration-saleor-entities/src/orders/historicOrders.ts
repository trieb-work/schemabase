// Saleor class SaleorHistoricOrders sync, that is part of the syncFromECI workflow.
// It is responsible of fetching orders, from customers in Saleor, that have been created in other systems than Saleor
// and syncing them to Saleor. The bulkOrderCreate endpoint can take max 50 orders at once

import { ILogger } from "@eci/pkg/logger";
import {
    Address,
    InstalledSaleorApp,
    Language,
    OrderLineItem,
    OrderStatus as OrderStatusSchemabase,
    PrismaClient,
    Product,
    ProductVariant,
    SaleorWarehouse,
    Warehouse,
} from "@eci/pkg/prisma";
import {
    AddressInput,
    BulkOrderCreateMutationVariables,
    LanguageCodeEnum,
    OrderBulkCreateOrderLineInput,
    OrderStatus,
    SaleorClient,
} from "@eci/pkg/saleor";

// Saleor. It is using the bulkOrderCreate endpoint of Saleor to create these orders in Saleor.
export class SaleorHistoricOrdersSync {
    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

    private readonly db: PrismaClient;

    private readonly installedSaleorApp: InstalledSaleorApp;

    constructor({
        logger,
        saleorClient,
        db,
        installedSaleorApp,
    }: {
        logger: ILogger;
        saleorClient: SaleorClient;
        db: PrismaClient;
        installedSaleorApp: InstalledSaleorApp;
    }) {
        this.logger = logger;
        this.saleorClient = saleorClient;
        this.db = db;
        this.installedSaleorApp = installedSaleorApp;
    }

    private schemabaseAddressToSaleorAddress(address: Address): AddressInput {
        /**
         * We don't have separated first and last name, but just fullname
         * We just write the first part of the name to firstName and the rest to lastName
         */
        const nameParts = (address?.fullname || "Name Missing").split(" ");
        const firstName = nameParts.shift();
        const lastName = nameParts.join(" ");
        return {
            firstName,
            lastName,
            companyName: address.company,
            phone: address.phone,
            streetAddress1: address.street,
            streetAddress2: address.additionalAddressLine,
            postalCode: address.plz,
            city: address.city,
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
            productVariant: ProductVariant & { product: Product };
        })[],
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
                return {
                    createdAt: line.createdAt,
                    isGiftCard: false,
                    isShippingRequired: true,
                    productName: line.productVariant.product.name,
                    variantName: line.productVariant.variantName,
                    variantSku: line.productVariant.sku,
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
                                product: true,
                            },
                        },
                    },
                },
                payments: true,
                packages: true,
            },
        });

        if (orders.length === 0) {
            this.logger.info("No historic orders for saleor customers found");
            return;
        }

        this.logger.info(
            `Found ${orders.length} historic orders for saleor customers`,
        );

        try {
            const orderInput: BulkOrderCreateMutationVariables["orders"] =
                orders.map((order) => ({
                    status: this.schemabaseOrderStatusToSaleorOrderStatus(
                        order.orderStatus,
                    ),
                    channel: this.installedSaleorApp.channelSlug || "",
                    externalReference: order.orderNumber,
                    currency: order.currency,
                    createdAt: order.date,
                    shippingAddress: order.shippingAddress
                        ? this.schemabaseAddressToSaleorAddress(
                              order.shippingAddress,
                          )
                        : {},
                    billingAddress: order.billingAddress
                        ? this.schemabaseAddressToSaleorAddress(
                              order.billingAddress,
                          )
                        : {},
                    user: {
                        id: order.mainContact.saleorCustomers[0].id,
                        email: order.mainContact.email,
                    },
                    lines: this.orderLineItemsToLines(order.orderLineItems),
                    // payments: order.payments,
                    // packages: order.packages,
                    languageCode: this.schemabaseLanguageToSaleorLanguage(
                        order.language,
                    ),
                }));

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
                    });
                if (
                    bulkOrderCreateResponse.orderBulkCreate?.errors &&
                    bulkOrderCreateResponse.orderBulkCreate?.errors?.length > 0
                ) {
                    this.logger.error(
                        `Error while creating historic orders in saleor: ${JSON.stringify(
                            bulkOrderCreateResponse.orderBulkCreate.errors,
                        )}`,
                    );
                    throw new Error(
                        `Error while creating historic orders in saleor: ${JSON.stringify(
                            bulkOrderCreateResponse.orderBulkCreate.errors,
                        )}`,
                    );
                }
                this.logger.info(
                    `Successfully created ${chunk.length} historic orders in saleor`,
                );
                if (!bulkOrderCreateResponse.orderBulkCreate?.results) {
                    this.logger.error(
                        `No results in bulkOrderCreate response. This should never happen`,
                    );
                    throw new Error(
                        `No results in bulkOrderCreate response. This should never happen`,
                    );
                }
                for (const result of bulkOrderCreateResponse!.orderBulkCreate!
                    .results) {
                    if (!result?.order?.id) {
                        this.logger.error(
                            `No order id in bulkOrderCreate response. This should never happen`,
                            {
                                order: JSON.stringify(result.order),
                            },
                        );
                        throw new Error(
                            `No order id in bulkOrderCreate response. This should never happen`,
                        );
                    }
                    await this.db.order.update({
                        where: {
                            id: result.order.id,
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
