import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { KencoveApiAppProductSyncService } from "./products";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Kencove product Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync products", async () => {
        const kencoveApiApp = await prismaClient.kencoveApiApp.findUnique({
            where: {
                id: "kencove_prod",
                // id: "ken_app_prod",
            },
        });
        if (!kencoveApiApp) throw new Error("Kencove Api App not found in DB");

        const service = new KencoveApiAppProductSyncService({
            kencoveApiApp,
            logger: new AssertionLogger(),
            db: prismaClient,
        });
        await service.syncToECI("1190");
    }, 10000000);
});
