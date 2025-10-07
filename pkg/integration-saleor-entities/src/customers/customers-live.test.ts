import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorCustomerSyncService } from "./";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Saleor Sync Customer Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync customer", async () => {
        const { client: saleorClient, installedSaleorApp } =
            // await getSaleorClientAndEntry("QXBwOjQw", prismaClient);
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorCustomerSyncService({
            saleorClient,
            installedSaleorAppId: installedSaleorApp.id,
            logger: new AssertionLogger(),
            db: prismaClient,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            channelSlug: "storefront",
        });
        await service.syncToECI();
        await service.syncFromECI();
    }, 1000000);
});
