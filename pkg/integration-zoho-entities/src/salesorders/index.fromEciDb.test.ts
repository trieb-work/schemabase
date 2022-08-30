/* eslint-disable max-len */
import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from ".";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory SalesOrders Sync", () => {
  const prismaClient = new PrismaClient();

  beforeAll(async () => {
    zohoApp = await prismaClient.zohoApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!zohoApp) throw new Error("No testing Zoho App found!");
  });

  test("It should work to sync Zoho Sales Order from internal ECI DB", async () => {
    /**
     * This test is running against the Test Instance of Zoho
     */
    const realTestingZohoClient = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    const xx = new ZohoSalesOrdersSyncService({
      zoho: realTestingZohoClient,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });
    await xx.syncFromECI();
  }, 90000);

  // TODO first test: it should fail if zoho item is not synced
  // 1.) delete all orders in eci db
  // 2.) create an order with product variant
  // 3.) call syncFromEci

  // TODO second test: it should succeed after zoho item is synced
  // 1.) update eci db directly with test zohoItem. Get test data from zoho directly
  // 2.) call syncFromEci

  // TODO third tests --> same procedure as for zoho item for other zoho entities: zohoContact, zohoAddress,

  // TODO forth test --> test if salesorder was deleted in ECI db and is created again
});
