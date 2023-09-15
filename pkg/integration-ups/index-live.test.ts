import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { UPSTrackingSyncService } from "./index";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("UPS package sync", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync packages", async () => {
        const tenant = await prismaClient.tenant.findUnique({
            where: {
                id: "pk_7f165pf-prod",
                // id: "test",
            },
        });
        if (!tenant)
            throw new Error(
                "Testing Tenant or zoho app/integration not found in DB",
            );

        const upsTrackingApp = await prismaClient.uPSTrackingApp.findUnique({
            where: {
                id: "ups_tr_vqw435068q0uj1q34ojt",
            },
        });
        if (!upsTrackingApp) throw new Error("UPS Tracking App not found");

        const service = new UPSTrackingSyncService({
            logger: new AssertionLogger(),
            db: prismaClient,
            upsTrackingApp,
        });

        await service.syncToECI();
    }, 1000000);
});
