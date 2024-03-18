import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorChannelAvailabilitySyncService } from "./channelAvailability";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Zoho Entity Sync Orders Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync products", async () => {
        const tenant = await prismaClient.tenant.findUnique({
            where: {
                // id: "pk_7f165pf-prod",
                id: "tn_kencove235",
                // id: "ken_prod",
                // id: "test",
            },
        });
        if (!tenant)
            throw new Error("Testing Tenant or saleor app not found in DB");

        const { client: saleorClient, installedSaleorApp } =
            // await getSaleorClientAndEntry("QXBwOjE2", prismaClient);
            await getSaleorClientAndEntry("QXBwOjQw", prismaClient);
        // await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

        const service = new SaleorChannelAvailabilitySyncService(
            prismaClient,
            installedSaleorApp.id,
            new AssertionLogger(),
            saleorClient,
            installedSaleorApp.saleorApp.tenantId,
        );

        await service.syncFromEci();
    }, 10000000);
});
