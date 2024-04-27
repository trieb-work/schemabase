import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { FedexTrackingSyncService } from "./index";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Fedex package sync", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync packages", async () => {
        const tenant = await prismaClient.tenant.findUnique({
            where: {
                id: "pk_7f165pf-prod",
                // id: "test",
            },
        });
        if (!tenant) throw new Error("Testing Tenant not found in DB");

        const fedexTrackingApp = await prismaClient.fedexTrackingApp.findUnique(
            {
                where: {
                    id: "fedex_test",
                },
            },
        );
        if (!fedexTrackingApp) throw new Error("UPS Tracking App not found");

        const service = new FedexTrackingSyncService({
            logger: new AssertionLogger(),
            db: prismaClient,
            FedexTrackingApp: fedexTrackingApp,
        });

        await service.syncToECI();
    }, 1000000);
});
