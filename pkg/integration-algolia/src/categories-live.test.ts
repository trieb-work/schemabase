import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { AlgoliaCategorySyncService } from "./categories";

/// Use this file to locally run this service

beforeEach(() => {
    jest.clearAllMocks();
});

describe("algolia cagtegory Test", () => {
    const prismaClient = new PrismaClient();

    test("It should work to sync packages", async () => {
        const tenant = await prismaClient.tenant.findUnique({
            where: {
                // id: "pk_7f165pf-prod",
                id: "tn_kencove235",
                // id: "test",
            },
            include: {
                algoliaApps: {
                    where: {
                        id: "alg-staging",
                    },
                },
            },
        });
        if (!tenant) throw new Error("Testing Tenant not found in DB");

        const algoliaApp = tenant.algoliaApps[0];
        const service = new AlgoliaCategorySyncService({
            logger: new AssertionLogger(),
            db: prismaClient,
            algoliaApp,
        });
        await service.syncFromECI();
    }, 1000000);
});

// jannik user accouint: c_6gXrw8cnQnzS8YbUPPVrvk
// example order: o_GCQsAJvPV5WQmETHo3Bs71
// S0000063553
