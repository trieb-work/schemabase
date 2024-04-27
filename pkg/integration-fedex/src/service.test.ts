import { describe, test } from "@jest/globals";
import { FedexTrackingSyncService } from "./service";
import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";

describe("Fedex package sync test", () => {
    // make sure, we have a Fedex testing package

    // testing the Fedex service app. Use the Fedex account with id "test"
    test("Test client", async () => {
        const db = new PrismaClient();

        const FedexTrackingApp = await db.fedexTrackingApp.findUniqueOrThrow({
            where: {
                id: "fedex_test",
            },
        });

        await db.package.upsert({
            where: {
                id: "test",
            },
            create: {
                id: "test",
                tenantId: "test",
                carrier: "FEDEX",
                trackingId: "785609834778",
                number: "test",
            },
            update: {},
        });

        const client = new FedexTrackingSyncService({
            db,
            logger: new AssertionLogger(),
            FedexTrackingApp,
        });
        await client.syncToECI();
    });
});
