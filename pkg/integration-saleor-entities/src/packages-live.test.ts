import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorPackageSyncService } from "./packages";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync packages", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f165pf-prod",
        // id: "test",
      },
    });
    if (!tenant)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");

    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry("QXBwOjE2", prismaClient);

    const service = new SaleorPackageSyncService({
      saleorClient,
      installedSaleorApp: installedSaleorApp,
      logger: new AssertionLogger(),
      db: prismaClient,
      tenantId: tenant.id,
      orderPrefix: "STORE",
    });
    await service.syncToECI();
    await service.syncFromECI();
  }, 1000000);
});
