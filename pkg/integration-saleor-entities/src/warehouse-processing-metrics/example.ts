/**
 * Example usage of SaleorWarehouseProcessingMetricsPageService
 * This shows how to integrate it into a workflow that runs nightly
 * Uses a dedicated Saleor page (slug: "shop-metrics") instead of shop metadata
 */

import { PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { SaleorWarehouseProcessingMetricsPageService } from "./index";

// Example workflow function
export async function syncWarehouseMetricsToPageWorkflow(
    saleorClient: any, // Your actual Saleor GraphQL client
    installedSaleorAppId: string,
    tenantId: string,
    db: PrismaClient,
    logger: ILogger,
) {
    logger.info(
        "Starting warehouse processing metrics sync to Saleor page workflow",
        {
            tenantId,
            installedSaleorAppId,
        },
    );

    try {
        // Create the service instance
        const metricsService = new SaleorWarehouseProcessingMetricsPageService({
            saleorClient: {
                page: (variables: { slug: string }) =>
                    saleorClient.page(variables),
                pageCreate: (variables: any) =>
                    saleorClient.pageCreate(variables),
                saleorUpdateMetadata: (variables: any) =>
                    saleorClient.saleorUpdateMetadata(variables),
            },
            installedSaleorAppId,
            tenantId,
            db,
            logger,
        });

        // Sync the metrics to Saleor page (includes 7, 14, 30, and 90 day timeframes)
        await metricsService.syncWarehouseMetricsToSaleor();

        logger.info(
            "Successfully completed warehouse metrics sync to page workflow",
        );
    } catch (error) {
        logger.error("Warehouse metrics page sync workflow failed", {
            error: error instanceof Error ? error.message : String(error),
            tenantId,
        });
        throw error;
    }
}

// Example of what the page metadata will look like in Saleor (MUCH cleaner!):
/*
Page "shop-metrics" metadata after sync - only 5 keys with JSON values:
{
  "warehouseProcessing_7d": "{\"totalOrders\":\"177\",\"avgWorkingHours\":\"5.5\",\"p90WorkingHours\":\"8\",\"processingTimeDisplay\":\"8h (0.9 business days)\",\"lastUpdated\":\"2025-10-07T09:35:00.000Z\"}",
  
  "warehouseProcessing_14d": "{\"totalOrders\":\"438\",\"avgWorkingHours\":\"5.5\",\"p90WorkingHours\":\"8\",\"processingTimeDisplay\":\"8h (0.9 business days)\",\"lastUpdated\":\"2025-10-07T09:35:00.000Z\"}",
  
  "warehouseProcessing_30d": "{\"totalOrders\":\"977\",\"avgWorkingHours\":\"5.9\",\"p90WorkingHours\":\"8\",\"processingTimeDisplay\":\"8h (0.9 business days)\",\"lastUpdated\":\"2025-10-07T09:35:00.000Z\"}",
  
  "warehouseProcessing_90d": "{\"totalOrders\":\"2774\",\"avgWorkingHours\":\"6.1\",\"p90WorkingHours\":\"8\",\"processingTimeDisplay\":\"8h (0.9 business days)\",\"lastUpdated\":\"2025-10-07T09:35:00.000Z\"}",
  
  "warehouseProcessing_current": "{\"totalOrders\":\"977\",\"avgWorkingHours\":\"5.9\",\"p90WorkingHours\":\"8\",\"processingTimeDisplay\":\"8h (0.9 business days)\",\"lastUpdated\":\"2025-10-07T09:35:00.000Z\"}"
}

// When parsed, each JSON value contains:
{
  "totalOrders": "977",
  "dataErrors": "0", 
  "outliersExcluded": "10",
  "avgWorkingHours": "5.9",
  "medianWorkingHours": "7",
  "p90WorkingHours": "8",
  "p95WorkingHours": "15",
  "avgBusinessDays": "0.7",
  "medianBusinessDays": "0.8", 
  "p90BusinessDays": "0.9",
  "processingTimeDisplay": "8h (0.9 business days)",
  "lastUpdated": "2025-10-07T09:35:00.000Z"
}
*/

// Example storefront usage:
/*
In your Saleor storefront, you can now access these metrics from the page:

query {
  page(slug: "shop-metrics") {
    metadata {
      key
      value
    }
  }
}

Benefits of using a dedicated page:
1. ✅ Cleaner separation of concerns
2. ✅ Doesn't clutter shop metadata
3. ✅ Easier to manage and query
4. ✅ Can be versioned and tracked
5. ✅ More scalable for additional metrics

// Parse and use the JSON data:
const metrics30d = JSON.parse(page.metadata.find(m => m.key === 'warehouseProcessing_30d').value);
const metrics90d = JSON.parse(page.metadata.find(m => m.key === 'warehouseProcessing_90d').value);

// Display to customers:
<div className="processing-info">
  <h3>Order Processing Time</h3>
  <p>Last 30 days: {metrics30d.processingTimeDisplay}</p>
  <p>Last 90 days: {metrics90d.processingTimeDisplay}</p>
  <small>Last updated: {new Date(metrics30d.lastUpdated).toLocaleDateString()}</small>
</div>

Benefits of JSON structure:
✅ Only 5 metadata keys instead of 60+
✅ Structured data that's easy to parse
✅ All metrics grouped by timeframe
✅ Backward compatible with error handling
✅ Much cleaner Saleor admin interface
*/
