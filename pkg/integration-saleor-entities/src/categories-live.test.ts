import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorCategorySyncService } from "./categories";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Categories Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync categoreis", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "tn_kencove235",
        // id: "test",
      },
    });
    if (!tenant)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");

    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry("QXBwOjE=", prismaClient);

    const service = new SaleorCategorySyncService({
      saleorClient,
      installedSaleorApp: installedSaleorApp,
      logger: new AssertionLogger(),
      db: prismaClient,
      tenantId: tenant.id,
    });
    await service.syncToEci();
    await service.syncFromEci();
  }, 1000000);
});
