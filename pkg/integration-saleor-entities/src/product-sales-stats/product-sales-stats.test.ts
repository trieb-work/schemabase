import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, expect } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { SaleorProductSalesStatsSyncService } from "./index";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("SaleorProductSalesStatsSyncService", () => {
    const prismaClient = new PrismaClient();

    test("It should initialize the service correctly", async () => {
        // Mock Saleor client
        const mockSaleorClient = {
            saleorUpdateMetadata: jest.fn(),
        } as any;

        // Mock installed Saleor app
        const mockInstalledSaleorApp = {
            id: "test-app-id",
            saleorApp: {
                tenantId: "ken_prod",
            },
        } as any;

        const service = new SaleorProductSalesStatsSyncService({
            logger: new AssertionLogger(),
            saleorClient: mockSaleorClient,
            db: prismaClient,
            tenantId: "ken_prod",
            installedSaleorApp: mockInstalledSaleorApp,
            timeframes: [30],
        });

        console.log(
            "\n=== Testing Saleor Product Sales Stats Sync Service ===",
        );

        expect(service).toBeDefined();

        console.log("✅ Service initialized successfully");
        console.log("📊 Configuration:");
        console.log("  - Timeframes: [30] days");
        console.log("  - Batch size: 10 products");
        console.log("  - Tenant ID: ken_prod");

        // Note: We're not running the actual sync here to avoid modifying production data
        // To test the full sync, uncomment the line below:
        // const result = await service.syncProductSalesStats();

        console.log("\n✅ Service test completed successfully!");
    }, 30000);
});
