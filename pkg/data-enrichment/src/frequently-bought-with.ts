// calculation method of frequently bought together items, taking into account
// all historic orders of a tenant. Returns the top 10 products bought together
// with the requested product. Using our prisma client. Orders are in the "orders" table.
// related orderlineitems are in the related "orderLineItem" table. Return the whole product
// make sure to only return products, that appear at a minimum of 10 times.

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
        const orderIds = await this.getOrdersWithProduct(productId);

        const allProductsInOrders = await this.getAllProductsInOrders(
            orderIds,
            productId,
        );

        const productCounts = this.countProductOccurrences(allProductsInOrders);

        const topProductIds = this.getTopProductIds(productCounts);

        const topProductDetails =
            await this.getTopProductDetails(topProductIds);

        return topProductDetails;
    }

    private async getOrdersWithProduct(productId: string): Promise<string[]> {
        const orders = await this.db.orderLineItem.findMany({
            where: {
                productVariant: { productId },
                tenantId: { in: this.tenantId },
            },
            select: { orderId: true },
            orderBy: { order: { createdAt: "desc" } },
        });
        return orders.map((order) => order.orderId);
    }

    private async getAllProductsInOrders(
        orderIds: string[],
        productId: string,
    ) {
        return this.db.orderLineItem.findMany({
            where: {
                orderId: { in: orderIds },
                productVariant: {
                    productId: {
                        not: productId,
                    },
                },
            },
            include: {
                productVariant: {
                    include: { product: true },
                },
            },
        });
    }

    private countProductOccurrences(
        allProductsInOrders: any[],
    ): Record<string, number> {
        const productCounts: Record<string, number> = {};
        for (let product of allProductsInOrders) {
            const currentProductId = product.productVariant.productId;
            productCounts[currentProductId] =
                (productCounts[currentProductId] || 0) + 1;
        }
        return productCounts;
    }

    private getTopProductIds(productCounts: Record<string, number>): string[] {
        return Object.keys(productCounts)
            .filter((productId) => productCounts[productId] >= 10)
            .sort((a, b) => productCounts[b] - productCounts[a])
            .slice(0, 10);
    }

    private async getTopProductDetails(topProductIds: string[]) {
        return this.db.product.findMany({
            where: {
                id: { in: topProductIds },
                tenantId: { in: this.tenantId },
            },
        });
    }
}
