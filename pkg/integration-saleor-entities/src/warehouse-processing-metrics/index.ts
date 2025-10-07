import { ILogger } from "@eci/pkg/logger";
import {
    PageQuery,
    PageCreateMutation,
    SaleorUpdateMetadataMutation,
    MetadataInput,
} from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { WarehouseProcessingMetricsService } from "@eci/pkg/data-enrichtment/src/order-stats/src/warehouse-processing-metrics";

interface SaleorWarehouseProcessingMetricsPageServiceConfig {
    saleorClient: {
        page: (variables: { slug: string }) => Promise<PageQuery>;
        pageCreate: (variables: any) => Promise<PageCreateMutation>;
        saleorUpdateMetadata: (variables: {
            id: string;
            input: MetadataInput[];
        }) => Promise<SaleorUpdateMetadataMutation>;
    };
    installedSaleorAppId: string;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorWarehouseProcessingMetricsPageService {
    public readonly saleorClient: {
        page: (variables: { slug: string }) => Promise<PageQuery>;
        pageCreate: (variables: any) => Promise<PageCreateMutation>;
        saleorUpdateMetadata: (variables: {
            id: string;
            input: MetadataInput[];
        }) => Promise<SaleorUpdateMetadataMutation>;
    };

    private readonly logger: ILogger;

    public readonly installedSaleorAppId: string;

    public readonly tenantId: string;

    private readonly db: PrismaClient;

    private readonly warehouseMetricsService: WarehouseProcessingMetricsService;

    public constructor(
        config: SaleorWarehouseProcessingMetricsPageServiceConfig,
    ) {
        this.saleorClient = config.saleorClient;
        this.logger = config.logger;
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.tenantId = config.tenantId;
        this.db = config.db;

        // Initialize the warehouse metrics service
        this.warehouseMetricsService = new WarehouseProcessingMetricsService({
            db: this.db,
            tenantId: this.tenantId,
            logger: this.logger,
        });
    }

    /**
     * Get or create the shop-metrics page
     */
    private async getOrCreateMetricsPage(): Promise<string> {
        try {
            // Try to get existing page
            const pageResponse = await this.saleorClient.page({
                slug: "shop-metrics",
            });

            if (pageResponse.page) {
                this.logger.info("Found existing shop-metrics page", {
                    pageId: pageResponse.page.id,
                    title: pageResponse.page.title,
                });
                return pageResponse.page.id;
            }

            // Create new page if it doesn't exist
            this.logger.info("Creating new shop-metrics page");
            const createResponse = await this.saleorClient.pageCreate({
                input: {
                    title: "Shop Metrics",
                    slug: "shop-metrics",
                    isPublished: false, // Keep it private
                    content: JSON.stringify({
                        description:
                            "Internal page for storing warehouse processing metrics",
                        createdAt: new Date().toISOString(),
                    }),
                },
            });

            if (createResponse.pageCreate?.page) {
                this.logger.info("Created shop-metrics page", {
                    pageId: createResponse.pageCreate.page.id,
                });
                return createResponse.pageCreate.page.id;
            }

            throw new Error("Failed to create shop-metrics page");
        } catch (error) {
            this.logger.error("Error getting or creating metrics page", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }

    /**
     * Calculate warehouse processing metrics for multiple timeframes and sync them to Saleor page metadata
     */
    public async syncWarehouseMetricsToSaleor(): Promise<void> {
        this.logger.info(
            "Starting warehouse processing metrics sync to Saleor page",
            {
                tenantId: this.tenantId,
                installedSaleorAppId: this.installedSaleorAppId,
            },
        );

        try {
            // Get or create the shop-metrics page
            const pageId = await this.getOrCreateMetricsPage();

            this.logger.info("Using metrics page", {
                pageId,
                slug: "shop-metrics",
            });

            // Calculate metrics for multiple timeframes
            const timeframes = [7, 14, 30, 90];
            const allMetadataInput: MetadataInput[] = [];

            for (const days of timeframes) {
                this.logger.info(`Calculating metrics for last ${days} days`);

                const metrics =
                    await this.warehouseMetricsService.getMetricsForLastDays(
                        days,
                    );

                this.logger.info(`Calculated ${days}-day metrics`, {
                    totalOrders: metrics.totalOrders,
                    avgWorkingHours: metrics.avgWorkingHours,
                    p90WorkingHours: metrics.p90WorkingHours,
                    dataErrors: metrics.dataErrors,
                });

                // Format metrics for Saleor metadata and store as JSON
                const saleorMetadata =
                    this.warehouseMetricsService.formatForSaleorMetadata(
                        metrics,
                    );

                // Store entire metrics object as JSON value
                allMetadataInput.push({
                    key: `warehouseProcessing_${days}d`,
                    value: JSON.stringify(saleorMetadata),
                });
            }

            // Add a general "current" set based on 30-day metrics for backward compatibility
            const currentMetrics =
                await this.warehouseMetricsService.getMetricsForLastDays(30);
            const currentSaleorMetadata =
                this.warehouseMetricsService.formatForSaleorMetadata(
                    currentMetrics,
                );
            allMetadataInput.push({
                key: `warehouseProcessing_current`,
                value: JSON.stringify(currentSaleorMetadata),
            });

            // Update page metadata with all timeframes
            await this.saleorClient.saleorUpdateMetadata({
                id: pageId,
                input: allMetadataInput,
            });

            this.logger.info(
                "Successfully updated Saleor page metadata with warehouse processing metrics",
                {
                    pageId,
                    timeframes,
                    totalMetadataKeys: allMetadataInput.length,
                    lastUpdated: currentSaleorMetadata.lastUpdated,
                },
            );
        } catch (error) {
            this.logger.error(
                "Failed to sync warehouse metrics to Saleor page",
                {
                    error:
                        error instanceof Error ? error.message : String(error),
                    tenantId: this.tenantId,
                },
            );
            throw error;
        }
    }

    /**
     * Get current warehouse processing metrics from Saleor page metadata
     */
    public async getCurrentMetricsFromSaleor(): Promise<Record<
        string,
        any
    > | null> {
        try {
            const pageResponse = await this.saleorClient.page({
                slug: "shop-metrics",
            });

            if (!pageResponse.page?.metadata) {
                return null;
            }

            // Extract warehouse processing metadata
            const warehouseMetadata: Record<string, any> = {};

            pageResponse.page.metadata.forEach((meta: any) => {
                if (meta.key.startsWith("warehouseProcessing_")) {
                    try {
                        // Parse JSON value
                        warehouseMetadata[meta.key] = JSON.parse(meta.value);
                    } catch (error) {
                        this.logger.warn(
                            `Failed to parse JSON for key ${meta.key}`,
                            {
                                value: meta.value,
                                error:
                                    error instanceof Error
                                        ? error.message
                                        : String(error),
                            },
                        );
                        // Fallback to string value for backward compatibility
                        warehouseMetadata[meta.key] = meta.value;
                    }
                }
            });

            return Object.keys(warehouseMetadata).length > 0
                ? warehouseMetadata
                : null;
        } catch (error) {
            this.logger.error(
                "Failed to get current metrics from Saleor page",
                {
                    error:
                        error instanceof Error ? error.message : String(error),
                },
            );
            return null;
        }
    }

    /**
     * Calculate and return fresh metrics without syncing to Saleor
     */
    public async calculateCurrentMetrics(days: number = 30) {
        return this.warehouseMetricsService.getMetricsForLastDays(days);
    }

    /**
     * Calculate metrics for all standard timeframes (7, 14, 30, 90 days)
     */
    public async calculateAllTimeframeMetrics() {
        const timeframes = [7, 14, 30, 90];
        const results: Record<string, any> = {};

        for (const days of timeframes) {
            this.logger.info(`Calculating metrics for ${days} days`);
            const metrics =
                await this.warehouseMetricsService.getMetricsForLastDays(days);
            results[`${days}d`] = {
                period: `${days} days`,
                ...metrics,
                formattedForSaleor:
                    this.warehouseMetricsService.formatForSaleorMetadata(
                        metrics,
                    ),
            };
        }

        return results;
    }
}
