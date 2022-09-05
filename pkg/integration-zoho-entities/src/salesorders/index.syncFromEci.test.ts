/* eslint-disable max-len */
import { AssertionLogger } from "@eci/pkg/logger/src/assertion";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll, afterAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from ".";
import {
  deleteOrders,
  upsertAddressWithZohoAddress,
  upsertContactWithZohoContactPersonsAndZohoContact,
  upsertLineItem1,
  upsertLineItem2,
  upsertOrder,
  upsertProductVariant,
  upsertTaxWithZohoTax,
  upsertZohoItem,
  deleteZohoItem,
  deleteOrder,
} from "../../test/utils";
import { CustomConsole, LogType, LogMessage } from '@jest/console';

function simpleFormatter(type: LogType, message: LogMessage): string {
  const TITLE_INDENT = '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';
  const TYPE = type.toLocaleUpperCase().padEnd(5);
  return message
    .split(/\n/)
    .map((line: string, i) => `${CONSOLE_INDENT}${i === 0 ? TYPE : '  '} ${line}`)
    .join('\n');
}
global.console = new CustomConsole(process.stdout, process.stderr, simpleFormatter);





const ORDERNR_DATE_PREFIX = "SO-DATE-";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory SalesOrders Sync from internal ECI DB", () => {
  const prismaClient = new PrismaClient();
  let zoho: Zoho;
  let zohoSalesOrdersSyncService: ZohoSalesOrdersSyncService;
  let zohoSalesOrdersLogger: AssertionLogger;
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
    zohoSalesOrdersLogger = new AssertionLogger();
    zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      zoho,
      logger: zohoSalesOrdersLogger,
      db: new PrismaClient(),
      zohoApp,
    });
  });
  afterAll(async () => {
    await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
    const zohoIds = (await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)).map((so) => so.salesorder_id);
    console.log("zohoIds for deletion", zohoIds);
    console.log("zoho delete res", await zoho.salesOrder.delete(zohoIds));
  });

  test("Test 1: It should abort sync of orders if product variants of lineitems are not synced with zoho items", async () => {
    console.info("Test 1 started");
    newOrderNumber = `${ORDERNR_DATE_PREFIX}${Math.round((Number(new Date) - 1662000000000) / 1000)}`;
    console.log("newOrderNumber", newOrderNumber);
    await Promise.all([
      upsertTaxWithZohoTax(prismaClient),
      upsertProductVariant(prismaClient),
      deleteZohoItem(prismaClient),
      upsertContactWithZohoContactPersonsAndZohoContact(prismaClient),
    ]);
    await upsertAddressWithZohoAddress(prismaClient);
    await upsertOrder(prismaClient, newOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, newOrderNumber),
      upsertLineItem2(prismaClient, newOrderNumber),
    ]);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("warn", `No zohoItem set for the productVariant of this lineItem. Aborting sync of this order. Try again after zoho items sync.`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully confirmed 0 order(s).`);
    console.info("Test 1 completed");
  }, 90000);

  test("Test 2: It should sync a SalesOrders if all it's entities are also synced", async () => {
    console.info("Test 2 started");
    await upsertZohoItem(prismaClient);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully created zoho salesorder ${newOrderNumber}`);
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Successfully confirmed [1-9]+[0]* order\(s\)./) && (fields?.salesorderNumbersToConfirm as string[])?.includes(newOrderNumber)
    )
    console.info("Test 2 completed");
  }, 90000);

  test("Test 3: It should attach the Zoho SalesOrder if it is created in saleor but has no record in eci db", async () => {
    console.info("Test 3 started");
    await deleteOrder(prismaClient, newOrderNumber);
    await upsertOrder(prismaClient, newOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, newOrderNumber),
      upsertLineItem2(prismaClient, newOrderNumber),
    ]);
    zohoSalesOrdersLogger.clearMessages();
    await zohoSalesOrdersSyncService.syncFromECI();
    zohoSalesOrdersLogger.assertOneLogEntryMatches("info", ({ message, fields }) =>
      !!message.match(/Received [\d]+ orders that are not synced with Zoho/) && (fields?.orderIds as string[])?.includes(newOrderNumber)
    );
    zohoSalesOrdersLogger.assertOneLogMessageMatches("warn", `This sales order number already exists.`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", `Successfully attached zoho salesorder ${newOrderNumber} from search request to the current order`);
    zohoSalesOrdersLogger.assertOneLogMessageMatches("info", /Successfully confirmed [0-9]+ order\(s\)./);
    console.info("Test 3 completed");
  }, 90000);
});
