// test the categories integration. Use the tenant and KencoveApiApp "test".
//

import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiAppOrderSyncService } from "./index";
import { AssertionLogger } from "@eci/pkg/logger";
import { describe, beforeAll, it } from "@jest/globals";

const prisma = new PrismaClient();

describe("KencoveApiClient", () => {
    let app: KencoveApiApp;

    beforeAll(async () => {
        app = await prisma.kencoveApiApp.findUniqueOrThrow({
            where: {
                id: "kencove_prod",
            },
        });
    });

    it("should be able to run the categories sync", async () => {
        const service = new KencoveApiAppOrderSyncService({
            db: prisma,
            kencoveApiApp: app,
            logger: new AssertionLogger(),
        });
        // await service.syncToECI();
        await service.syncFromECI();
    }, 2000000);
});
