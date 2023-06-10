import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { DatevContactServiceService } from "./contacts";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DATEV customer creation flow", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync contacts", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f165pf-prod",
        // id: "test",
      },
      include: {
        datevApps: true,
      },
    });
    if (!tenant) throw new Error("Testing Tenant not found in DB");
    if (tenant.datevApps.length <= 0)
      throw new Error("No active datev app found");

    const service = new DatevContactServiceService({
      logger: new AssertionLogger(),
      db: prismaClient,
      tenantId: tenant.id,
      datevAppId: tenant.datevApps[0].id,
    });
    await service.eciContactsFlow();
  }, 1000000);
});
