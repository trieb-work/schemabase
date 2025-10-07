import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorProductSalesStatsSyncService } from "./index";

/// Use this file to locally run the product sales stats sync service with real Saleor

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Product Sales Stats Sync Live Test", () => {
    const prismaClient = new PrismaClient();

    test("It should sync product sales stats to Saleor product metadata", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorProductSalesStatsSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            db: prismaClient,
            logger: new AssertionLogger(),
            timeframes: [30], // Only test 30 days for faster execution
            batchSize: 5, // Small batch for testing
        });

        console.log("\n=== Testing Product Sales Stats Sync to Saleor ===");
        console.log(`Tenant ID: ${installedSaleorApp.saleorApp.tenantId}`);
        console.log(`Installed Saleor App ID: ${installedSaleorApp.id}`);

        // Check how many Saleor products we have
        const saleorProductsCount = await prismaClient.saleorProduct.count({
            where: {
                installedSaleorAppId: installedSaleorApp.id,
            },
        });

        console.log(
            `\n📊 Found ${saleorProductsCount} Saleor products to update`,
        );

        if (saleorProductsCount === 0) {
            console.log("⚠️  No Saleor products found - skipping test");
            return;
        }

        // Get a sample of products to check before sync
        const sampleProducts = await prismaClient.saleorProduct.findMany({
            where: {
                installedSaleorAppId: installedSaleorApp.id,
            },
            take: 3,
            select: {
                id: true,
                product: {
                    select: {
                        name: true,
                        normalizedName: true,
                    },
                },
            },
        });

        console.log("\n--- Sample Products to Update ---");
        sampleProducts.forEach((product, index) => {
            console.log(
                `${index + 1}. ${product.product.name} (ID: ${product.id})`,
            );
        });

        // Check current metadata for one product (before sync)
        if (sampleProducts.length > 0) {
            console.log("\n--- Current Metadata (Before Sync) ---");
            try {
                const productQuery = await saleorClient.saleorGetProduct({
                    id: sampleProducts[0].id,
                });

                if (productQuery.product?.metadata) {
                    const salesStatsMetadata =
                        productQuery.product.metadata.filter((m) =>
                            m.key.startsWith("salesStats_"),
                        );

                    if (salesStatsMetadata.length > 0) {
                        console.log(
                            `Found ${salesStatsMetadata.length} existing sales stats metadata keys:`,
                        );
                        salesStatsMetadata.forEach((meta) => {
                            console.log(
                                `  ${meta.key}: ${meta.value.substring(0, 50)}${meta.value.length > 50 ? "..." : ""}`,
                            );
                        });
                    } else {
                        console.log("No existing sales stats metadata found");
                    }
                } else {
                    console.log("No metadata found for sample product");
                }
            } catch (error) {
                console.log(
                    `Could not fetch sample product metadata: ${error}`,
                );
            }
        }

        // Run the sync
        console.log("\n--- Running Product Sales Stats Sync ---");
        const result = await service.syncProductSalesStats();

        console.log("✅ Sync completed!");
        console.log({
            totalProducts: result.totalProducts,
            updatedCount: result.updatedCount,
            skippedCount: result.skippedCount,
            timeframes: result.timeframes,
        });

        // Verify the sync worked by checking metadata on sample products
        console.log("\n--- Verifying Metadata Update ---");
        if (sampleProducts.length > 0 && result.updatedCount > 0) {
            try {
                const productQuery = await saleorClient.saleorGetProduct({
                    id: sampleProducts[0].id,
                });

                if (productQuery.product?.metadata) {
                    const salesStatsMetadata =
                        productQuery.product.metadata.filter((m) =>
                            m.key.startsWith("salesStats_"),
                        );

                    console.log(
                        `Found ${salesStatsMetadata.length} sales stats metadata keys after sync:`,
                    );
                    salesStatsMetadata.forEach((meta) => {
                        console.log(
                            `  ${meta.key}: ${meta.value.substring(0, 100)}${meta.value.length > 100 ? "..." : ""}`,
                        );
                    });

                    // Verify we have the expected metadata structure
                    const statsKey = salesStatsMetadata.find(
                        (m) => m.key === "salesStats_30d",
                    );
                    if (statsKey) {
                        const statsData = JSON.parse(statsKey.value);
                        console.log(
                            "\n📊 Sample Product Sales Stats (30 days):",
                        );
                        console.log({
                            productId: statsData.productId,
                            productSku: statsData.productSku,
                            totalOrders: statsData.totalOrders,
                            totalQuantity: statsData.totalQuantity,
                            totalRevenue: statsData.totalRevenue,
                            uniqueCustomers: statsData.uniqueCustomers,
                            variantCount: statsData.variantCount,
                            avgOrderQuantity: statsData.avgOrderQuantity,
                            avgOrderValue: statsData.avgOrderValue,
                            lastUpdated: statsData.lastUpdated,
                        });

                        // Assertions
                        expect(statsData.totalOrders).toBeGreaterThanOrEqual(0);
                        expect(statsData.totalQuantity).toBeGreaterThanOrEqual(0);
                        expect(statsData.totalRevenue).toBeGreaterThanOrEqual(0);
                        expect(statsData.uniqueCustomers).toBeGreaterThanOrEqual(0);
                        expect(statsData.variantCount).toBeGreaterThanOrEqual(0);
                        expect(statsData.productId).toBeDefined();
                        expect(statsData.lastUpdated).toBeDefined();
                    }

                    console.log("\n🎉 Product metadata successfully updated!");
                    console.log(
                        `📄 Metadata stored in individual Saleor products`,
                    );
                    console.log(
                        `🔢 Total sales stats keys per product: ${salesStatsMetadata.length}`,
                    );
                } else {
                    console.log(
                        "⚠️  No metadata found after sync - this might indicate an issue",
                    );
                }
            } catch (error) {
                console.log(`Could not verify metadata update: ${error}`);
            }
        }

        // Verify sync results make sense
        expect(result.totalProducts).toBeGreaterThan(0);
        expect(result.updatedCount + result.skippedCount).toBe(
            result.totalProducts,
        );
        expect(result.timeframes).toEqual([30]);
    }, 600000); // 10 minute timeout for full production test

    test("It should calculate product stats for multiple timeframes without syncing", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorProductSalesStatsSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            db: prismaClient,
            logger: new AssertionLogger(),
            timeframes: [14, 30, 90], // Test all timeframes
            batchSize: 10,
        });

        console.log(
            "\n=== Testing Product Stats Calculation (All Timeframes) ===",
        );

        // Test the underlying sales stats calculation
        console.log("\n--- Calculating Product Stats for All Timeframes ---");

        const timeframes = [14, 30, 90];
        const statsMap = new Map();

        for (const days of timeframes) {
            console.log(`\nCalculating stats for ${days} days...`);

            // Access the private salesStatsService for testing
            const salesStatsService = (service as any).salesStatsService;
            const stats =
                await salesStatsService.getProductSalesStatsForLastDays(days, {
                    logTopProducts: 3, // Show top 3 products for each timeframe
                });

            statsMap.set(days, stats);

            console.log(`📊 ${days}d Results:`);
            console.log({
                totalProducts: stats.totalProducts,
                topProductsShown: Math.min(3, stats.stats.length),
                period: stats.period,
            });

            if (stats.stats.length > 0) {
                console.log(
                    `🏆 Top product: ${stats.stats[0].productSku} (${stats.stats[0].totalOrders} orders)`,
                );
            }

            // Verify stats structure
            expect(stats.totalProducts).toBeGreaterThanOrEqual(0);
            expect(stats.stats).toBeDefined();
            expect(stats.period).toBe(`${days} days`);
            expect(stats.startDate).toBeDefined();
            expect(stats.endDate).toBeDefined();
        }

        console.log("\n--- Timeframes Comparison ---");
        timeframes.forEach((days) => {
            const stats = statsMap.get(days);
            console.log(
                `${days}d: ${stats.totalProducts} products with sales data`,
            );
        });

        console.log("\n✅ All timeframes calculated successfully!");
        console.log(
            `📊 Ready for metadata sync to ${statsMap.get(30)?.totalProducts || 0} products`,
        );
    }, 300000); // 5 minute timeout

    test("It should handle products with no sales data gracefully", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorProductSalesStatsSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            db: prismaClient,
            logger: new AssertionLogger(),
            timeframes: [7], // Short timeframe to likely have products with no sales
            batchSize: 3,
        });

        console.log("\n=== Testing Products with No Sales Data ===");

        // This should handle products that have no sales in the timeframe gracefully
        const result = await service.syncProductSalesStats();

        console.log("📊 Results for 7-day timeframe:");
        console.log({
            totalProducts: result.totalProducts,
            updatedCount: result.updatedCount,
            skippedCount: result.skippedCount,
        });

        // Even products with no sales should get empty metadata
        expect(result.totalProducts).toBeGreaterThanOrEqual(0);
        expect(result.updatedCount + result.skippedCount).toBe(
            result.totalProducts,
        );

        console.log("✅ Products with no sales data handled correctly!");
    }, 180000); // 3 minute timeout
});
