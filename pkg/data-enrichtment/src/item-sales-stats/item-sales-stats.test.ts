import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ItemSalesStatsService } from "./index";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ItemSalesStatsService", () => {
    const prismaClient = new PrismaClient();
    const logger = new AssertionLogger();

    test("It should calculate item sales stats for last 30 days", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger,
        });

        const result = await service.getItemSalesStatsForLastDays(30, {
            limit: 10,
            minOrders: 2, // Only items with at least 2 orders
            orderBy: 'totalOrders',
            orderDirection: 'desc',
        });

        expect(result).toBeDefined();
        expect(result.stats).toBeDefined();
        expect(result.totalItems).toBeGreaterThanOrEqual(0);
        expect(result.period).toBe("30 days");
        expect(result.startDate).toBeDefined();
        expect(result.endDate).toBeDefined();

        if (result.stats.length > 0) {
            const firstItem = result.stats[0];
            expect(firstItem.sku).toBeDefined();
            expect(firstItem.totalOrders).toBeGreaterThanOrEqual(2);
            expect(firstItem.totalQuantity).toBeGreaterThan(0);
            expect(firstItem.uniqueCustomers).toBeGreaterThan(0);
            expect(firstItem.avgOrderQuantity).toBeGreaterThan(0);
            
            console.log("Top selling item:", {
                sku: firstItem.sku,
                totalOrders: firstItem.totalOrders,
                totalQuantity: firstItem.totalQuantity,
                uniqueCustomers: firstItem.uniqueCustomers,
                totalRevenue: firstItem.totalRevenue,
                avgOrderQuantity: firstItem.avgOrderQuantity.toFixed(2),
                avgOrderValue: firstItem.avgOrderValue.toFixed(2),
            });
        }

        console.log(`Found ${result.totalItems} items with sales data`);
    }, 30000);

    test("It should get top selling items by different criteria", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger,
        });

        // Test different criteria
        const topByOrders = await service.getTopSellingItems(30, 'orders', 5);
        const topByQuantity = await service.getTopSellingItems(30, 'quantity', 5);
        const topByRevenue = await service.getTopSellingItems(30, 'revenue', 5);

        expect(topByOrders).toBeDefined();
        expect(topByQuantity).toBeDefined();
        expect(topByRevenue).toBeDefined();

        console.log("Top 5 by orders:", topByOrders.map(item => ({
            sku: item.sku,
            orders: item.totalOrders,
        })));

        console.log("Top 5 by quantity:", topByQuantity.map(item => ({
            sku: item.sku,
            quantity: item.totalQuantity,
        })));

        console.log("Top 5 by revenue:", topByRevenue.map(item => ({
            sku: item.sku,
            revenue: item.totalRevenue.toFixed(2),
        })));
    }, 30000);

    test("It should get stats for a specific SKU", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger,
        });

        // First get top items to find a SKU to test with
        const topItems = await service.getTopSellingItems(30, 'orders', 1);
        
        if (topItems.length > 0) {
            const testSku = topItems[0].sku;
            const skuStats = await service.getItemSalesStatsForSku(testSku, 30);

            expect(skuStats).toBeDefined();
            expect(skuStats!.sku).toBe(testSku);
            expect(skuStats!.totalOrders).toBeGreaterThan(0);

            console.log(`Stats for SKU ${testSku}:`, {
                totalOrders: skuStats!.totalOrders,
                totalQuantity: skuStats!.totalQuantity,
                uniqueCustomers: skuStats!.uniqueCustomers,
                totalRevenue: skuStats!.totalRevenue.toFixed(2),
            });
        }
    }, 30000);

    test("It should get sales summary", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger,
        });

        const summary = await service.getSalesSummary(30);

        expect(summary).toBeDefined();
        expect(summary.totalItems).toBeGreaterThanOrEqual(0);
        expect(summary.period).toBe("30 days");

        console.log("Sales Summary (30 days):", {
            totalItems: summary.totalItems,
            totalOrders: summary.totalOrders,
            totalQuantity: summary.totalQuantity,
            totalRevenue: summary.totalRevenue.toFixed(2),
            avgItemsPerOrder: summary.avgItemsPerOrder.toFixed(2),
        });
    }, 30000);

    test("It should format stats for display", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger,
        });

        const topItems = await service.getTopSellingItems(30, 'orders', 1);
        
        if (topItems.length > 0) {
            const formatted = service.formatStatsForDisplay(topItems[0]);

            expect(formatted).toBeDefined();
            expect(formatted.sku).toBeDefined();
            expect(formatted.totalOrders).toBeDefined();
            expect(formatted.totalRevenue).toMatch(/^€/); // Should start with €
            expect(formatted.avgOrderValue).toMatch(/^€/); // Should start with €

            console.log("Formatted stats:", formatted);
        }
    }, 30000);
});
