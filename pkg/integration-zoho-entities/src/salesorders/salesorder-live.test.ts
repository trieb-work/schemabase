import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ZohoSalesOrdersSyncService } from ".";
import { getZohoClientAndEntry } from "@eci/pkg/zoho";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync orders to Xentral via Zoho", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f16573fece94114847dc81d3214eef4",
        // id: "test",
      },
    });
    if (!tenant)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      "pk_7c010ef855ed4b47881ae079efbb4999",
      prismaClient,
      undefined,
    );

    const service = new ZohoSalesOrdersSyncService({
      zoho,
      zohoApp,
      logger: new AssertionLogger(),
      db: prismaClient,
      createdTimeOffset: 1,
    });
    await service.syncFromECI();
  }, 1000000);
});
