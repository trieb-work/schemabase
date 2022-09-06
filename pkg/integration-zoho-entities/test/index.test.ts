/* eslint-disable max-len */
import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll, afterAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from "../src/salesorders";
import {
  deleteOrders,
  deleteZohoItem,
  recreateAddress,
  recreateContact,
  recreateTax,
  upsertLineItemWithRealProductVariantFromZoho,
  upsertOrder,
} from "./utils";
import "./consoleFormatter";
import { ZohoItemSyncService } from "../src/items";
import { ZohoContactSyncService } from "../src/contacts";
import { ZohoTaxSyncService } from "../src/taxes";

const ORDERNR_DATE_PREFIX = "SO-DATE-";

beforeEach(() => {
  jest.clearAllMocks();
});

const CLEANUP_ORDERS = false;

describe("Zoho Inventory SalesOrders Sync from internal ECI DB", () => {
  const prismaClient = new PrismaClient();
  let zoho: Zoho;
  let zohoSalesOrdersSyncService: ZohoSalesOrdersSyncService;
  let zohoItemSyncService: ZohoItemSyncService;
  let zohoContactSyncService: ZohoContactSyncService;
  let zohoTaxSyncService: ZohoTaxSyncService;
  let zohoSalesOrdersLogger: AssertionLogger;
  let zohoItemSyncLogger: AssertionLogger;
  let zohoContactSyncLogger: AssertionLogger;
  let zohoTaxSyncLogger: AssertionLogger;
  let newOrderNumber: string;

  beforeAll(async () => {
    const zohoApp = await prismaClient.zohoApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!zohoApp) throw new Error("No testing Zoho App found!");
    zoho = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    const commonParamms = { zoho, db: prismaClient, zohoApp };
    zohoSalesOrdersLogger = new AssertionLogger();
    zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({ logger: zohoSalesOrdersLogger, ...commonParamms });
    zohoItemSyncLogger = new AssertionLogger();
    zohoItemSyncService = new ZohoItemSyncService({ logger: zohoItemSyncLogger, ...commonParamms });
    zohoContactSyncLogger = new AssertionLogger();
    zohoContactSyncService = new ZohoContactSyncService({ logger: zohoContactSyncLogger, ...commonParamms });
    zohoTaxSyncLogger = new AssertionLogger();
    zohoTaxSyncService = new ZohoTaxSyncService({ logger: zohoTaxSyncLogger, ...commonParamms });
  });
  afterAll(async () => {
    if(CLEANUP_ORDERS){
      await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
      const zohoIds = (await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)).map((so) => so.salesorder_id);
      console.log("zohoIds for deletion", zohoIds);
      console.log("zoho delete res", await zoho.salesOrder.delete(zohoIds));
    }
  });

  test("Test 1: It should abort sync of orders if contacts are not synced to zoho yet", async () => {
    console.info("Test 1 started");
    newOrderNumber = `${ORDERNR_DATE_PREFIX}${Math.round((Number(new Date) - 1662000000000) / 1000)}`;
    console.log("newOrderNumber", newOrderNumber);
    await zohoItemSyncService.syncToECI();
    await Promise.all([
      recreateTax(prismaClient),
      recreateContact(prismaClient),
      deleteZohoItem(prismaClient),
    ]);
    await recreateAddress(prismaClient);
    await upsertOrder(prismaClient, newOrderNumber, 156.45);
    await upsertLineItemWithRealProductVariantFromZoho(prismaClient, newOrderNumber);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("warn", `No zohoContactPersons set for the mainContact of this order. Aborting sync of this order. Try again after zoho contacts sync.`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully confirmed 0 order(s).`);
    console.info("Test 1 completed");
  }, 90000);

  
  test("Test 2: It should abort sync of orders if product variants are not synced to zoho yet", async () => {
    console.info("Test 2 started: sync contact + addresses");
    await zohoContactSyncService.syncFromECI();
    zohoContactSyncLogger.assertOneLogMessageMatches("info", /We have [1-9]+[0-9]* contacts that we need to create in Zoho/);
    zohoContactSyncLogger.assertOneLogMessageMatches("info", /We have [1-9]+[0-9]* addresses that need to be synced with Zoho/);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("warn", `No zohoItem set for the productVariant of this lineItem. Aborting sync of this order. Try again after zoho items sync.`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully confirmed 0 order(s).`);
    console.info("Test 2 completed");
  }, 90000);

  test("Test 3: It should abort sync of orders if tax are not synced to zoho yet", async () => {
    console.info("Test 3 started: sync zohoItems");
    await zohoItemSyncService.syncToECI();
    zohoItemSyncLogger.assertOneLogMessageMatches("info", /Upserting [0-9]+ items with the internal DB/);
    zohoItemSyncLogger.assertOneLogMessageMatches("info", /Sync finished for [0-9]+ Zoho Items/);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("warn", `No zohoTaxes set for this tax. Aborting sync of this order. Try again after zoho taxes sync.`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully confirmed 0 order(s).`);
    console.info("Test 3 completed");
  }, 90000);

  test("Test 4: It should succeed if everthing is synced", async () => {
    console.info("Test 4 started: sync zohoTaxes");
    await zohoTaxSyncService.syncToECI();
    zohoTaxSyncLogger.assertOneLogMessageMatches("info", /Synced tax/);
    zohoTaxSyncLogger.assertOneLogMessageMatches("info", /Sync finished for [1-9]+[0]* Zoho Taxes/);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully created zoho salesorder ${newOrderNumber}`);
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Successfully confirmed [1-9]+[0]* order\(s\)./) && (fields?.salesorderNumbersToConfirm as string[])?.includes(newOrderNumber)
    );
    console.info("Test 3 completed");
  }, 90000);
});
