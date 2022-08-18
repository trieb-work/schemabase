import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { XentralProxyProductVariantSyncService } from "./productVariant";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("XentralProxy Entity Sync Orders Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync orders to Xentral via XentralProxy", async () => {
    const xentralProxyApp = await prismaClient.xentralProxyApp.findUnique(
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
    const xentralProxyIntegration =
      await prismaClient.xentralProxyIntegration.findUnique({
        where: {
          id: "test",
        },
      });
    if (!xentralProxyApp || !tenant || !xentralProxyIntegration)
      throw new Error("Testing Tenant or xentral app/integration not found in DB");
    const service = new XentralProxyProductVariantSyncService({
      logger: new NoopLogger(),
      db: prismaClient,
      xentralProxyApp,
      warehouseId: xentralProxyIntegration.warehouseId,
    });
    await service.syncFromECI();
  }, 1000000);
});
