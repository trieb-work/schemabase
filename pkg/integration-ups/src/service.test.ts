import { describe, test } from "@jest/globals";
import { UPSTrackingSyncService } from "./service";
import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";

describe("UPS package sync test", () => {
    // make sure, we have a UPS testing package

    // testing the ups service app. Use the UPS account with id "test"
    test("Test client", async () => {
        const db = new PrismaClient();

        const upsTrackingApp = await db.uPSTrackingApp.findUniqueOrThrow({
            where: {
                id: "test",
            },
        });

        await db.package.upsert({
            where: {
                id: "test",
            },
            create: {
                id: "test",
                tenantId: "test",
                carrier: "UPS",
                trackingId: "1Z2632010391767531",
                number: "test",
            },
            update: {},
        });

        const client = new UPSTrackingSyncService({
            db,
            logger: new AssertionLogger(),
            upsTrackingApp,
        });
        await client.syncToECI();
    });
});
