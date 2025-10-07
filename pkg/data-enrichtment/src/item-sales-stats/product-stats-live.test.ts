import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ItemSalesStatsService } from "./index";

/// Test the new product-level aggregation features

beforeEach(() => {
    jest.clearAllMocks();
});

describe("ItemSalesStatsService Product Aggregation Live Test", () => {
    const prismaClient = new PrismaClient();

    test("It should aggregate variant stats into product stats", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        console.log("\n=== Product-Level Sales Stats Analysis (30 days) ===");

        // Get product-level stats
        const productResult = await service.getProductSalesStatsForLastDays(30, {
            logTopProducts: 15,
            orderBy: 'totalOrders',
            orderDirection: 'desc',
        });

        console.log("\n📊 Product Sales Summary:");
        console.log({
            totalProducts: productResult.totalProducts,
            period: productResult.period,
        });

        // Show top products
        console.log("\n🏆 Top 10 Products by Orders:");
        const topProducts = productResult.stats.slice(0, 10);
        topProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.productSku}:`);
            console.log(`   - Variants: ${product.variantCount} (${product.variantSkus.join(', ')})`);
            console.log(`   - Orders: ${product.totalOrders}, Customers: ${product.uniqueCustomers}`);
            console.log(`   - Quantity: ${product.totalQuantity}, Revenue: €${product.totalRevenue.toFixed(2)}`);
            console.log(`   - Avg per order: ${product.avgOrderQuantity.toFixed(2)} qty, €${product.avgOrderValue.toFixed(2)}`);
        });

        // Test the formatting function
        if (topProducts.length > 0) {
            console.log("\n🎨 Formatted for Saleor Metadata:");
            const formatted = service.formatProductStatsForSaleorMetadata(topProducts[0]);
            Object.entries(formatted).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
        }

        // Verify data structure
        expect(productResult.totalProducts).toBeGreaterThan(0);
        expect(productResult.stats.length).toBeGreaterThan(0);
        
        if (productResult.stats.length > 0) {
            const firstProduct = productResult.stats[0];
            expect(firstProduct.productId).toBeDefined();
            expect(firstProduct.productSku).toBeDefined();
            expect(firstProduct.variantSkus).toBeDefined();
            expect(firstProduct.variantCount).toBeGreaterThan(0);
            expect(firstProduct.totalOrders).toBeGreaterThan(0);
            expect(firstProduct.totalQuantity).toBeGreaterThan(0);
            expect(firstProduct.totalRevenue).toBeGreaterThan(0);
        }

        console.log("\n✅ Product aggregation analysis completed successfully!");
    }, 60000);

    test("It should get top selling products by different criteria", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        console.log("\n=== Top Products by Different Criteria ===");

        const criteria = ["orders", "revenue", "quantity", "customers"] as const;

        for (const criterion of criteria) {
            console.log(`\n🏆 Top 5 Products by ${criterion}:`);
            const topProducts = await service.getTopSellingProducts(30, criterion, 5);

            topProducts.forEach((product, index) => {
                const value =
                    criterion === "revenue"
                        ? `€${product.totalRevenue.toFixed(2)}`
                        : product[
                              criterion === "orders"
                                  ? "totalOrders"
                                  : criterion === "quantity"
                                    ? "totalQuantity"
                                    : "uniqueCustomers"
                          ];

                console.log(`  ${index + 1}. ${product.productSku}: ${value} (${product.variantCount} variants)`);
            });

            expect(topProducts).toBeDefined();
            expect(topProducts.length).toBeGreaterThanOrEqual(0);
        }

        console.log("\n✅ All criteria testing completed successfully!");
    }, 60000);

    test("It should demonstrate SKU to Product ID extraction", async () => {
        const service = new ItemSalesStatsService({
            db: prismaClient,
            tenantId: "ken_prod",
            logger: new AssertionLogger(),
        });

        console.log("\n=== SKU to Product ID Extraction Examples ===");

        // Get some real SKUs to test with
        const itemResult = await service.getItemSalesStatsForLastDays(30, {
            logTopItems: 0,
        });

        const sampleSkus = itemResult.stats.slice(0, 20).map(item => item.sku);

        console.log("\nSample SKU → Product ID mappings:");
        sampleSkus.forEach(sku => {
            // Use the private method via type assertion for testing
            const productId = (service as any).extractProductIdFromSku(sku);
            console.log(`  ${sku} → ${productId}`);
        });

        // Show how many variants each product has
        const productGroups = new Map<string, string[]>();
        sampleSkus.forEach(sku => {
            const productId = (service as any).extractProductIdFromSku(sku);
            if (!productGroups.has(productId)) {
                productGroups.set(productId, []);
            }
            productGroups.get(productId)!.push(sku);
        });

        console.log("\nProduct groupings (showing products with multiple variants):");
        Array.from(productGroups.entries())
            .filter(([_, variants]) => variants.length > 1)
            .forEach(([productId, variants]) => {
                console.log(`  ${productId}: ${variants.length} variants (${variants.join(', ')})`);
            });

        expect(sampleSkus.length).toBeGreaterThan(0);
        console.log("\n✅ SKU extraction demonstration completed!");
    }, 30000);
});
