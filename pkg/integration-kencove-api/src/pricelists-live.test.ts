import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { KencoveApiAppPricelistSyncService } from "./pricelists";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Kencove payment Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync payments", async () => {
        const kencoveApiApp = await prismaClient.kencoveApiApp.findUnique({
            where: {
                // id: "kencove_prod",
                id: "ken_app_prod",
            },
        });
        if (!kencoveApiApp) throw new Error("Kencove Api App not found in DB");

        const testingGTE = new Date("2025-09-01");

        const service = new KencoveApiAppPricelistSyncService({
            kencoveApiApp,
            logger: new AssertionLogger(),
            db: prismaClient,
        });
        await service.syncToEci(testingGTE, "12682");
        // await service.syncToEci();
    }, 100000000);
});
