// calculation method of frequently bought together items, taking into account
// all historic orders of a tenant. Returns the top 10 products bought together
// with the requested product. Using our prisma client. Orders are in the "orders" table.
// related orderlineitems are in the related "orderLineItem" table. Return the whole product

import { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";

export class FBT {
    private readonly db: PrismaClient;

    private readonly tenantId: string[];

    private readonly logger: ILogger;

    constructor({
        db,
        tenantId,
        logger,
    }: {
        db: PrismaClient;
        tenantId: string[];
        logger: ILogger;
    }) {
        this.db = db;
        this.tenantId = tenantId;
        this.logger = logger;
    }

    public async getProductsBoughtTogether(productId: string) {
        // Find orders that have the given product
        const ordersWithProduct = await this.db.orderLineItem.findMany({
            where: {
                productVariant: {
                    productId: productId,
                },
                tenantId: {
                    in: this.tenantId,
                },
                order: {
                    tenantId: {
                        in: this.tenantId,
                    },
                },
            },
            select: {
                order: true,
            },
        });

        const orderIds = ordersWithProduct.map((order) => order.order.id);

        this.logger.debug(
            `Found ${orderIds.length} orders with product ${productId}`,
        );

        // Fetch all products in those orders
        const allProductsInOrders = await this.db.orderLineItem.findMany({
            where: {
                orderId: {
                    in: orderIds,
                },
                productVariant: {
                    productId: {
                        not: productId,
                    },
                },
            },
            include: {
                productVariant: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        // Count product occurrences
        const productCounts: Record<string, number> = {};
        for (let product of allProductsInOrders) {
            const currentProductId = product.productVariant.productId;
            if (!productCounts[currentProductId]) {
                productCounts[currentProductId] = 1;
            } else {
                productCounts[currentProductId]++;
            }
        }

        // Sort products by their occurrence count and get top 10 product IDs
        const topProductIds = Object.keys(productCounts)
            .sort((a, b) => productCounts[b] - productCounts[a])
            .slice(0, 10);

        // Fetch the details of the top 10 products
        const topProductDetails = await this.db.product.findMany({
            where: {
                id: {
                    in: topProductIds,
                },
                tenantId: {
                    in: this.tenantId,
                },
            },
        });

        return topProductDetails;
    }
}
