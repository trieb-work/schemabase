import { PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiOrder } from "../types";
import { ILogger } from "@eci/pkg/logger";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

/**
 * takes the order and makes sure, that orderline items
 * are synchronised. It deletes no longer needed orderlines.
 * It creates and connects new orderlines. It uses the uniquestring
 * to match order line items accordingly
 */
const apiLineItemsWithSchemabase = async (
    orderFromApi: KencoveApiOrder,
    existingOrderId: string,
    tenantId: string,
    db: PrismaClient,
    logger: ILogger,
) => {
    const orderLineItems = orderFromApi.orderLines;
    if (!orderLineItems || orderLineItems.length === 0) {
        logger.error(
            `no orderline items found for order ${orderFromApi.orderNumber}`,
        );
        return;
    }
    const orderLineItemsWithUniqueString = orderLineItems.map(
        (orderLineItem, index) => {
            return {
                ...orderLineItem,
                uniqueString: uniqueStringOrderLine(
                    orderFromApi.orderNumber,
                    orderLineItem.itemCode,
                    orderLineItem.quantity,
                    index,
                ),
            };
        },
    );
    const existingOrderLineItems = await db.orderLineItem.findMany({
        where: {
            orderId: existingOrderId,
        },
    });
    const lineItemsToCreate = orderLineItemsWithUniqueString.filter(
        (orderLineItem) => {
            return !existingOrderLineItems.some(
                (existingOrderLineItem) =>
                    existingOrderLineItem.uniqueString ===
                    orderLineItem.uniqueString,
            );
        },
    );
    const lineItemsToDelete = existingOrderLineItems.filter(
        (existingOrderLineItem) => {
            return !orderLineItemsWithUniqueString.some(
                (orderLineItem) =>
                    orderLineItem.uniqueString ===
                    existingOrderLineItem.uniqueString,
            );
        },
    );
    logger.info(
        `Working on lineItems: (create: ${lineItemsToCreate.length}` +
            `/ delete: ${lineItemsToDelete.length})`,
    );

    await Promise.all(
        lineItemsToCreate.map(async (ol) => {
            const productName = ol.description.replace(/\[.*?\]\s/g, "");
            const normalizedName = normalizeStrings.productNames(productName);
            const productVariant = {
                connectOrCreate: {
                    where: {
                        sku_tenantId: {
                            sku: ol.itemCode,
                            tenantId: tenantId,
                        },
                    },
                    create: {
                        id: id.id("variant"),
                        sku: ol.itemCode,
                        tenant: {
                            connect: {
                                id: tenantId,
                            },
                        },
                        product: {
                            connectOrCreate: {
                                where: {
                                    normalizedName_tenantId: {
                                        normalizedName,
                                        tenantId: tenantId,
                                    },
                                },
                                create: {
                                    id: id.id("product"),
                                    normalizedName,
                                    name: productName,
                                    tenant: {
                                        connect: {
                                            id: tenantId,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            };
            await db.orderLineItem.create({
                data: {
                    id: id.id("lineItem"),
                    order: {
                        connect: {
                            id: existingOrderId,
                        },
                    },
                    productVariant,
                    quantity: ol.quantity,
                    tenant: {
                        connect: {
                            id: tenantId,
                        },
                    },
                    uniqueString: ol.uniqueString,
                },
            });
        }),
    );
    await db.orderLineItem.deleteMany({
        where: {
            id: {
                in: lineItemsToDelete.map(
                    (lineItemToDelete) => lineItemToDelete.id,
                ),
            },
        },
    });
};
export { apiLineItemsWithSchemabase };
