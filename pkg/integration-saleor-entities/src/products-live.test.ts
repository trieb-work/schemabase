import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorProductSyncService } from "./products";
import { VariantAndVariantStocks } from "./products/variantsAndVariantStocks";
// import { VariantAndVariantStocks } from "./products/variantsAndVariantStocks";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Zoho Entity Sync Orders Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync products", async () => {
        const { client: saleorClient, installedSaleorApp } =
            // await getSaleorClientAndEntry("QXBwOjE2", prismaClient);
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);
        // await getSaleorClientAndEntry("QXBwOjQw", prismaClient);

        const service = new SaleorProductSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            logger: new AssertionLogger(),
            db: prismaClient,
            tenantId: installedSaleorApp.saleorApp.tenantId,
        });

        await service.syncToECI();
        // await service.syncFromECI();
        const variantSync = new VariantAndVariantStocks({
            saleorClient,
            installedSaleorAppId: installedSaleorApp.id,
            logger: new AssertionLogger(),
            db: prismaClient,
        });
        await variantSync.syncVariantsAndVariantStocks(
            new Date("2025-09-09T14:30:52.000Z"),
        );
    }, 10000000);
});
