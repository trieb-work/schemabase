import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ZohoBankAccountsSyncService } from "./bankaccounts";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory Invoice Sync", () => {
  const prismaClient = new PrismaClient();
  let zoho: Zoho;
  let zohoApp: ZohoApp;
  let zohoBankAccountsSyncService: ZohoBankAccountsSyncService;
  let zohoBankAccountsLogger: AssertionLogger;

  beforeAll(async () => {
    zohoApp = (await prismaClient.zohoApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    })) as ZohoApp;
    if (!zohoApp) throw new Error("No testing Zoho App found!");
    if (!zohoApp.tenantId)
      throw new Error("No tenant configured for Zoho App!");
    zoho = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    zohoBankAccountsLogger = new AssertionLogger();
    zohoBankAccountsSyncService = new ZohoBankAccountsSyncService({
      zoho,
      logger: zohoBankAccountsLogger,
      db: new PrismaClient(),
      zohoApp,
    });
  });

  test("It should work to sync Zoho bank accounts to internal ECI DB", async () => {
    await zohoBankAccountsSyncService.syncToECI();
  }, 90000);
});
