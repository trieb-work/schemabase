import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { SaleorPaymentSyncService } from "./payments";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync payments", async () => {
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

    const service = new SaleorPaymentSyncService({
      saleorClient,
      installedSaleorAppId: installedSaleorApp.id,
      logger: new AssertionLogger(),
      db: prismaClient,
      tenantId: tenant.id,
      orderPrefix: "STORE",
    });
    // await service.syncToECI();
    await service.syncFromECI();
  }, 1000000);
});
