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
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "tn_kencove235",
        // id: "test",
      },
    });
    if (!tenant)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");

    const kencoveApiApp = await prismaClient.kencoveApiApp.findUnique({
      where: {
        id: "kencove_prod",
      },
    });
    if (!kencoveApiApp) throw new Error("Kencove Api App not found in DB");

    const service = new KencoveApiAppProductSyncService({
      kencoveApiApp,
      logger: new AssertionLogger(),
      db: prismaClient,
    });
    await service.syncToECI();
  }, 1000000);
});
