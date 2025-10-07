import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ItemSalesStatsService } from "./index";

/// Use this file to locally run the item sales stats service with real data

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ItemSalesStatsService Live Test", () => {
    const prismaClient = new PrismaClient();

    test("It should analyze real sales data for last 30 days", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        console.log("\n=== Item Sales Stats Analysis (30 days) ===");

        // Get overall summary
        const summary = await service.getSalesSummary(30);
        console.log("\n📊 Sales Summary:");
        console.log({
            totalItems: summary.totalItems,
            totalOrders: summary.totalOrders,
            totalQuantity: summary.totalQuantity.toFixed(2),
            totalRevenue: `€${summary.totalRevenue.toFixed(2)}`,
            avgItemsPerOrder: summary.avgItemsPerOrder.toFixed(2),
        });

        // Get top sellers by different criteria
        console.log("\n🏆 Top 10 Items by Orders:");
        const topByOrders = await service.getTopSellingItems(30, 'orders', 10);
        topByOrders.forEach((item, index) => {
            console.log(`${index + 1}. ${item.sku}: ${item.totalOrders} orders, ${item.totalQuantity} qty, ${item.uniqueCustomers} customers`);
        });

        console.log("\n💰 Top 10 Items by Revenue:");
        const topByRevenue = await service.getTopSellingItems(30, 'revenue', 10);
        topByRevenue.forEach((item, index) => {
            console.log(`${index + 1}. ${item.sku}: €${item.totalRevenue.toFixed(2)}, ${item.totalOrders} orders, avg €${item.avgOrderValue.toFixed(2)}/order`);
        });

        console.log("\n📦 Top 10 Items by Quantity:");
        const topByQuantity = await service.getTopSellingItems(30, 'quantity', 10);
        topByQuantity.forEach((item, index) => {
            console.log(`${index + 1}. ${item.sku}: ${item.totalQuantity} qty, ${item.totalOrders} orders, avg ${item.avgOrderQuantity.toFixed(2)}/order`);
        });

        console.log("\n👥 Top 10 Items by Unique Customers:");
        const topByCustomers = await service.getTopSellingItems(30, 'customers', 10);
        topByCustomers.forEach((item, index) => {
            console.log(`${index + 1}. ${item.sku}: ${item.uniqueCustomers} customers, ${item.totalOrders} orders`);
        });

        // Verify data makes sense
        expect(summary.totalItems).toBeGreaterThan(0);
        expect(topByOrders.length).toBeGreaterThan(0);
        expect(topByRevenue.length).toBeGreaterThan(0);

        console.log("\n✅ Sales stats analysis completed successfully!");
    }, 60000);

    test("It should analyze trending data for a specific item", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        // Get a top-selling item to analyze
        const topItems = await service.getTopSellingItems(30, 'orders', 1);
        
        if (topItems.length > 0) {
            const testSku = topItems[0].sku;
            console.log(`\n=== Trending Analysis for SKU: ${testSku} ===`);

            const trendingData = await service.getItemSalesStatsMultipleTimeframes(testSku, [7, 14, 30, 90]);

            console.log("\n📈 Sales Trend:");
            Object.entries(trendingData).forEach(([period, stats]) => {
                if (stats) {
                    console.log(`${period}: ${stats.totalOrders} orders, ${stats.totalQuantity} qty, ${stats.uniqueCustomers} customers, €${stats.totalRevenue.toFixed(2)}`);
                } else {
                    console.log(`${period}: No sales data`);
                }
            });

            // Show formatted display version
            if (trendingData['30d']) {
                console.log("\n🎨 Formatted Display:");
                const formatted = service.formatStatsForDisplay(trendingData['30d']!);
                Object.entries(formatted).forEach(([key, value]) => {
                    console.log(`  ${key}: ${value}`);
                });
            }

            expect(trendingData).toBeDefined();
            console.log("\n✅ Trending analysis completed successfully!");
        } else {
            console.log("No items found for trending analysis");
        }
    }, 60000);

    test("It should handle different filtering options", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        console.log("\n=== Testing Different Filters ===");

        // Test with minimum orders filter
        console.log("\n🔍 Items with at least 5 orders (last 30 days):");
        const highVolumeItems = await service.getItemSalesStatsForLastDays(30, {
            minOrders: 5,
            orderBy: 'totalOrders',
            orderDirection: 'desc',
            limit: 5,
        });

        highVolumeItems.stats.forEach((item, index) => {
            console.log(`${index + 1}. ${item.sku}: ${item.totalOrders} orders, ${item.uniqueCustomers} customers`);
        });

        // Test with different time periods
        console.log("\n📅 Comparison across time periods:");
        const periods = [7, 14, 30];
        for (const days of periods) {
            const result = await service.getItemSalesStatsForLastDays(days, {
                minOrders: 1,
                limit: 1,
                orderBy: 'totalOrders',
                orderDirection: 'desc',
            });
            
            if (result.stats.length > 0) {
                const topItem = result.stats[0];
                console.log(`Last ${days} days - Top item: ${topItem.sku} (${topItem.totalOrders} orders)`);
            }
        }

        expect(highVolumeItems.stats.length).toBeGreaterThanOrEqual(0);
        console.log("\n✅ Filter testing completed successfully!");
    }, 60000);
});
