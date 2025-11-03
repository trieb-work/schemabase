import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";

export interface ItemSalesStatsConfig {
    db: PrismaClient;
    tenantId: string;
    logger: ILogger;
}

export interface ItemSalesStats {
    sku: string;
    totalOrders: number;
    totalQuantity: number;
    uniqueCustomers: number;
    totalRevenue: number;
    avgOrderQuantity: number;
    avgOrderValue: number;
    period: string;
    startDate: string;
    endDate: string;
    lastUpdated: string;
}

export interface ProductSalesStats {
    productId: string;
    productSku: string; // Main product SKU
    variantSkus: string[]; // All variant SKUs that contribute to this product
    totalOrders: number;
    totalQuantity: number;
    uniqueCustomers: number;
    totalRevenue: number;
    avgOrderQuantity: number;
    avgOrderValue: number;
    variantCount: number;
    period: string;
    startDate: string;
    endDate: string;
    lastUpdated: string;
}

export interface ItemSalesStatsResult {
    stats: ItemSalesStats[];
    totalItems: number;
    period: string;
    startDate: string;
    endDate: string;
    lastUpdated: string;
}

export class ItemSalesStatsService {
    private readonly db: PrismaClient;

    private readonly tenantId: string;

    private readonly logger: ILogger;

    constructor(config: ItemSalesStatsConfig) {
        this.db = config.db;
        this.tenantId = config.tenantId;
        this.logger = config.logger;
    }

    /**
     * Get sales stats for ALL items for the last X days (no limits)
     */
    public async getItemSalesStatsForLastDays(
        days: number,
        options: {
            minOrders?: number; // Only include items with at least X orders
            orderBy?:
                | "totalOrders"
                | "totalQuantity"
                | "totalRevenue"
                | "uniqueCustomers";
            orderDirection?: "asc" | "desc";
            logTopItems?: number; // Number of top items to log (default: 10)
        } = {},
    ): Promise<ItemSalesStatsResult> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        this.logger.info("Calculating item sales stats", {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            tenantId: this.tenantId,
            days,
            options,
        });

        // More efficient query - first get orders, then line items
        const orders = await this.db.order.findMany({
            where: {
                tenantId: this.tenantId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                orderStatus: {
                    not: "canceled", // Exclude canceled orders
                },
            },
            select: {
                id: true,
                mainContactId: true,
                date: true,
                orderNumber: true,
                orderLineItems: {
                    select: {
                        sku: true,
                        quantity: true,
                        totalPriceGross: true,
                        totalPriceNet: true,
                    },
                },
            },
        });

        // Flatten the data structure
        const salesData = orders.flatMap((order) =>
            order.orderLineItems.map((lineItem) => ({
                ...lineItem,
                order: {
                    id: order.id,
                    mainContactId: order.mainContactId,
                    date: order.date,
                    orderNumber: order.orderNumber,
                },
            })),
        );

        this.logger.info(`Found ${salesData.length} line items for analysis`);

        // Group by SKU and calculate stats
        const skuStats = new Map<
            string,
            {
                orderIds: Set<string>;
                customerIds: Set<string>;
                totalQuantity: number;
                totalRevenue: number;
                orders: Array<{
                    orderId: string;
                    quantity: number;
                    revenue: number;
                }>;
            }
        >();

        for (const lineItem of salesData) {
            const sku = lineItem.sku;
            const revenue =
                lineItem.totalPriceGross || lineItem.totalPriceNet || 0;

            if (!skuStats.has(sku)) {
                skuStats.set(sku, {
                    orderIds: new Set(),
                    customerIds: new Set(),
                    totalQuantity: 0,
                    totalRevenue: 0,
                    orders: [],
                });
            }

            const stats = skuStats.get(sku)!;
            stats.orderIds.add(lineItem.order.id);
            stats.customerIds.add(lineItem.order.mainContactId);
            stats.totalQuantity += lineItem.quantity;
            stats.totalRevenue += revenue;
            stats.orders.push({
                orderId: lineItem.order.id,
                quantity: lineItem.quantity,
                revenue,
            });
        }

        // Convert to result format and apply filters
        let itemStats: ItemSalesStats[] = Array.from(skuStats.entries()).map(
            ([sku, stats]) => {
                const totalOrders = stats.orderIds.size;
                const totalQuantity = stats.totalQuantity;
                const uniqueCustomers = stats.customerIds.size;
                const totalRevenue = stats.totalRevenue;

                return {
                    sku,
                    totalOrders,
                    totalQuantity,
                    uniqueCustomers,
                    totalRevenue,
                    avgOrderQuantity: totalQuantity / totalOrders,
                    avgOrderValue: totalRevenue / totalOrders,
                    period: `${days} days`,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    lastUpdated: new Date().toISOString(),
                };
            },
        );

        // Apply minimum orders filter
        if (options.minOrders && options.minOrders > 0) {
            itemStats = itemStats.filter(
                (item) => item.totalOrders >= options.minOrders!,
            );
        }

        // Apply sorting
        const orderBy = options.orderBy || "totalOrders";
        const orderDirection = options.orderDirection || "desc";

        itemStats.sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            return orderDirection === "desc"
                ? bValue - aValue
                : aValue - bValue;
        });

        // Log top items for debugging (but store all items)
        const logTopItems = options.logTopItems || 10;
        this.logger.info("Calculated item sales stats", {
            totalItems: itemStats.length,
            topItem: itemStats[0]?.sku,
            topItemOrders: itemStats[0]?.totalOrders,
            loggedTopItems: Math.min(logTopItems, itemStats.length),
        });

        // Log top items for visibility
        if (itemStats.length > 0) {
            this.logger.info(
                `Top ${Math.min(logTopItems, itemStats.length)} items by ${options.orderBy || "totalOrders"}:`,
                {
                    topItems: itemStats
                        .slice(0, logTopItems)
                        .map((item, index) => ({
                            rank: index + 1,
                            sku: item.sku,
                            totalOrders: item.totalOrders,
                            totalQuantity: item.totalQuantity,
                            totalRevenue: item.totalRevenue.toFixed(2),
                            uniqueCustomers: item.uniqueCustomers,
                        })),
                },
            );
        }

        return {
            stats: itemStats,
            totalItems: itemStats.length,
            period: `${days} days`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            lastUpdated: new Date().toISOString(),
        };
    }

    /**
     * Get sales stats for a specific SKU
     */
    public async getItemSalesStatsForSku(
        sku: string,
        days: number,
    ): Promise<ItemSalesStats | null> {
        const result = await this.getItemSalesStatsForLastDays(days, {
            minOrders: 0,
        });

        return result.stats.find((item) => item.sku === sku) || null;
    }

    /**
     * Get top selling items by different criteria (for logging/display)
     */
    public async getTopSellingItems(
        days: number,
        criteria: "orders" | "quantity" | "revenue" | "customers" = "orders",
        limit: number = 10,
    ): Promise<ItemSalesStats[]> {
        const orderByMap = {
            orders: "totalOrders" as const,
            quantity: "totalQuantity" as const,
            revenue: "totalRevenue" as const,
            customers: "uniqueCustomers" as const,
        };

        const result = await this.getItemSalesStatsForLastDays(days, {
            orderBy: orderByMap[criteria],
            orderDirection: "desc",
            minOrders: 1, // At least 1 order
            logTopItems: limit,
        });

        return result.stats.slice(0, limit);
    }

    /**
     * Get sales stats for multiple timeframes (useful for trending analysis)
     */
    public async getItemSalesStatsMultipleTimeframes(
        sku: string,
        timeframes: number[] = [14, 30, 90],
    ): Promise<Record<string, ItemSalesStats | null>> {
        const results: Record<string, ItemSalesStats | null> = {};

        for (const days of timeframes) {
            this.logger.info(`Getting stats for ${sku} - last ${days} days`);
            results[`${days}d`] = await this.getItemSalesStatsForSku(sku, days);
        }

        return results;
    }

    /**
     * Format stats for display/export
     */
    public formatStatsForDisplay(
        stats: ItemSalesStats,
    ): Record<string, string> {
        return {
            sku: stats.sku,
            totalOrders: stats.totalOrders.toString(),
            totalQuantity: stats.totalQuantity.toFixed(2),
            uniqueCustomers: stats.uniqueCustomers.toString(),
            totalRevenue: `€${stats.totalRevenue.toFixed(2)}`,
            avgOrderQuantity: stats.avgOrderQuantity.toFixed(2),
            avgOrderValue: `€${stats.avgOrderValue.toFixed(2)}`,
            period: stats.period,
            lastUpdated: stats.lastUpdated,
        };
    }

    /**
     * Get summary statistics across all items
     */
    public async getSalesSummary(days: number): Promise<{
        totalItems: number;
        totalOrders: number;
        totalQuantity: number;
        totalRevenue: number;
        avgItemsPerOrder: number;
        period: string;
        lastUpdated: string;
    }> {
        const result = await this.getItemSalesStatsForLastDays(days, {
            minOrders: 0, // Include all items
        });

        const totalOrders = result.stats.reduce(
            (sum, item) => sum + item.totalOrders,
            0,
        );
        const totalQuantity = result.stats.reduce(
            (sum, item) => sum + item.totalQuantity,
            0,
        );
        const totalRevenue = result.stats.reduce(
            (sum, item) => sum + item.totalRevenue,
            0,
        );

        return {
            totalItems: result.totalItems,
            totalOrders,
            totalQuantity,
            totalRevenue,
            avgItemsPerOrder: totalOrders > 0 ? totalQuantity / totalOrders : 0,
            period: result.period,
            lastUpdated: result.lastUpdated,
        };
    }

    /**
     * Get product-level sales stats by aggregating all variants using actual database relationships
     */
    public async getProductSalesStatsForLastDays(
        days: number,
        options: {
            minOrders?: number;
            orderBy?:
                | "totalOrders"
                | "totalQuantity"
                | "totalRevenue"
                | "uniqueCustomers";
            orderDirection?: "asc" | "desc";
            logTopProducts?: number;
        } = {},
    ): Promise<{
        stats: ProductSalesStats[];
        totalProducts: number;
        period: string;
        startDate: string;
        endDate: string;
        lastUpdated: string;
    }> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        this.logger.info(
            "Calculating product-level sales stats using database relationships",
            {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                tenantId: this.tenantId,
                days,
                options,
            },
        );

        // Query orders with product variant relationships
        const orders = await this.db.order.findMany({
            where: {
                tenantId: this.tenantId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                orderStatus: {
                    not: "canceled",
                },
            },
            select: {
                id: true,
                mainContactId: true,
                date: true,
                orderNumber: true,
                orderLineItems: {
                    select: {
                        sku: true,
                        quantity: true,
                        totalPriceGross: true,
                        totalPriceNet: true,
                    },
                },
            },
        });

        // Get all unique SKUs from the orders
        const allSkus = new Set<string>();
        orders.forEach((order) => {
            order.orderLineItems.forEach((lineItem) => {
                allSkus.add(lineItem.sku);
            });
        });

        this.logger.info(
            `Found ${allSkus.size} unique SKUs, querying product relationships`,
        );

        // Get product variant to product mappings from database
        const productVariants = await this.db.productVariant.findMany({
            where: {
                tenantId: this.tenantId,
                sku: {
                    in: Array.from(allSkus),
                },
            },
            select: {
                sku: true,
                productId: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        normalizedName: true,
                    },
                },
            },
        });

        // Create SKU to product mapping
        const skuToProduct = new Map<
            string,
            {
                productId: string;
                productName: string;
                productNormalizedName: string;
            }
        >();

        productVariants.forEach((variant) => {
            skuToProduct.set(variant.sku, {
                productId: variant.productId,
                productName: variant.product.name,
                productNormalizedName: variant.product.normalizedName,
            });
        });

        this.logger.info(
            `Mapped ${skuToProduct.size} SKUs to ${new Set(Array.from(skuToProduct.values()).map((p) => p.productId)).size} products`,
        );

        // Flatten the order data
        const salesData = orders.flatMap((order) =>
            order.orderLineItems.map((lineItem) => ({
                ...lineItem,
                order: {
                    id: order.id,
                    mainContactId: order.mainContactId,
                    date: order.date,
                    orderNumber: order.orderNumber,
                },
            })),
        );

        // Group by actual product ID from database
        const productGroups = new Map<
            string,
            {
                productId: string;
                productName: string;
                productNormalizedName: string;
                variantSkus: string[];
                orderIds: Set<string>;
                customerIds: Set<string>;
                totalQuantity: number;
                totalRevenue: number;
            }
        >();

        for (const lineItem of salesData) {
            const productInfo = skuToProduct.get(lineItem.sku);
            if (!productInfo) {
                // SKU not found in product variants - skip or log warning
                this.logger.warn(
                    `SKU ${lineItem.sku} not found in product variants table`,
                );
                continue;
            }

            const productId = productInfo.productId;

            if (!productGroups.has(productId)) {
                productGroups.set(productId, {
                    productId,
                    productName: productInfo.productName,
                    productNormalizedName: productInfo.productNormalizedName,
                    variantSkus: [],
                    orderIds: new Set(),
                    customerIds: new Set(),
                    totalQuantity: 0,
                    totalRevenue: 0,
                });
            }

            const productGroup = productGroups.get(productId)!;

            // Add variant SKU if not already added
            if (!productGroup.variantSkus.includes(lineItem.sku)) {
                productGroup.variantSkus.push(lineItem.sku);
            }

            // Add order and customer IDs
            productGroup.orderIds.add(lineItem.order.id);
            productGroup.customerIds.add(lineItem.order.mainContactId);

            // Sum quantities and revenue
            productGroup.totalQuantity += lineItem.quantity;
            const revenue =
                lineItem.totalPriceGross || lineItem.totalPriceNet || 0;
            productGroup.totalRevenue += revenue;
        }

        // Convert to ProductSalesStats format
        let productStats: ProductSalesStats[] = Array.from(
            productGroups.entries(),
        ).map(([productId, group]) => {
            const totalOrders = group.orderIds.size;
            const uniqueCustomers = group.customerIds.size;

            return {
                productId,
                productSku: group.productNormalizedName, // Use normalized name as product SKU
                variantSkus: group.variantSkus,
                totalOrders,
                totalQuantity: group.totalQuantity,
                uniqueCustomers,
                totalRevenue: group.totalRevenue,
                avgOrderQuantity:
                    totalOrders > 0 ? group.totalQuantity / totalOrders : 0,
                avgOrderValue:
                    totalOrders > 0 ? group.totalRevenue / totalOrders : 0,
                variantCount: group.variantSkus.length,
                period: `${days} days`,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                lastUpdated: new Date().toISOString(),
            };
        });

        // Apply minimum orders filter
        if (options.minOrders && options.minOrders > 0) {
            productStats = productStats.filter(
                (product) => product.totalOrders >= options.minOrders!,
            );
        }

        // Apply sorting
        const orderBy = options.orderBy || "totalOrders";
        const orderDirection = options.orderDirection || "desc";

        productStats.sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            return orderDirection === "desc"
                ? bValue - aValue
                : aValue - bValue;
        });

        // Log top products for debugging
        const logTopProducts = options.logTopProducts || 10;
        this.logger.info("Calculated product sales stats", {
            totalProducts: productStats.length,
            topProduct: productStats[0]?.productSku,
            topProductOrders: productStats[0]?.totalOrders,
            loggedTopProducts: Math.min(logTopProducts, productStats.length),
        });

        if (productStats.length > 0 && logTopProducts > 0) {
            this.logger.info(
                `Top ${Math.min(logTopProducts, productStats.length)} products by ${orderBy}:`,
                {
                    topProducts: productStats
                        .slice(0, logTopProducts)
                        .map((product, index) => ({
                            rank: index + 1,
                            productSku: product.productSku,
                            variantCount: product.variantCount,
                            totalOrders: product.totalOrders,
                            totalQuantity: product.totalQuantity,
                            totalRevenue: product.totalRevenue.toFixed(2),
                            uniqueCustomers: product.uniqueCustomers,
                        })),
                },
            );
        }

        return {
            stats: productStats,
            totalProducts: productStats.length,
            period: `${days} days`,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            lastUpdated: new Date().toISOString(),
        };
    }

    /**
     * Format product stats for Saleor metadata storage
     */
    public formatProductStatsForSaleorMetadata(
        stats: ProductSalesStats,
    ): Record<string, string> {
        return {
            productId: stats.productId,
            productSku: stats.productSku,
            variantCount: stats.variantCount.toString(),
            totalOrders: stats.totalOrders.toString(),
            totalQuantity: stats.totalQuantity.toFixed(2),
            uniqueCustomers: stats.uniqueCustomers.toString(),
            totalRevenue: stats.totalRevenue.toFixed(2),
            avgOrderQuantity: stats.avgOrderQuantity.toFixed(2),
            avgOrderValue: stats.avgOrderValue.toFixed(2),
            period: stats.period,
            lastUpdated: stats.lastUpdated,
        };
    }

    /**
     * Get top selling products (for display/logging)
     */
    public async getTopSellingProducts(
        days: number,
        criteria: "orders" | "quantity" | "revenue" | "customers" = "orders",
        limit: number = 10,
    ): Promise<ProductSalesStats[]> {
        const orderByMap = {
            orders: "totalOrders" as const,
            quantity: "totalQuantity" as const,
            revenue: "totalRevenue" as const,
            customers: "uniqueCustomers" as const,
        };

        const result = await this.getProductSalesStatsForLastDays(days, {
            orderBy: orderByMap[criteria],
            orderDirection: "desc",
            minOrders: 1,
            logTopProducts: limit,
        });

        return result.stats.slice(0, limit);
    }
}
