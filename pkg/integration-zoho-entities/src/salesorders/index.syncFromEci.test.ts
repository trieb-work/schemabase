/* eslint-disable max-len */
import { NoopLogger } from "@eci/pkg/logger";
import { AssertionLogger } from "@eci/pkg/logger/src/assertion";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from ".";
import {
  deleteOrder,
  mockedConsole,
  upsertAddressWithZohoAddress,
  upsertContactWithZohoContactPersonsAndZohoContact,
  upsertLineItem1,
  upsertLineItem2,
  upsertOrder,
  upsertProductVariant,
  upsertTaxWithZohoTax,
  upsertZohoItem
} from "../../test/utils";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory SalesOrders Sync from internal ECI DB", () => {
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

  test("It should sync a SalesOrders correctly", async () => {
    /**
     * This test is running against the Test Instance of Zoho
     */
    const { restoreConsole, clearMessages, assertOneLogMessageMatches, orignalConsole } = mockedConsole();
    const realTestingZohoClient = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    const zohoSalesOrdersLogger = new AssertionLogger();
    const zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      zoho: realTestingZohoClient,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });

    // INFO: Multiple tests listed in single test since we have to run them sequentlially!
    orignalConsole.log('First test: "It should abort sync of orders if product variants of lineitems are not synced with zoho items"');
    const newOrderNumber = `SO-DATE-${Math.round((Number(new Date) - 1662000000000)/1000)}`;
    orignalConsole.log("newOrderNumber", newOrderNumber);
    await Promise.all([
      upsertTaxWithZohoTax(prismaClient),
      upsertProductVariant(prismaClient),
      upsertContactWithZohoContactPersonsAndZohoContact(prismaClient),
    ]);
    await upsertAddressWithZohoAddress(prismaClient);
    await upsertOrder(prismaClient, newOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, newOrderNumber),
      upsertLineItem2(prismaClient, newOrderNumber),
    ]);

    clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    assertOneLogMessageMatches("log", new RegExp(`Received [\\d]+ orders that are not synced with Zoho: [\\d\\D]*${newOrderNumber}`));
    assertOneLogMessageMatches("log", `No zohoItem set for the productVariant of this lineItem. Aborting sync of this order. Try again after zoho items sync.`);
    assertOneLogMessageMatches("log", `Successfully confirmed 0 orders:`);



    orignalConsole.log('Second test: "It should sync a SalesOrders if not synced already"');
    await upsertZohoItem(prismaClient);
    clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    assertOneLogMessageMatches("log", new RegExp(`Received [\\d]+ orders that are not synced with Zoho: [\\d\\D]*${newOrderNumber}`));
    assertOneLogMessageMatches("log", `No zohoItem set for the productVariant of this lineItem. Aborting sync of this order. Try again after zoho items sync.`);
    assertOneLogMessageMatches("log", /Successfully confirmed [1-9]+ orders:/);


    orignalConsole.log('Third test: "It should attach the Zoho SalesOrder if it is created in saleor but has no record in eci db"');
    // NOTE: If this test fails make sure that the order TEST-1234 does exist in zoho
    const existingOrderNumber = "TEST-1234";
    orignalConsole.log("existingOrderNumber", existingOrderNumber);
    await deleteOrder(prismaClient, existingOrderNumber);
    await upsertOrder(prismaClient, existingOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, existingOrderNumber),
      upsertLineItem2(prismaClient, existingOrderNumber),
    ]);

    clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    // assertOneLogMessageMatches("log", `Successfully confirmed 0 orders:`);

    restoreConsole();
  }, 90000);
});
