import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorAttributeSyncService } from "./attributes";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Saleor attributes Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync categoreis", async () => {
        const { client: saleorClient, installedSaleorApp } =
            await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorAttributeSyncService({
            saleorClient,
            installedSaleorApp: installedSaleorApp,
            logger: new AssertionLogger(),
            db: prismaClient,
            tenantId: installedSaleorApp.saleorApp.tenantId,
        });
        await service.syncToEci();
        await service.syncFromEci();
    }, 1000000);
});
