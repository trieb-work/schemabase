// calculation method of frequently bought together items, taking into account
// all historic orders of a tenant. Returns the top 10 products bought together
// with the requested product. Using our prisma client. Orders are in the "orders" table.
// related orderlineitems are in the related "orderLineItem" table. Return the whole product
// make sure to only return products, that appear at a minimum of 10 times.

import { ILogger } from "@eci/pkg/logger";
import type {
    OrderLineItem,
    PrismaClient,
    Product,
    ProductVariant,
} from "@eci/pkg/prisma";

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

    public async getVariantsBoughtTogether(variantId: string) {
        const orderIds = await this.getOrdersWithVariant(variantId);

        const allVariantsInOrders = await this.getAllVariantsInOrders(
            orderIds,
            variantId,
        );

        const variantCounts = this.countVariantOccurrences(allVariantsInOrders);

        const topVariantIds = this.getTopOccuringIds(variantCounts);

        const topVariantDetails =
            await this.getTopVariantDetails(topVariantIds);

        return topVariantDetails;
    }

    public async getProductsBoughtTogether(productId: string) {
        const orderIds = await this.getOrdersWithProduct(productId);

        const allProductsInOrders = await this.getAllProductsInOrders(
            orderIds,
            productId,
        );

        const productCounts = this.countProductOccurrences(allProductsInOrders);

        const topProductIds = this.getTopOccuringIds(productCounts);

        const topProductDetails =
            await this.getTopProductDetails(topProductIds);

        return topProductDetails;
    }

    /**
     * Get all orders, that include a specific variant in their orderlineitems
     * @param variantId
     * @returns
     */
    private async getOrdersWithVariant(variantId: string): Promise<string[]> {
        const orders = await this.db.orderLineItem.findMany({
            where: {
                productVariantId: variantId,
                tenantId: { in: this.tenantId },
            },
            select: { orderId: true },
            orderBy: { order: { createdAt: "desc" } },
            take: 10000,
        });
        this.logger.debug(
            `Found ${orders.length} orderlines with variant ${variantId}`,
        );
        return orders.map((order) => order.orderId);
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
        this.logger.debug(
            `Found ${orders.length} orders with product ${productId}`,
        );
        return orders.map((order) => order.orderId);
    }

    /**
     * Take order ids, and returns all other variants that were bought (
     * variants bought together with a specific variant)
     * @param orderIds
     * @param variantId
     * @returns
     */
    private async getAllVariantsInOrders(
        orderIds: string[],
        variantId: string,
    ) {
        return this.db.orderLineItem.findMany({
            where: {
                orderId: { in: orderIds },
                tenantId: { in: this.tenantId },
                productVariantId: {
                    not: variantId,
                },
            },
            select: {
                productVariantId: true,
            },
        });
    }

    /**
     * Get all bought together products for a given product
     * in a given set of orders
     * @param orderIds
     * @param productId
     * @returns
     */
    private async getAllProductsInOrders(
        orderIds: string[],
        productId: string,
    ): Promise<
        (OrderLineItem & {
            productVariant: ProductVariant & { product: Product };
        })[]
    > {
        return this.db.orderLineItem.findMany({
            where: {
                orderId: { in: orderIds },
                tenantId: { in: this.tenantId },
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

    private countVariantOccurrences(
        allVariantsInOrders: { productVariantId: string }[],
    ): Record<string, number> {
        const variantCounts: Record<string, number> = {};
        for (let variant of allVariantsInOrders) {
            const currentVariantId = variant.productVariantId;
            variantCounts[currentVariantId] =
                (variantCounts[currentVariantId] || 0) + 1;
        }
        return variantCounts;
    }

    private countProductOccurrences(
        allProductsInOrders: (OrderLineItem & {
            productVariant: ProductVariant & { product: Product };
        })[],
    ): Record<string, number> {
        const productCounts: Record<string, number> = {};
        for (let product of allProductsInOrders) {
            const currentProductId = product.productVariant.productId;
            productCounts[currentProductId] =
                (productCounts[currentProductId] || 0) + 1;
        }
        return productCounts;
    }

    /**
     * Returns us the top 10 productIds or variantIds
     * @param recordCount
     * @returns
     */
    private getTopOccuringIds(recordCount: Record<string, number>): string[] {
        return Object.keys(recordCount)
            .filter((productId) => recordCount[productId] >= 10)
            .sort((a, b) => recordCount[b] - recordCount[a])
            .slice(0, 10);
    }

    private async getTopVariantDetails(topVariantIds: string[]) {
        return this.db.productVariant.findMany({
            where: {
                id: { in: topVariantIds },
                tenantId: { in: this.tenantId },
            },
        });
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
