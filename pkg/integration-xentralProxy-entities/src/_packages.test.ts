import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorPackageSyncService } from "./packages";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync Packages Test", () => {
  const prismaClient = new PrismaClient();
  const mockedSaleorClient = {
    saleorCronPackages: async () => await Promise.resolve({}),
  } as unknown as SaleorClient;

  test("It should work to sync mocked Packages to internal ECI db", async () => {
    const installedSaleorApp = await prismaClient.installedSaleorApp.findUnique(
      {
        where: {
          id: "test",
        },
      },
    );
    const tenant = await prismaClient.tenant.findUnique({
      where: {
        id: "test",
      },
    });
    if (!installedSaleorApp || !tenant)
      throw new Error("Testing Tenant or saleor app not found in DB");
    const xx = new SaleorPackageSyncService({
      saleorClient: mockedSaleorClient,
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      tenantId: tenant.id,
      orderPrefix: "STORE",
    });
    await xx.syncFromECI();
  }, 80000);
});
