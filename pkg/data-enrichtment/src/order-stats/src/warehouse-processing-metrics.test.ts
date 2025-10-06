// Test the warehouse processing metrics service with live data
import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";
import { describe, it, expect } from "@jest/globals";
import { WarehouseProcessingMetricsService } from "./warehouse-processing-metrics";

const prisma = new PrismaClient();

describe("WarehouseProcessingMetricsService", () => {
    it("should calculate processing metrics for EC orders", async () => {
        const service = new WarehouseProcessingMetricsService({
            db: prisma,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        const metrics = await service.getMetricsForLastDays(30);

        expect(metrics).toBeDefined();
        expect(metrics.totalOrders).toBeGreaterThan(0);
        expect(metrics.avgWorkingHours).toBeGreaterThan(0);
        expect(metrics.medianWorkingHours).toBeGreaterThan(0);
        expect(metrics.p90WorkingHours).toBeGreaterThan(0);

        console.log("\nWarehouse Processing Metrics:");
        console.log({
            totalOrders: metrics.totalOrders,
            outliersExcluded: metrics.outliersExcluded,
            dataErrors: metrics.dataErrors,
            avgWorkingHours: metrics.avgWorkingHours,
            medianWorkingHours: metrics.medianWorkingHours,
            p90WorkingHours: metrics.p90WorkingHours,
            p95WorkingHours: metrics.p95WorkingHours,
            p99WorkingHours: metrics.p99WorkingHours,
        });

        console.log("\nBusiness Day Equivalents:");
        console.log({
            avgBusinessDays: metrics.avgBusinessDays,
            medianBusinessDays: metrics.medianBusinessDays,
            p90BusinessDays: metrics.p90BusinessDays,
            p95BusinessDays: metrics.p95BusinessDays,
            p99BusinessDays: metrics.p99BusinessDays,
        });

        if (metrics.outliers.totalOutliers > 0) {
            console.log("\nOutlier Analysis:");
            console.log({
                totalOutliers: metrics.outliers.totalOutliers,
                paymentStatusDistribution: metrics.outliers.paymentStatusDistribution,
            });
        }
    }, 30000);

    it("should format metrics for Saleor metadata", async () => {
        const service = new WarehouseProcessingMetricsService({
            db: prisma,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        const metrics = await service.getMetricsForLastDays(30);
        const saleorMetadata = service.formatForSaleorMetadata(metrics);

        expect(saleorMetadata).toBeDefined();
        expect(saleorMetadata.totalOrders).toBeDefined();
        expect(saleorMetadata.avgWorkingHours).toBeDefined();
        expect(saleorMetadata.p90WorkingHours).toBeDefined();
        expect(saleorMetadata.processingTimeDisplay).toBeDefined();
        expect(saleorMetadata.lastUpdated).toBeDefined();

        console.log("\nSaleor Metadata Format:");
        console.log(saleorMetadata);

        // Verify all values are strings (required for Saleor metadata)
        Object.values(saleorMetadata).forEach(value => {
            expect(typeof value).toBe("string");
        });
    }, 30000);

    it("should handle custom date ranges", async () => {
        const service = new WarehouseProcessingMetricsService({
            db: prisma,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // Last 7 days

        const metrics = await service.calculateProcessingMetrics(startDate, endDate);

        expect(metrics).toBeDefined();
        expect(metrics.totalOrders).toBeGreaterThanOrEqual(0);

        console.log("\nLast 7 Days Metrics:");
        console.log({
            totalOrders: metrics.totalOrders,
            avgWorkingHours: metrics.avgWorkingHours,
            p90WorkingHours: metrics.p90WorkingHours,
        });
    }, 30000);
});
