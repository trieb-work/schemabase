import { describe, test } from "@jest/globals";
import { USPSTrackingSyncService } from "./service";
import { PrismaClient } from "@eci/pkg/prisma";
import { AssertionLogger } from "@eci/pkg/logger";

describe("Fedex package sync test", () => {
    // make sure, we have a USPS testing package

    // testing the USPS service app. Use the Fedex account with id "test"
    test("Test client", async () => {
        const db = new PrismaClient();

        //

        const uspsTrackingApp = await db.uspsTrackingApp.findUniqueOrThrow({
            where: {
                id: "usps_test",
            },
        });

        // await db.package.upsert({
        //     where: {
        //         id: "test",
        //     },
        //     create: {
        //         id: "test",
        //         tenantId: "test",
        //         carrier: "FEDEX",
        //         trackingId: "789285796287",
        //         number: "test",
        //     },
        //     update: {},
        // });

        const client = new USPSTrackingSyncService({
            db,
            logger: new AssertionLogger(),
            uspsTrackingApp,
        });
        await client.syncToECI("789285796287");
    });
});
