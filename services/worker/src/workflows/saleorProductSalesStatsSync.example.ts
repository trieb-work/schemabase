/**
 * Example usage of SaleorProductSalesStatsSyncWf
 * 
 * This workflow calculates product-level sales statistics and syncs them to Saleor product metadata.
 * It uses real database relationships between ProductVariant -> Product -> SaleorProduct.
 */

import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";
import { SaleorProductSalesStatsSyncWf } from "./saleorProductSalesStatsSync";

// Example of how to run the workflow manually
export async function runSaleorProductSalesStatsSync() {
    const prisma = new PrismaClient();
    const logger = new AssertionLogger();

    // Mock runtime context (in real usage, this comes from the scheduler)
    const ctx = {
        logger,
        job: {
            updateProgress: (progress: number) => {
                console.log(`Progress: ${progress}%`);
            },
        },
    } as any;

    const workflow = new SaleorProductSalesStatsSyncWf(
        ctx,
        { prisma },
        {
            installedSaleorAppId: "QXBwOjE=", // Replace with actual installed Saleor app ID
            timeframes: [14, 30, 90], // Calculate stats for 14, 30, and 90 days
            batchSize: 50, // Process 50 products at a time
        }
    );

    try {
        await workflow.run();
        console.log("✅ Workflow completed successfully!");
    } catch (error) {
        console.error("❌ Workflow failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

/**
 * What the workflow does:
 * 
 * 1. Calculates product-level sales stats for specified timeframes (14, 30, 90 days)
 * 2. Groups variants by their actual Product using database relationships
 * 3. Finds corresponding SaleorProduct records for each internal Product
 * 4. Updates Saleor product metadata with sales statistics
 * 
 * Metadata structure added to each Saleor product:
 * 
 * For each timeframe (e.g., 30 days):
 * - salesStats_30d: JSON string containing all sales statistics
 * 
 * Example JSON structure:
 * {
 *   "productId": "pro_689QZLR7Sbr85TXB4boaDt",
 *   "productSku": "12gaugedoublewallundergroundwire116", 
 *   "variantCount": 6,
 *   "totalOrders": 107,
 *   "totalQuantity": 282,
 *   "totalRevenue": 14232.74,
 *   "uniqueCustomers": 102,
 *   "avgOrderQuantity": 2.64,
 *   "avgOrderValue": 133.02,
 *   "period": "30 days",
 *   "lastUpdated": "2025-10-07T12:05:28.388Z"
 * }
 * 
 * Benefits:
 * ✅ Real database relationships (no SKU guessing)
 * ✅ Multiple timeframes for trend analysis
 * ✅ Batch processing to avoid overwhelming Saleor
 * ✅ Comprehensive error handling and logging
 * ✅ Progress tracking
 * ✅ Structured metadata for easy frontend consumption
 * 
 * Usage in Saleor storefront:
 * 
 * query {
 *   product(id: "UHJvZHVjdDox") {
 *     metadata {
 *       key
 *       value
 *     }
 *   }
 * }
 * 
 * // Parse and use the sales stats:
 * const salesStats30d = JSON.parse(
 *   product.metadata.find(m => m.key === 'salesStats_30d').value
 * );
 * 
 * // Display bestseller badge:
 * {salesStats30d.totalOrders > 50 && <Badge>Bestseller</Badge>}
 * 
 * // Show sales metrics:
 * <div>
 *   <p>Sold {salesStats30d.totalOrders} times in the last 30 days</p>
 *   <p>Popular with {salesStats30d.uniqueCustomers} customers</p>
 *   <p>Total quantity: {salesStats30d.totalQuantity}</p>
 * </div>
 * 
 * // Compare timeframes for trending:
 * const stats14d = JSON.parse(product.metadata.find(m => m.key === 'salesStats_14d').value);
 * const stats30d = JSON.parse(product.metadata.find(m => m.key === 'salesStats_30d').value);
 * 
 * const trend = (stats14d.totalOrders / 14) > (stats30d.totalOrders / 30) ? 'up' : 'down';
 * {trend === 'up' && <Badge color="green">Trending Up 📈</Badge>}
 */

// Uncomment to run manually (for testing purposes):
// runSaleorProductSalesStatsSync().catch(console.error);
