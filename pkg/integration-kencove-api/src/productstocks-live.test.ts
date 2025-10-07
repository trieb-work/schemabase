import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { KencoveApiAppProductStockSyncService } from "./productstocks";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Kencove product Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync product stocks", async () => {
        const kencoveApiApp = await prismaClient.kencoveApiApp.findUnique({
            where: {
                // id: "kencove_prod",
                id: "ken_app_prod",
            },
        });
        if (!kencoveApiApp) throw new Error("Kencove Api App not found in DB");

        const service = new KencoveApiAppProductStockSyncService({
            kencoveApiApp,
            logger: new AssertionLogger(),
            db: prismaClient,
        });
        await service.syncToEci("6280");
    }, 10000000);
});
