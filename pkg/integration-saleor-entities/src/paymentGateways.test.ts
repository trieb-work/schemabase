import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { SaleorPaymentGatewaySyncService } from "./paymentGateways";
import "@eci/pkg/jest-utils/consoleFormatter";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Saleor Entity Sync payments Test", () => {
  const prismaClient = new PrismaClient();
  const mockedSaleorClient = {
    paymentGateways: async () =>
      await Promise.resolve({
        shop: {
          availablePaymentGateways: [
            {
              id: "app:17:triebwork.payments.rechnung",
              name: "Vorkasse",
              currencies: ["EUR"],
            },
            {
              id: "mirumee.payments.braintree",
              name: "Braintree",
              currencies: ["EUR"],
            },
          ],
        },
      }),
  } as unknown as SaleorClient;

  test("It should work to sync mocked payments to internal ECI db", async () => {
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
    const xx = new SaleorPaymentGatewaySyncService({
      saleorClient: mockedSaleorClient,
      logger: new NoopLogger(),
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      tenantId: tenant.id,
    });
    await xx.syncToECI();
  }, 80000);
});
