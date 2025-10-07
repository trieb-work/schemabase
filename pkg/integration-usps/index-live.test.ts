import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { USPSTrackingSyncService } from "./index";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Usps package sync", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync packages", async () => {
        const uspsTrackingApp = await prismaClient.uspsTrackingApp.findUnique({
            where: {
                id: "usps_ken_prod",
            },
        });
        if (!uspsTrackingApp) throw new Error("UPS Tracking App not found");

        const service = new USPSTrackingSyncService({
            logger: new AssertionLogger(),
            db: prismaClient,
            uspsTrackingApp,
        });

        await service.syncToECI();
    }, 1000000);
});
