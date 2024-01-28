import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { ChannelAvailability } from "./channelAvailability";
import { subYears } from "date-fns";

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
                // id: "test",
            },
        });
        if (!tenant)
            throw new Error("Testing Tenant or saleor app not found in DB");

        const { client: saleorClient, installedSaleorApp } =
            // await getSaleorClientAndEntry("QXBwOjE2", prismaClient);
            await getSaleorClientAndEntry("QXBwOjQw", prismaClient);

        const service = new ChannelAvailability(
            prismaClient,
            installedSaleorApp.id,
            new AssertionLogger(),
            saleorClient,
            installedSaleorApp.saleorApp.tenantId,
        );

        // await service.syncToECI();
        const gteData = subYears(new Date(), 2);
        await service.syncChannelAvailability(gteData);
    }, 1000000);
});
