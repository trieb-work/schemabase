import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorOrderSyncService } from ".";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Saleor Sync Orders Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync packages", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);
        // await getSaleorClientAndEntry("QXBwOjQw", prismaClient);

        const service = new SaleorOrderSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            logger: new AssertionLogger(),
            db: prismaClient,
            tenantId: installedSaleorApp.saleorApp.tenantId,
            orderPrefix: installedSaleorApp.orderPrefix,
            channelSlug: "storefront",
        });
        await service.syncToECI();
        await service.syncFromECI();
    }, 100000000);
});

// jannik user accouint: c_6gXrw8cnQnzS8YbUPPVrvk
// example order: o_GCQsAJvPV5WQmETHo3Bs71
// S0000063553
