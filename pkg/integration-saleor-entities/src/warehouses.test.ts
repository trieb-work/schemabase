import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorWarehouseSyncService } from "./warehouses";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync Warehouses Test", () => {
  const prismaClient = new PrismaClient();
  const mockedSaleorClient = {
    warehouses: async () =>
      await Promise.resolve({
        warehouses: {
          edges: [
            {
              node: {
                id: "V2FyZWhvdXNlOjQ2NDgyZWI2LTk1OGYtNGI4Ny1hYmFhLWM1NjJjMTY4MTAwOA==",
                name: "GIGATEC GmbH",
              },
            },
          ],
        },
      }),
  } as unknown as SaleorClient;

  test("It should work to sync mocked warehouses to internal ECI db", async () => {
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
    const xx = new SaleorWarehouseSyncService({
      saleorClient: mockedSaleorClient,
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      tenantId: tenant.id,
    });
    await xx.syncToECI();
  });
});
