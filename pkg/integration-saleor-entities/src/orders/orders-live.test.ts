import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";
import { SaleorOrderSyncService } from ".";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync packages", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f165pf-prod",
        // id: "test",
      },
    });
    if (!tenant) throw new Error("Testing Tenant not found in DB");

    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry("QXBwOjE2", prismaClient);

    const service = new SaleorOrderSyncService({
      saleorClient,
      installedSaleorAppId: installedSaleorApp.id,
      logger: new AssertionLogger(),
      db: prismaClient,
      tenantId: tenant.id,
      orderPrefix: "STORE",
      channelSlug: "storefront",
    });
    await service.syncToECI();
    // await service.syncFromECI();
  }, 1000000);
});
