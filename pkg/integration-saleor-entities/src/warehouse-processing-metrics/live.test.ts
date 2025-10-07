import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorWarehouseProcessingMetricsPageService } from "./index";

/// Use this file to locally run the warehouse processing metrics page service with real Saleor

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Warehouse Processing Metrics Page Live Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync warehouse processing metrics to Saleor page", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorWarehouseProcessingMetricsPageService({
            saleorClient,
            installedSaleorAppId: installedSaleorApp.id,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            db: prismaClient,
            logger: new AssertionLogger(),
        });

        console.log("\n=== Testing Warehouse Processing Metrics Page Sync ===");
        console.log(`Tenant ID: ${installedSaleorApp.saleorApp.tenantId}`);
        console.log(`Installed Saleor App ID: ${installedSaleorApp.id}`);

        // First, get current metrics from Saleor page (if any)
        console.log("\n--- Current Metrics in Saleor Page ---");
        const currentMetrics = await service.getCurrentMetricsFromSaleor();
        if (currentMetrics) {
            console.log("Found existing metrics:");
            Object.entries(currentMetrics).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
        } else {
            console.log(
                "No existing warehouse processing metrics found in Saleor page",
            );
        }

        // Calculate fresh metrics
        console.log("\n--- Calculating Fresh Metrics ---");
        const freshMetrics = await service.calculateCurrentMetrics(30);
        console.log("Fresh metrics calculated:");
        console.log({
            totalOrders: freshMetrics.totalOrders,
            avgWorkingHours: freshMetrics.avgWorkingHours,
            medianWorkingHours: freshMetrics.medianWorkingHours,
            p90WorkingHours: freshMetrics.p90WorkingHours,
            p95WorkingHours: freshMetrics.p95WorkingHours,
            avgBusinessDays: freshMetrics.avgBusinessDays,
            p90BusinessDays: freshMetrics.p90BusinessDays,
            dataErrors: freshMetrics.dataErrors,
            outliersExcluded: freshMetrics.outliersExcluded,
        });

        // Sync to Saleor page
        console.log("\n--- Syncing to Saleor Page ---");
        await service.syncWarehouseMetricsToSaleor();
        console.log("✅ Successfully synced metrics to Saleor page!");

        // Verify the sync worked
        console.log("\n--- Verifying Page Sync ---");
        const updatedMetrics = await service.getCurrentMetricsFromSaleor();
        if (updatedMetrics) {
            console.log("Updated metrics in Saleor page:");
            Object.entries(updatedMetrics).forEach(([key, value]) => {
                console.log(
                    `  ${key}: ${typeof value === "object" ? JSON.stringify(value).substring(0, 100) + "..." : value}`,
                );
            });

            // Verify the JSON structure - check that we have the expected keys
            expect(updatedMetrics.warehouseProcessing_30d).toBeDefined();
            expect(updatedMetrics.warehouseProcessing_90d).toBeDefined();
            expect(updatedMetrics.warehouseProcessing_current).toBeDefined();

            // Verify the current metrics contain the expected fields
            const currentData = updatedMetrics.warehouseProcessing_current;
            expect(currentData.totalOrders).toBeDefined();
            expect(currentData.avgWorkingHours).toBeDefined();
            expect(currentData.p90WorkingHours).toBeDefined();
            expect(currentData.processingTimeDisplay).toBeDefined();
            expect(currentData.lastUpdated).toBeDefined();

            console.log("\n🎉 All metrics successfully synced and verified!");
            console.log(
                `📊 Customer-facing display: ${currentData.processingTimeDisplay}`,
            );
            console.log(`🕒 Last updated: ${currentData.lastUpdated}`);
            console.log(`📄 Data stored in Saleor page: shop-metrics`);
            console.log(
                `🔢 Total metadata keys: ${Object.keys(updatedMetrics).length} (much cleaner!)`,
            );
        } else {
            throw new Error(
                "Failed to retrieve updated metrics from Saleor page",
            );
        }
    }, 60000); // 60 second timeout for live test

    test("It should calculate metrics for all timeframes without syncing", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorWarehouseProcessingMetricsPageService({
            saleorClient,
            installedSaleorAppId: installedSaleorApp.id,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            db: prismaClient,
            logger: new AssertionLogger(),
        });

        console.log(
            "\n=== Testing All Timeframe Metrics Calculation (Page Service) ===",
        );

        // Test all standard timeframes at once
        const allMetrics = await service.calculateAllTimeframeMetrics();

        console.log("\n--- All Timeframes Summary ---");
        Object.entries(allMetrics).forEach(
            ([timeframe, metrics]: [string, any]) => {
                console.log(
                    `\n${timeframe.toUpperCase()} (${metrics.period}):`,
                );
                console.log({
                    totalOrders: metrics.totalOrders,
                    avgWorkingHours: metrics.avgWorkingHours,
                    p90WorkingHours: metrics.p90WorkingHours,
                    avgBusinessDays: metrics.avgBusinessDays,
                    p90BusinessDays: metrics.p90BusinessDays,
                    processingTimeDisplay:
                        metrics.formattedForSaleor.processingTimeDisplay,
                });

                // Verify metrics make sense
                expect(metrics.totalOrders).toBeGreaterThanOrEqual(0);
                expect(metrics.avgWorkingHours).toBeGreaterThanOrEqual(0);
                expect(metrics.p90WorkingHours).toBeGreaterThanOrEqual(0);
            },
        );

        console.log("\n✅ All timeframes calculated successfully!");
        console.log(`📊 Total timeframes: ${Object.keys(allMetrics).length}`);
        console.log("📄 Ready for storage in Saleor page: shop-metrics");
    }, 60000);
});
