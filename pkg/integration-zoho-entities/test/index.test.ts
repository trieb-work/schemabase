/* eslint-disable max-len */
import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from "../src/salesorders";
import {
  deleteZohoSalesOrder,
  upsertAddress,
  upsertContact,
  upsertLineItem1,
  upsertLineItem2,
  upsertOrder,
  upsertProductVariant,
  upsertTax,
  upsertZohoItem
} from "./utils";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory SalesOrders Sync from internal ECI DB", () => {
  const prismaClient = new PrismaClient();

  test("It should sync a SalesOrders correctly", async () => {
    /**
     * This test is running against the Test Instance of Zoho
     */
    const zoho = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    const zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      zoho,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });

    // INFO: All tests listed here since we have to run them sequentlially!
    console.log('First test: "It should abort sync of orders if product variants of lineitems are not synced with zoho items"');
    const newOrderNumber = `SO-DATE-${Math.round((Number(new Date) - 1662000000000) / 1000)}`;
    console.log("newOrderNumber", newOrderNumber);
    await Promise.all([
      upsertTax(prismaClient),
      upsertProductVariant(prismaClient),
      upsertContact(prismaClient),
    ]);
    await upsertAddress(prismaClient);
    await upsertOrder(prismaClient, newOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, newOrderNumber),
      upsertLineItem2(prismaClient, newOrderNumber),
    ]);
    await zohoSalesOrdersSyncService.syncFromECI();

    await upsertZohoItem(prismaClient);
    console.log('Second test: "It should sync a SalesOrders if not synced already"');
    await zohoSalesOrdersSyncService.syncFromECI();

    console.log('Third test: "It should attach the Zoho SalesOrder if it is created in saleor but has no record in eci db"');
    // NOTE: If this test fails make sure that the order TEST-1234 does exist in zoho
    const existingOrderNumber = "TEST-1234";
    console.log("existingOrderNumber", existingOrderNumber);
    await deleteZohoSalesOrder(prismaClient, existingOrderNumber);
    await upsertOrder(prismaClient, existingOrderNumber);
    await Promise.all([
      upsertLineItem1(prismaClient, existingOrderNumber),
      upsertLineItem2(prismaClient, existingOrderNumber),
    ]);
    await zohoSalesOrdersSyncService.syncFromECI();
  }, 90000);
});
