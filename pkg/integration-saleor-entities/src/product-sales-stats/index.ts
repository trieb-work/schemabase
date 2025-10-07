import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { SaleorClient, MetadataInput } from "@eci/pkg/saleor";
import type { InstalledSaleorApp } from "@eci/pkg/prisma";
import { ItemSalesStatsService } from "@eci/pkg/data-enrichtment/src/item-sales-stats";

export interface SaleorProductSalesStatsSyncServiceConfig {
    logger: ILogger;
    saleorClient: SaleorClient;
    db: PrismaClient;
    tenantId: string;
    installedSaleorApp: InstalledSaleorApp;
    timeframes?: number[];
    batchSize?: number;
}

export class SaleorProductSalesStatsSyncService {
    private logger: ILogger;

    private saleorClient: SaleorClient;

    private db: PrismaClient;

    private tenantId: string;

    private installedSaleorApp: InstalledSaleorApp;

    private timeframes: number[];

    private batchSize: number;

    private salesStatsService: ItemSalesStatsService;

    constructor(config: SaleorProductSalesStatsSyncServiceConfig) {
        this.logger = config.logger;
        this.saleorClient = config.saleorClient;
        this.db = config.db;
        this.tenantId = config.tenantId;
        this.installedSaleorApp = config.installedSaleorApp;
        this.timeframes = config.timeframes || [14, 30, 90];
        this.batchSize = config.batchSize || 50;

        // Initialize the sales stats service
        this.salesStatsService = new ItemSalesStatsService({
            db: this.db,
            tenantId: this.tenantId,
            logger: this.logger,
        });
    }

    /**
     * Sync product sales stats to Saleor product metadata
     */
    public async syncProductSalesStats(): Promise<{
        totalProducts: number;
        updatedCount: number;
        skippedCount: number;
        timeframes: number[];
    }> {
        this.logger.info("Starting product sales stats sync to Saleor", {
            timeframes: this.timeframes,
            batchSize: this.batchSize,
            installedSaleorAppId: this.installedSaleorApp.id,
        });

        // Calculate product stats for all timeframes
        const productStatsMap = new Map<
            number,
            Awaited<
                ReturnType<
                    typeof this.salesStatsService.getProductSalesStatsForLastDays
                >
            >
        >();

        for (const days of this.timeframes) {
            this.logger.info(`Calculating product stats for ${days} days`);
            const stats =
                await this.salesStatsService.getProductSalesStatsForLastDays(
                    days,
                    {
                        logTopProducts: 5, // Only log top 5 for each timeframe
                    },
                );
            productStatsMap.set(days, stats);
        }

        // Get all Saleor products that need to be updated
        const saleorProducts = await this.db.saleorProduct.findMany({
            where: {
                installedSaleorAppId: this.installedSaleorApp.id,
            },
            select: {
                id: true, // Saleor product ID
                productId: true, // Internal product ID
                product: {
                    select: {
                        id: true,
                        name: true,
                        normalizedName: true,
                    },
                },
            },
        });

        this.logger.info(
            `Found ${saleorProducts.length} Saleor products to update`,
        );

        // Process products in batches
        let updatedCount = 0;
        let skippedCount = 0;
        const totalProducts = saleorProducts.length;

        for (let i = 0; i < saleorProducts.length; i += this.batchSize) {
            const batch = saleorProducts.slice(i, i + this.batchSize);

            this.logger.info(
                `Processing batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(totalProducts / this.batchSize)}`,
                {
                    batchSize: batch.length,
                    processed: i,
                    total: totalProducts,
                },
            );

            // Process each product in the batch
            for (const saleorProduct of batch) {
                try {
                    // Find stats for this product across all timeframes
                    const productMetadata: MetadataInput[] = [];
                    let hasAnyStats = false;

                    for (const days of this.timeframes) {
                        const statsForTimeframe = productStatsMap.get(days);
                        if (!statsForTimeframe) continue;

                        // Find stats for this specific product
                        const productStats = statsForTimeframe.stats.find(
                            (stat) =>
                                stat.productId === saleorProduct.productId,
                        );

                        // Only add stats if we have at least 5 orders
                        if (productStats && productStats.totalOrders > 5) {
                            hasAnyStats = true;

                            // Create single JSON metadata key for this timeframe
                            productMetadata.push({
                                key: `salesStats_${days}d`,
                                value: JSON.stringify({
                                    productId: productStats.productId,
                                    productSku: productStats.productSku,
                                    variantCount: productStats.variantCount,
                                    totalOrders: productStats.totalOrders,
                                    totalQuantity: productStats.totalQuantity,
                                    totalRevenue: productStats.totalRevenue,
                                    uniqueCustomers:
                                        productStats.uniqueCustomers,
                                    avgOrderQuantity:
                                        productStats.avgOrderQuantity,
                                    avgOrderValue: productStats.avgOrderValue,
                                    period: productStats.period,
                                    lastUpdated: productStats.lastUpdated,
                                }),
                            });
                        }
                    }

                    if (productMetadata.length > 0) {
                        // Update Saleor product metadata
                        await this.saleorClient.saleorUpdateMetadata({
                            id: saleorProduct.id, // Use Saleor product ID
                            input: productMetadata,
                        });

                        updatedCount++;

                        if (hasAnyStats) {
                            this.logger.debug(
                                `Updated product ${saleorProduct.product.name}`,
                                {
                                    saleorProductId: saleorProduct.id,
                                    internalProductId: saleorProduct.productId,
                                    metadataKeys: productMetadata.length,
                                },
                            );
                        }
                    } else {
                        skippedCount++;
                    }
                } catch (error) {
                    this.logger.error(
                        `Failed to update product ${saleorProduct.product.name}`,
                        {
                            saleorProductId: saleorProduct.id,
                            internalProductId: saleorProduct.productId,
                            error:
                                error instanceof Error
                                    ? error.message
                                    : String(error),
                        },
                    );
                    skippedCount++;
                }
            }

            // Small delay between batches to avoid overwhelming Saleor
            if (i + this.batchSize < saleorProducts.length) {
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        const result = {
            totalProducts: saleorProducts.length,
            updatedCount,
            skippedCount,
            timeframes: this.timeframes,
        };

        this.logger.info(
            "Completed product sales stats sync to Saleor",
            result,
        );

        return result;
    }
}
