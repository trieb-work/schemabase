/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
    queryWithPagination,
    OrderStatus,
    PaymentChargeStatusEnum,
    LanguageCodeEnum,
    SaleorClient,
} from "@eci/pkg/saleor";
import {
    PrismaClient,
    OrderStatus as InternalOrderStatus,
    OrderPaymentStatus as InternalOrderPaymentStatus,
    Prisma,
    Tax,
    Language,
    InstalledSaleorApp,
} from "@eci/pkg/prisma";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";

import { CronStateHandler } from "@eci/pkg/cronstate";
import { subYears, subHours } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/utils/uniqueStringOrderline";
import { round } from "reliable-round";
import { normalizeStrings } from "@eci/pkg/normalization";
import addresses from "../addresses";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { shippingMethodMatch } from "@eci/pkg/utils/shippingMethodMatch";
import { SaleorHistoricOrdersSync } from "./historicOrders";

interface SaleorOrderSyncServiceConfig {
    saleorClient: SaleorClient;
    channelSlug: string;
    installedSaleorApp: InstalledSaleorApp;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    orderPrefix: string;
}

export class SaleorOrderSyncService {
    public readonly saleorClient: SaleorClient;

    public readonly channelSlug: string;

    private readonly logger: ILogger;

    public readonly installedSaleorApp: InstalledSaleorApp;

    public readonly tenantId: string;

    private readonly cronState: CronStateHandler;

    private readonly db: PrismaClient;

    private readonly orderPrefix: string;

    private eciTaxes: Tax[] | [];

    public constructor(config: SaleorOrderSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.channelSlug = config.channelSlug;
        this.logger = config.logger;
        this.installedSaleorApp = config.installedSaleorApp;
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.orderPrefix = config.orderPrefix;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.installedSaleorApp.id,
            db: this.db,
            syncEntity: "orders",
        });
        this.eciTaxes = [];
    }

    /**
     * Lookup table, that is storing all available taxes to save DB calls
     * @param taxPercentage
     */
    public async lookupECITax(
        taxPercentage: number,
    ): Promise<string | undefined> {
        if (this.eciTaxes.length === 0) {
            this.eciTaxes = await this.db.tax.findMany({
                where: {
                    tenantId: this.tenantId,
                },
            });
        }
        return this.eciTaxes.find((t) => t.percentage === taxPercentage)?.id;
    }

    /**
     * Function to match the saleor language code to the internal language enum
     * @param language
     * @returns
     */
    private matchLanguage(language: LanguageCodeEnum): Language {
        switch (language) {
            case LanguageCodeEnum.De:
                return Language.DE;
            case LanguageCodeEnum.En:
                return Language.EN;
            default:
                return Language.EN;
        }
    }

    /**
     * Function to convert the saleor order id to the saleor order token
     * @param saleorId
     * @returns
     */
    private idToToken(saleorId: string): string {
        return Buffer.from(saleorId, "base64")
            .toString("utf8")
            .split("Order:")[1];
    }

    /**
     * function to convert the base64 encoded id, that looks decoded like that:
     * app:kencove-shipping.app:18014 -> we return just 18014
     * @param shippingMethodId
     * @returns
     */
    private shippingMethodIdDecode(shippingMethodId: string): string {
        return Buffer.from(shippingMethodId, "base64")
            .toString("utf8")
            .split("app:")[2];
    }

    public async syncToECI(): Promise<void> {
        const cronState = await this.cronState.get();

        const now = new Date();
        let createdGte: string;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2).toISOString();
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3).toISOString();
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for all orders with lastUpdated GTE.`,
            );
        }

        const result = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorCronOrdersOverview({
                first,
                after,
                updatedAtGte: createdGte,
            }),
        );

        if (!result.orders || result.orders.edges.length === 0) {
            this.logger.info("Saleor returned no orders. Don't sync anything");
            return;
        }
        const orders = result.orders.edges.map((order) => order.node);

        this.logger.info(`Working on ${orders.length} orders`);

        for (const order of orders) {
            try {
                if (!order.number || typeof order.number === "undefined") {
                    throw new Error(`No orderNumber in order. Can't sync.`);
                }

                if (order.externalReference) {
                    this.logger.info(
                        `Saleor order has externalRefernce ${order.externalReference} set. Using this as ordernumber instead of ${order.number}.`,
                    );
                }
                const prefixedOrderNumber =
                    order.externalReference ??
                    `${this.orderPrefix}-${order.number}`;

                if (!order.userEmail) {
                    throw new Error(
                        `No user email given for order. Can't sync.`,
                    );
                }

                const email = order.userEmail.toLowerCase();
                const companyName = order.billingAddress?.companyName;

                const discountCode = order.voucher?.code;

                const orderToken = this.idToToken(order.id);

                const companyCreateOrConnect: Prisma.CompanyCreateNestedOneWithoutContactsInput =
                    companyName
                        ? {
                              connectOrCreate: {
                                  where: {
                                      normalizedName_tenantId: {
                                          normalizedName:
                                              normalizeStrings.companyNames(
                                                  companyName,
                                              ),
                                          tenantId: this.tenantId,
                                      },
                                  },
                                  create: {
                                      id: id.id("company"),
                                      name: companyName,
                                      normalizedName:
                                          normalizeStrings.companyNames(
                                              companyName,
                                          ),
                                      tenant: {
                                          connect: {
                                              id: this.tenantId,
                                          },
                                      },
                                  },
                              },
                          }
                        : {};
                const contactCreateOrConnect = {
                    connectOrCreate: {
                        where: {
                            email_tenantId: {
                                email,
                                tenantId: this.tenantId,
                            },
                        },
                        create: {
                            id: id.id("contact"),
                            email,
                            firstName: order.billingAddress?.firstName,
                            lastName: order.billingAddress?.lastName,
                            company: companyCreateOrConnect,
                            tenant: {
                                connect: {
                                    id: this.tenantId,
                                },
                            },
                        },
                    },
                };

                const orderStatusMapping: {
                    [key in OrderStatus]: InternalOrderStatus;
                } = {
                    [OrderStatus.Canceled]: "canceled",
                    [OrderStatus.Draft]: "draft",
                    [OrderStatus.Unfulfilled]: "confirmed",
                    [OrderStatus.Fulfilled]: "confirmed",
                    [OrderStatus.PartiallyFulfilled]: "confirmed",
                    [OrderStatus.Returned]: "confirmed",
                    [OrderStatus.Unconfirmed]: "unconfirmed",
                    [OrderStatus.PartiallyReturned]: "confirmed",
                    [OrderStatus.Expired]: "canceled",
                };
                const orderStatus = orderStatusMapping[order.status];

                const paymentStatusMapping: {
                    [key in PaymentChargeStatusEnum]: InternalOrderPaymentStatus;
                } = {
                    [PaymentChargeStatusEnum.Cancelled]: "unpaid",
                    [PaymentChargeStatusEnum.FullyCharged]: "fullyPaid",
                    [PaymentChargeStatusEnum.FullyRefunded]: "fullyRefunded",
                    [PaymentChargeStatusEnum.NotCharged]: "unpaid",
                    [PaymentChargeStatusEnum.PartiallyCharged]: "partiallyPaid",
                    [PaymentChargeStatusEnum.PartiallyRefunded]:
                        "partiallyRefunded",
                    [PaymentChargeStatusEnum.Pending]: "unpaid",
                    [PaymentChargeStatusEnum.Refused]: "unpaid",
                };

                const paymentStatus = paymentStatusMapping[order.paymentStatus];

                const carrier = shippingMethodMatch(
                    order?.shippingMethodName || "",
                );

                const currency = checkCurrency(order.total.currency);

                const shippingMethodId =
                    order.deliveryMethod?.__typename === "ShippingMethod"
                        ? this.shippingMethodIdDecode(order.deliveryMethod.id)
                        : undefined;

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
                                        tenantId: this.tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("order"),
                                    orderNumber: prefixedOrderNumber,
                                    date: new Date(order.created),
                                    totalPriceGross: order.total.gross.amount,
                                    language: this.matchLanguage(
                                        order.languageCodeEnum,
                                    ),
                                    orderStatus,
                                    currency,
                                    token: orderToken,
                                    discountCode,
                                    carrier,
                                    shippingMethodName:
                                        order.shippingMethodName,
                                    shippingMethodId,
                                    paymentStatus, // TODO: how will this thing be updated and kept in sync by other services? -> Maybe move it into Payment.status and access it via payments[0].status?
                                    mainContact: contactCreateOrConnect,
                                    firstName: order.billingAddress?.firstName,
                                    lastName: order.billingAddress?.lastName,
                                    shippingAddress: {},
                                    billingAddress: {},
                                    readyToFullfill:
                                        orderStatus === "confirmed" &&
                                        paymentStatus === "fullyPaid",
                                    shippingPriceGross:
                                        order.shippingPrice.gross.amount,
                                    tenant: {
                                        connect: {
                                            id: this.tenantId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    update: {
                        order: {
                            update: {
                                carrier,
                                shippingMethodId,
                                shippingMethodName: order.shippingMethodName,
                                language: this.matchLanguage(
                                    order.languageCodeEnum,
                                ),
                                totalPriceGross: order.total.gross.amount,
                                shippingPriceGross:
                                    order?.shippingPrice.gross.amount,
                                orderStatus,
                                discountCode,
                                currency,
                                mainContact: contactCreateOrConnect,
                                paymentStatus:
                                    paymentStatus !== "unpaid"
                                        ? paymentStatus
                                        : undefined,
                            },
                        },
                    },
                    include: {
                        order: {
                            select: {
                                id: true,
                                mainContactId: true,
                                shippingPriceTaxId: true,
                                orderLineItems: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                    },
                });

                const orderDetails =
                    await this.saleorClient.saleorCronOrderDetails({
                        id: order.id,
                    });
                if (!orderDetails) {
                    throw new Error(
                        `Can't get order details from saleor! Aborting sync and retry next time.`,
                    );
                }

                const lineItems = orderDetails.order?.lines;
                if (!lineItems) {
                    throw new Error(
                        `No line items returned for order! Aborting sync and retry next time.`,
                    );
                }

                /**
                 * The highest Tax Rate is used as the shipping tax rate.
                 * This implementation is not clean! Have to verify with Saleor
                 * again to find a better solution
                 */
                const highestTaxRate =
                    order.shippingPrice.gross.amount > 0
                        ? await this.lookupECITax(
                              Math.round(
                                  Math.max(...lineItems.map((i) => i.taxRate)) *
                                      100,
                              ),
                          )
                        : undefined;

                if (
                    order.shippingPrice.gross.amount > 0 &&
                    !upsertedOrder.order.shippingPriceTaxId &&
                    highestTaxRate
                ) {
                    this.logger.info(
                        `Upserting shipping price tax id to ${highestTaxRate} for order ${upsertedOrder.orderNumber} - ${upsertedOrder.orderId}`,
                    );
                    await this.db.order.update({
                        where: {
                            id: upsertedOrder.orderId,
                        },
                        data: {
                            shippingPriceTax: {
                                connect: {
                                    id: highestTaxRate,
                                },
                            },
                        },
                    });
                }

                /**
                 * The order line item ids that are currently valid
                 */
                const allEciOrderLineItems: { id: string }[] = [];

                // loop through all line items and upsert them in the DB
                for (const [i, lineItem] of lineItems.entries()) {
                    if (!lineItem?.id) {
                        throw new Error(
                            `Lineitem of Order has a missing id in saleor response.`,
                        );
                    }
                    let variantSku =
                        lineItem.variant?.sku ||
                        lineItem.skuFromMetadata ||
                        lineItem.productSku;
                    if (!variantSku) {
                        this.logger.debug(
                            `Lineitem of Order is missing the variant sku in saleor response. Trying to find the variant internally in our DB`,
                        );
                        if (!lineItem?.variant?.id)
                            throw new Error(
                                `Saleor returned us no variant id or SKU for a line item. Can't sync: ${JSON.stringify(
                                    lineItem,
                                )}`,
                            );
                        const match =
                            await this.db.saleorProductVariant.findUnique({
                                where: {
                                    id_installedSaleorAppId: {
                                        id: lineItem.variant.id,
                                        installedSaleorAppId:
                                            this.installedSaleorApp.id,
                                    },
                                },
                                include: {
                                    productVariant: true,
                                },
                            });
                        if (!match)
                            throw new Error(
                                `No match found for saleor variant id ${lineItem.variant.id} in our DB and also no SKU given. Can't sync`,
                            );
                        variantSku = match.productVariant.sku;
                    }
                    if (!variantSku)
                        throw new Error(
                            `No SKU found for line item ${lineItem.id}!`,
                        );

                    const productSku = await this.db.productVariant.findUnique({
                        where: {
                            sku_tenantId: {
                                sku: variantSku,
                                tenantId: this.tenantId,
                            },
                        },
                    });
                    if (!productSku) {
                        throw new Warning(
                            `No internal product variant found for SKU ${variantSku}! Can't create line Item. Try again after Product Variant Sync.`,
                        );
                    }

                    // the first item is always "1". Saleor does not natively offer the order of line items, so we take the array index + 1
                    const lineItemOrder = i + 1;

                    const uniqueString = uniqueStringOrderLine(
                        prefixedOrderNumber,
                        variantSku,
                        lineItem.quantity,
                        lineItemOrder,
                    );

                    const lineItemTotalDiscountNet = round(
                        lineItem.unitDiscount.amount * lineItem.quantity,
                        2,
                    );

                    if (lineItemTotalDiscountNet < 0) {
                        throw new Error(
                            `Calculated saleor discount is negative: ${lineItemTotalDiscountNet}! This can never be. Failing..`,
                        );
                    }

                    const taxPercentage = Math.round(lineItem.taxRate * 100);
                    let eciTax = await this.lookupECITax(taxPercentage);

                    if (!eciTax) {
                        this.logger.warn(
                            `We could not find an internal tax for tax rate ${taxPercentage} for order ${order.number}. We are using the products default now`,
                        );
                        if (!productSku.salesTaxId) {
                            this.logger.warn(
                                `Product ${productSku.sku} - ${productSku.id} has no default sales tax set! Proceeding without a tax class`,
                            );
                        }
                        eciTax = productSku.salesTaxId ?? undefined;
                    }

                    // TODO: would it not be better to inline this into db.saleorOrder.upsert (line 209) so we do not have partiall order data in ECI db if something fails?
                    // Otherwise we would maybe need a parialdata flag (or commited flag) which is true on create and will be updated to false once all lineitems etc. have been created.
                    // Then we can filter for the next steps for partial data = true;
                    const upsertedLineItem =
                        await this.db.saleorOrderLineItem.upsert({
                            where: {
                                id_installedSaleorAppId: {
                                    id: lineItem.id,
                                    installedSaleorAppId:
                                        this.installedSaleorApp.id,
                                },
                            },
                            create: {
                                id: lineItem.id,
                                orderLineItem: {
                                    connectOrCreate: {
                                        where: {
                                            uniqueString_tenantId: {
                                                uniqueString,
                                                tenantId: this.tenantId,
                                            },
                                        },
                                        create: {
                                            id: id.id("lineItem"),
                                            tenant: {
                                                connect: {
                                                    id: this.tenantId,
                                                },
                                            },
                                            uniqueString,
                                            order: {
                                                connect: {
                                                    id: upsertedOrder.orderId,
                                                },
                                            },
                                            itemOrder: lineItemOrder,
                                            quantity: lineItem.quantity,
                                            discountValueNet:
                                                lineItemTotalDiscountNet,
                                            undiscountedUnitPriceNet:
                                                lineItem.undiscountedUnitPrice
                                                    .net.amount,
                                            undiscountedUnitPriceGross:
                                                lineItem.undiscountedUnitPrice
                                                    .gross.amount,
                                            totalPriceNet:
                                                lineItem.totalPrice.net.amount,
                                            totalPriceGross:
                                                lineItem.totalPrice.gross
                                                    .amount,
                                            tax: eciTax
                                                ? {
                                                      connect: {
                                                          id: eciTax,
                                                      },
                                                  }
                                                : undefined,
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
                                orderLineItem: {
                                    update: {
                                        itemOrder: lineItemOrder,
                                        quantity: lineItem.quantity,
                                        discountValueNet:
                                            lineItemTotalDiscountNet,
                                        totalPriceNet:
                                            lineItem.totalPrice.net.amount,
                                        totalPriceGross:
                                            lineItem.totalPrice.gross.amount,
                                        undiscountedUnitPriceGross:
                                            lineItem.undiscountedUnitPrice.gross
                                                .amount,
                                        tax: eciTax
                                            ? {
                                                  connect: {
                                                      id: eciTax,
                                                  },
                                              }
                                            : undefined,
                                        productVariant: {
                                            connect: {
                                                id: productSku.id,
                                            },
                                        },
                                        order: {
                                            update: {
                                                shippingPriceNet:
                                                    orderDetails.order
                                                        ?.shippingPrice.net
                                                        .amount,
                                                shippingPriceGross:
                                                    orderDetails.order
                                                        ?.shippingPrice.gross
                                                        .amount,
                                            },
                                        },
                                    },
                                },
                            },
                        });

                    allEciOrderLineItems.push({
                        id: upsertedLineItem.orderLineItemId,
                    });
                }

                const oldOrderLines = upsertedOrder.order.orderLineItems;

                const toBeDeleted = oldOrderLines.filter((x) => {
                    return !allEciOrderLineItems
                        .map((all) => all.id)
                        .includes(x.id);
                });

                if (toBeDeleted.length > 0) {
                    this.logger.info(
                        `To be deleted orderlines: ${JSON.stringify(
                            toBeDeleted,
                        )}`,
                    );
                    await this.db.orderLineItem.deleteMany({
                        where: {
                            id: {
                                in: toBeDeleted.map((d) => d.id),
                            },
                        },
                    });
                }

                if (upsertedOrder.order?.mainContactId == null) {
                    throw new Error(
                        `Order ${upsertedOrder.orderNumber} has no main contact Id set! Can't sync addressess`,
                    );
                }
                // Sync the order's addresses with the internal DB
                if (
                    order.shippingAddress &&
                    order.billingAddress &&
                    upsertedOrder.order?.mainContactId !== null
                ) {
                    this.logger.info(
                        `Upserting addresses for ${upsertedOrder.orderNumber} - contact ${upsertedOrder.order.mainContactId}`,
                    );
                    // TODO: rewrite/rename addesses without Class so it follows the same schema as zoho-salesorders-helpers
                    // -> also move both in an integration-saleor-entities/src/helpers folder because they can potentially be used by more than this entities
                    await addresses(
                        this.db,
                        upsertedOrder.orderId,
                        this.tenantId,
                        this.logger,
                        upsertedOrder.order.mainContactId,
                    ).sync(order.shippingAddress, order.billingAddress);
                }
            } catch (err) {
                const defaultLogFields = {
                    saleorOrderId: order.id,
                    saleorOrderNumber: `${this.orderPrefix}-${order.number}`,
                    saleorOrderUserEmail: order.userEmail,
                };
                if (err instanceof Warning) {
                    this.logger.warn(err.message, defaultLogFields);
                } else if (err instanceof Error) {
                    this.logger.error(err.message, defaultLogFields);
                } else {
                    this.logger.error(
                        "An unknown Error occured: " + (err as any)?.toString(),
                        defaultLogFields,
                    );
                }
            }
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    public async syncFromECI(): Promise<void> {
        /**
         * check, if we have the setting "createHistoricOrdes" activated for this installedSaleorApp
         */
        if (this.installedSaleorApp.createHistoricOrdes) {
            this.logger.info(
                `createHistoricOrdes is activated for this installedSaleorApp. Starting sync.`,
            );
            const histOrders = new SaleorHistoricOrdersSync({
                db: this.db,
                logger: this.logger,
                installedSaleorApp: this.installedSaleorApp,
                saleorClient: this.saleorClient,
                tenantId: this.tenantId,
            });
            await histOrders.syncHistoricOrders();
        }
    }
}
