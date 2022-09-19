/* eslint-disable max-len */
import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  beforeEach,
  describe,
  jest,
  test,
  beforeAll,
  afterAll,
} from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from "@eci/pkg/integration-zoho-entities/src/salesorders";
import { deleteOrders } from "@eci/pkg/integration-zoho-entities/test/utils";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ZohoItemSyncService } from "@eci/pkg/integration-zoho-entities/src/items";
import { ZohoContactSyncService } from "@eci/pkg/integration-zoho-entities/src/contacts";
import { ZohoTaxSyncService } from "@eci/pkg/integration-zoho-entities/src/taxes";
import { ZohoInvoiceSyncService } from "@eci/pkg/integration-zoho-entities/src/invoices";
import { ZohoPaymentSyncService } from "@eci/pkg/integration-zoho-entities/src/payments";
import { ZohoBankAccountsSyncService } from "@eci/pkg/integration-zoho-entities/src/bankaccounts";
import { createSaleorClient, SaleorClient } from "@eci/pkg/saleor";
import { SaleorProductSyncService } from "@eci/pkg/integration-saleor-entities";
import { SaleorPaymentGatewaySyncService } from "@eci/pkg/integration-saleor-entities/src/paymentGateways";
import { SaleorWarehouseSyncService } from "@eci/pkg/integration-saleor-entities/src/warehouses";

const ORDERNR_DATE_PREFIX = "SO-DATE-E2E-";

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
  let zohoInvoiceSyncService: ZohoInvoiceSyncService;
  let zohoPaymentSyncService: ZohoPaymentSyncService;
  let zohoBankAccountsSyncService: ZohoBankAccountsSyncService;
  const zohoSalesOrdersLogger = new AssertionLogger()
  const zohoItemSyncLogger = new AssertionLogger()
  const zohoContactSyncLogger = new AssertionLogger()
  const zohoTaxSyncLogger = new AssertionLogger()
  const zohoInvoiceSyncLogger = new AssertionLogger()
  const zohoPaymentSyncLogger = new AssertionLogger()
  const zohoBankAccountsSyncLogger = new AssertionLogger()

  const saleor: SaleorClient = createSaleorClient({
    // graphqlEndpoint: "https://shop-api.pfefferundfrost.de/graphql/",
    graphqlEndpoint: "https://testing--saleor.monorepo-preview.eu.fsn1.trwrk.xyz/graphql/",
    traceId: "test",
    token:
      // manually optian a token if it is outdated by: mutation{tokenCreate(email: "admin@example.com", password: "admin"){token}}
      // eslint-disable-next-line max-len
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJpYXQiOjE2NjM1ODk3MzUsIm93bmVyIjoic2FsZW9yIiwiZXhwIjoxNjYzODQ4OTM1LCJ0b2tlbiI6ImsxWmZlUGc5WjRVVyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6IlZYTmxjam80TVE9PSIsImlzX3N0YWZmIjp0cnVlfQ.gVNKfbd6AT4RclOMVX_P_oxPm1zepzsvzBuYls300oCU48F_Wga2il4mk2b7yb3W_cP951VxbKOG_Az4RzK2rhDrviaSgfqjqVTdD5f7xmelSpSK7ByA-_LVlzgRlJeqpkL9b6yzQsGZgYFcw7fcQxn8DEZkNczuRUPIM5x1rSU",
  });
  let saleorPaymentGatewaySyncService: SaleorPaymentGatewaySyncService;
  let saleorWarehouseSyncService: SaleorWarehouseSyncService;
  let saleorProductSyncService: SaleorProductSyncService;
  const SaleorPaymentGatewaySyncLogger = new AssertionLogger();
  const SaleorWarehouseSyncLogger = new AssertionLogger();
  const SaleorProductSyncLogger = new AssertionLogger();
  // let newOrderNumber: string;

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
    const commonZohoParamms = { zoho, db: prismaClient, zohoApp };
    zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      logger: zohoSalesOrdersLogger,
      ...commonZohoParamms,
    });
    zohoItemSyncService = new ZohoItemSyncService({
      logger: zohoItemSyncLogger,
      ...commonZohoParamms,
    });
    zohoContactSyncService = new ZohoContactSyncService({
      logger: zohoContactSyncLogger,
      ...commonZohoParamms,
    });
    zohoTaxSyncService = new ZohoTaxSyncService({
      logger: zohoTaxSyncLogger,
      ...commonZohoParamms,
    });
    zohoInvoiceSyncService = new ZohoInvoiceSyncService({
      logger: zohoInvoiceSyncLogger,
      ...commonZohoParamms,
    });
    zohoPaymentSyncService = new ZohoPaymentSyncService({
      logger: zohoPaymentSyncLogger,
      ...commonZohoParamms,
    });
    zohoBankAccountsSyncService = new ZohoBankAccountsSyncService({
      logger: zohoBankAccountsSyncLogger,
      ...commonZohoParamms,
    });

    const saleorApp = await prismaClient.saleorApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!saleorApp) throw new Error("No testing Saleor App found!");
    const installedSaleorApp = await prismaClient.installedSaleorApp.findUnique({
      where: {
        id: "test",
      },
    });
    if (!installedSaleorApp) throw new Error("No testing installed Saleor App found!");
    const commonSaleorParamms = {
      db: prismaClient,
      installedSaleorAppId: installedSaleorApp.id,
      saleorClient: saleor,
      tenantId: saleorApp?.tenantId,
    };
    saleorPaymentGatewaySyncService = new SaleorPaymentGatewaySyncService({
      logger: SaleorPaymentGatewaySyncLogger,
      ...commonSaleorParamms,
    });

    saleorWarehouseSyncService = new SaleorWarehouseSyncService({
      logger: SaleorWarehouseSyncLogger,
      ...commonSaleorParamms,
    });

    saleorProductSyncService = new SaleorProductSyncService({
      logger: SaleorProductSyncLogger,
      channelSlug: "storefront",
      ...commonSaleorParamms,
    });

  });
  // afterAll(async () => {
  //   if (CLEANUP_ORDERS) {
  //     // TODO: delete Payments & Invoices in ECI
  //     await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });

  //     const zohoPaymentIds = (await zoho.payment.list({}))
  //       .filter((pay) => pay.reference_number.startsWith(ORDERNR_DATE_PREFIX))
  //       .map((pay) => pay.payment_id);
  //     console.log("zohoPaymentIds for deletion", zohoPaymentIds);
  //     console.log(
  //       "zoho payment delete res",
  //       await zoho.invoice
  //         .delete(zohoPaymentIds)
  //         .catch((err) =>
  //           console.error("Payment Cleanup failed: " + err.message),
  //         ),
  //     );
  //     const zohoInvoiceIds = (await zoho.invoice.list({}))
  //       .filter((so) => so.reference_number.startsWith(ORDERNR_DATE_PREFIX))
  //       .map((inv) => inv.invoice_id);
  //     console.log("zohoInvoiceIds for deletion", zohoInvoiceIds);
  //     console.log(
  //       "zoho invoice delete res",
  //       await zoho.invoice
  //         .delete(zohoInvoiceIds)
  //         .catch((err) =>
  //           console.error("Invoice Cleanup failed: " + err.message),
  //         ),
  //     );
  //     const zohoSalesOrderIds = (
  //       await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)
  //     ).map((so) => so.salesorder_id);
  //     console.log("zohoSalesOrderIds for deletion", zohoSalesOrderIds);
  //     console.log(
  //       "zoho salesOrder delete res",
  //       await zoho.salesOrder
  //         .delete(zohoSalesOrderIds)
  //         .catch((err) =>
  //           console.error("SalesOrder Cleanup failed: " + err.message),
  //         ),
  //     );
  //   }
  // });

  test("Test 1: Preparation", async () => {
    console.info("Test 1 started");
    console.log("sync saleor paymentGateways to ECI (and create saleoPaymentGateway & paymentMethod)")
    await saleorPaymentGatewaySyncService.syncToECI();
    console.log("Sync zoho bank accounts to ECI")
    await zohoBankAccountsSyncService.syncToECI();
    console.log("manually connect Zoho Bank accounts with payment methods")
    // TODO
    console.log("sync saleor warehouses to ECI (and create warehouses)")
    await saleorWarehouseSyncService.syncToECI();
    console.log("sync saleor products to ECI (and create product & productVariants)")
    await saleorProductSyncService.syncToECI();
    console.log("sync zoho items to ECI (and connect them with product variants)")
    await zohoItemSyncService.syncToECI();
    console.log("sync zoho taxes to ECI (and create zohoTax & tax)")
    await zohoTaxSyncService.syncToECI();
    console.info("Test 1 completed");
  }, 90000);
});
