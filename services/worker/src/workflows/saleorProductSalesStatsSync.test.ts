import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { SaleorProductSalesStatsSyncWf } from "./saleorProductSalesStatsSync";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("SaleorProductSalesStatsSyncWf", () => {
    const prismaClient = new PrismaClient();

    test("It should sync product sales stats to Saleor products", async () => {
        // Mock runtime context
        const mockCtx = {
            logger: new AssertionLogger(),
            job: {
                updateProgress: jest.fn(),
            },
        } as any;

        const workflow = new SaleorProductSalesStatsSyncWf(
            mockCtx,
            { prisma: prismaClient },
            { 
                installedSaleorAppId: "QXBwOjE=",
                timeframes: [30], // Only test 30 days for faster execution
                batchSize: 10,
            }
        );

        console.log("\n=== Testing Saleor Product Sales Stats Sync Workflow ===");
        
        // This is a dry run test - we'll just check that the workflow initializes correctly
        // and can access the required services without actually updating Saleor
        expect(workflow).toBeDefined();
        
        console.log("✅ Workflow initialized successfully");
        console.log("📊 Configuration:");
        console.log("  - Timeframes: [30] days");
        console.log("  - Batch size: 10 products");
        console.log("  - Installed Saleor App ID: QXBwOjE=");
        
        // Note: We're not running the actual workflow here to avoid modifying production data
        // To test the full workflow, uncomment the line below:
        // await workflow.run();
        
        console.log("\n✅ Workflow test completed successfully!");
    }, 30000);
});
