import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoPaymentSyncService } from "./payments";
import "@eci/pkg/jest-utils/consoleFormatter";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory payment Sync", () => {
  const prismaClient = new PrismaClient();

  let zoho: Zoho;
  let zohoApp: ZohoApp;
  let zohoPaymentSyncService: ZohoPaymentSyncService;
  let zohoPaymentLogger: AssertionLogger;

  beforeAll(async () => {
    zohoApp = (await prismaClient.zohoApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    }))!;
    if (!zohoApp) throw new Error("No testing Zoho App found!");
    if (!zohoApp.tenantId)
      throw new Error("No tenant configured for Zoho App!");
    zoho = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    zohoPaymentLogger = new AssertionLogger();
    zohoPaymentSyncService = new ZohoPaymentSyncService({
      zoho,
      logger: zohoPaymentLogger,
      db: new PrismaClient(),
      zohoApp,
    });
  });

  test("It should work to sync Zoho Payments with internal ECI DB", async () => {
    await zohoPaymentSyncService.syncFromECI();
  }, 90000);
});
