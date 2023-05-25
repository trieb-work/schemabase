import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { getZohoClientAndEntry } from "@eci/pkg/zoho";
import { ZohoItemSyncService } from ".";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Items Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync orders from Zoho", async () => {
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "pk_7f165pf-prod",
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

    const service = new ZohoItemSyncService({
      zoho,
      zohoApp,
      logger: new AssertionLogger(),
      db: prismaClient,
    });
    await service.syncToECI();
  }, 10000000);
});
