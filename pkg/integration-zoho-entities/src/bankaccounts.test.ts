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

  // const zohoClient = undefined as unknown as ZohoApiClient;
  // const mockedZohoClient = {
  //   invoice: {
  //     list: async () =>
  //       await Promise.resolve([
  //         {
  //           invoice_id: "98644000014278113",
  // ...
  //           exchange_rate: 0.0,
  //         },
  //       ]),
  //   },
  //   util: new Zoho(zohoClient).util,
  // } as unknown as Zoho;
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

  // afterAll(async () => {
  //   await deleteInvoices(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
  //   await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
  //   const zohoIds = (await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)).map(
  //     (so) => so.salesorder_id,
  //   );
  //   console.log("zohoIds for deletion", zohoIds);
  //   console.log("invoicesToDeleteAfterTest", invoicesToDeleteAfterTest);
  //   console.log(
  //     "invoice delete res",
  //     await zoho.invoice.delete(invoicesToDeleteAfterTest),
  //   );
  //   console.log("zoho delete res", await zoho.salesOrder.delete(zohoIds));
  // });

  // test("It should work to sync Zoho invoices to internal ECI DB", async () => {
  //   const xx = new ZohoInvoiceSyncService({
  //     zoho: mockedZohoClient,
  //     logger: new NoopLogger(),
  //     db: new PrismaClient(),
  //     zohoApp,
  //   });
  //   await xx.syncToECI();
  // }, 90000);

  test("It should work to sync Zoho bank accounts to internal ECI DB", async () => {
    await zohoBankAccountsSyncService.syncToECI();
  }, 90000);
});
