/* eslint-disable max-len */
import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
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
import {
  connectZohoBankToBraintreeCardPm,
  connectZohoBankToBraintreePaypalPm,
  deleteOrders,
} from "@eci/pkg/integration-zoho-entities/test/utils";
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
import { ZohoWarehouseSyncService } from "@eci/pkg/integration-zoho-entities/src/warehouses";
import { SaleorOrderSyncService } from "@eci/pkg/integration-saleor-entities/src/orders";
import { SaleorPaymentSyncService } from "@eci/pkg/integration-saleor-entities/src/payments";
import { BraintreeTransactionSyncService } from "@eci/pkg/integration-braintree-entities/src/transactions";
import { krypto } from "@eci/pkg/krypto";
import { BraintreeClient } from "@eci/pkg/braintree";
import { sleep } from "@eci/pkg/miscHelper/time";
import { XentralProxyProductVariantSyncService } from "@eci/pkg/integration-xentralProxy-entities/src/artikel";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";
import {
  XentralProxyLieferscheinSyncService,
  XentralProxyOrderSyncService,
} from "@eci/pkg/integration-xentralProxy-entities";

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
  let zohoWarehouseSyncService: ZohoWarehouseSyncService;
  const zohoSalesOrdersLogger = new AssertionLogger();
  const zohoItemSyncLogger = new AssertionLogger();
  const zohoContactSyncLogger = new AssertionLogger();
  const zohoTaxSyncLogger = new AssertionLogger();
  const zohoInvoiceSyncLogger = new AssertionLogger();
  const zohoPaymentSyncLogger = new AssertionLogger();
  const zohoBankAccountsSyncLogger = new AssertionLogger();
  const zohoWarehouseSyncLogger = new AssertionLogger();

  const saleor: SaleorClient = createSaleorClient({
    // graphqlEndpoint: "https://shop-api.pfefferundfrost.de/graphql/",
    graphqlEndpoint:
      "https://testing--saleor.monorepo-preview.eu.fsn1.trwrk.xyz/graphql/",
    traceId: "test",
    token:
      // manually optian a token if it is outdated by: mutation{tokenCreate(email: "admin@example.com", password: "admin"){token}}
      // eslint-disable-next-line max-len
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJpYXQiOjE2NjM1ODk3MzUsIm93bmVyIjoic2FsZW9yIiwiZXhwIjoxNjYzODQ4OTM1LCJ0b2tlbiI6ImsxWmZlUGc5WjRVVyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJ0eXBlIjoiYWNjZXNzIiwidXNlcl9pZCI6IlZYTmxjam80TVE9PSIsImlzX3N0YWZmIjp0cnVlfQ.gVNKfbd6AT4RclOMVX_P_oxPm1zepzsvzBuYls300oCU48F_Wga2il4mk2b7yb3W_cP951VxbKOG_Az4RzK2rhDrviaSgfqjqVTdD5f7xmelSpSK7ByA-_LVlzgRlJeqpkL9b6yzQsGZgYFcw7fcQxn8DEZkNczuRUPIM5x1rSU",
  });
  let saleorPaymentGatewaySyncService: SaleorPaymentGatewaySyncService;
  let saleorWarehouseSyncService: SaleorWarehouseSyncService;
  let saleorProductSyncService: SaleorProductSyncService;
  let saleorPaymentSyncService: SaleorPaymentSyncService;
  let saleorOrderSyncService: SaleorOrderSyncService;
  const SaleorPaymentGatewaySyncLogger = new AssertionLogger();
  const SaleorWarehouseSyncLogger = new AssertionLogger();
  const SaleorProductSyncLogger = new AssertionLogger();
  const SaleorPaymentSyncLogger = new AssertionLogger();
  const SaleorOrderSyncLogger = new AssertionLogger();

  let braintreeTransactionSyncService: BraintreeTransactionSyncService;
  const braintreeTransactionSyncLogger = new AssertionLogger();

  let xentralProxyApp: XentralProxyApp;
  const xentralProxyProductVariantLogger = new AssertionLogger();
  const xentralProxyOrderLogger = new AssertionLogger();
  const xentralProxyLieferscheinLogger = new AssertionLogger();

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
    console.debug("zohoApp", zohoApp);
    const commonZohoParamms = { zoho, db: prismaClient, zohoApp };
    zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      logger: zohoSalesOrdersLogger,
      createdTimeOffset: 0, // 5
      ...commonZohoParamms,
    });
    zohoInvoiceSyncService = new ZohoInvoiceSyncService({
      logger: zohoInvoiceSyncLogger,
      createdTimeOffset: 0, // 10
      ...commonZohoParamms,
    });
    zohoPaymentSyncService = new ZohoPaymentSyncService({
      logger: zohoPaymentSyncLogger,
      createdTimeOffset: 0, // 15
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
    zohoBankAccountsSyncService = new ZohoBankAccountsSyncService({
      logger: zohoBankAccountsSyncLogger,
      ...commonZohoParamms,
    });
    zohoWarehouseSyncService = new ZohoWarehouseSyncService({
      logger: zohoWarehouseSyncLogger,
      ...commonZohoParamms,
    });

    const saleorApp = await prismaClient.saleorApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!saleorApp) throw new Error("No testing Saleor App found!");
    const installedSaleorApp = await prismaClient.installedSaleorApp.findUnique(
      {
        where: {
          id: "test",
        },
      },
    );
    if (!installedSaleorApp)
      throw new Error("No testing installed Saleor App found!");
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

    saleorPaymentSyncService = new SaleorPaymentSyncService({
      logger: SaleorPaymentSyncLogger,
      orderPrefix: "SO",
      ...commonSaleorParamms,
    });

    saleorOrderSyncService = new SaleorOrderSyncService({
      logger: SaleorOrderSyncLogger,
      channelSlug: "storefront",
      orderPrefix: "SO",
      ...commonSaleorParamms,
    });

    const braintreeApp = await prismaClient.braintreeApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!braintreeApp) throw new Error("No testing Braintree App found!");
    const merchantId = await krypto.decrypt(braintreeApp.merchantId);
    const privateKey = await krypto.decrypt(braintreeApp.privateKey);
    const publicKey = await krypto.decrypt(braintreeApp.publicKey);
    const braintreeClient = new BraintreeClient({
      merchantId,
      privateKey,
      publicKey,
      sandbox: true,
    });
    braintreeTransactionSyncService = new BraintreeTransactionSyncService({
      db: prismaClient,
      logger: braintreeTransactionSyncLogger,
      braintreeAppId: braintreeApp.id,
      tenantId: braintreeApp.tenantId,
      braintreeClient,
    });

    xentralProxyApp = (await prismaClient.xentralProxyApp.findUnique({
      where: {
        id: "test",
      },
    })) as XentralProxyApp;
    if (!xentralProxyApp) {
      throw new Error("Xentral app not found in DB");
    }
  });
  afterAll(async () => {
    if (CLEANUP_ORDERS) {
      // TODO: delete Payments & Invoices in ECI
      await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });

      const zohoPaymentIds = (await zoho.payment.list({}))
        .filter((pay) => pay.reference_number.startsWith(ORDERNR_DATE_PREFIX))
        .map((pay) => pay.payment_id);
      console.log("zohoPaymentIds for deletion", zohoPaymentIds);
      console.log(
        "zoho payment delete res",
        await zoho.invoice
          .delete(zohoPaymentIds)
          .catch((err) =>
            console.error("Payment Cleanup failed: " + err.message),
          ),
      );
      const zohoInvoiceIds = (await zoho.invoice.list({}))
        .filter((so) => so.reference_number.startsWith(ORDERNR_DATE_PREFIX))
        .map((inv) => inv.invoice_id);
      console.log("zohoInvoiceIds for deletion", zohoInvoiceIds);
      console.log(
        "zoho invoice delete res",
        await zoho.invoice
          .delete(zohoInvoiceIds)
          .catch((err) =>
            console.error("Invoice Cleanup failed: " + err.message),
          ),
      );
      const zohoSalesOrderIds = (
        await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)
      ).map((so) => so.salesorder_id);
      console.log("zohoSalesOrderIds for deletion", zohoSalesOrderIds);
      console.log(
        "zoho salesOrder delete res",
        await zoho.salesOrder
          .delete(zohoSalesOrderIds)
          .catch((err) =>
            console.error("SalesOrder Cleanup failed: " + err.message),
          ),
      );
    }
  });

  test("Test 1: Preparation", async () => {
    // TODO create an order in saleor
    console.info("Test 1 started");
    console.debug(
      "sync saleor paymentGateways to ECI (and create saleoPaymentGateway & paymentMethod)",
    );
    await saleorPaymentGatewaySyncService.syncToECI();
    console.debug("Sync zoho bank accounts to ECI");
    await zohoBankAccountsSyncService.syncToECI();
    console.debug("manually connect Zoho Bank accounts with payment methods");
    await Promise.all([
      connectZohoBankToBraintreeCardPm(prismaClient),
      connectZohoBankToBraintreePaypalPm(prismaClient),
      // connectZohoBankToBanktransferPm(prismaClient), // TODO add setup of banktransfer GW in saleor testing
    ]);
    console.debug(
      "sync saleor warehouses to ECI (and connectOrCreate warehouses)",
    );
    await saleorWarehouseSyncService.syncToECI();
    console.debug(
      "sync saleor products to ECI (and create product & productVariants)",
    );
    await saleorProductSyncService.syncToECI();
    console.debug(
      "sync zoho warehouses to ECI (and connectOrCreate warehouses)",
    );
    await zohoWarehouseSyncService.syncToECI();
    console.debug(
      "sync zoho items to ECI (and connect them with product variants)",
    );
    await zohoItemSyncService.syncToECI();
    console.debug("sync zoho taxes to ECI (and create zohoTax & tax)");
    await zohoTaxSyncService.syncToECI();

    console.debug("connect xentralProxyIntegration with gigatec warehouse");
    await prismaClient.xentralProxyApp.update({
      where: {
        id: "test",
      },
      data: {
        warehouse: {
          connect: {
            normalizedName_tenantId: {
              tenantId: "test",
              normalizedName: "gigatecgmbh",
            },
          },
        },
      },
    });
    console.debug(
      "Setup xentralProxyProductVariantSyncService with gigatec warehouse and sync product variants to xentral artikels",
    );
    const xentralProxyProductVariantSyncService =
      new XentralProxyProductVariantSyncService({
        logger: xentralProxyProductVariantLogger,
        db: prismaClient,
        xentralProxyApp,
      });
    await xentralProxyProductVariantSyncService.syncFromECI();
    console.info("Test 1 completed");
  }, 1_240_000);

  test("Test 2: Order and sub-entities to ECI", async () => {
    console.info("Test 2 started");
    console.debug(
      "sync all orders from saleor to ECI (connectOrCreate: Contact, Order, orderLineItem, tax, warehouse, productVariant, Address)",
    );
    await saleorOrderSyncService.syncToECI();
    await sleep(1000);
    console.debug(
      "sync payments from saleor to ECI (and connect them with payment method)",
    );
    // NOTE: saleorPaymentSyncService & braintreeTransactionSyncService services could run in parallel because the both do an upsert based on the transaction id
    await saleorPaymentSyncService.syncToECI();
    console.debug(
      "sync all transaction fees from braintree to ECI (and connectOrCreate them with a payment & connectOrCreate payment method)",
    );
    await braintreeTransactionSyncService.syncToECI();
    await sleep(1000);
    console.info("Test 2 completed");
  }, 1_200_000);

  test("Test 3: Order and sub-entities to Zoho", async () => {
    console.info("Test 3 started");
    console.debug(
      "sync all contacts to zoho contacts & zoho contact persons & addresses from ECI",
    );
    await zohoContactSyncService.syncFromECI();
    await sleep(1000);

    console.debug(
      "sync all orders to zoho salesorders from ECI (and connect salesorder in zoho with: tax, items, warehouses, customer_id: mainCoctact, addresses, contact_persons:[mainContact.contactPerson])",
    );
    await zohoSalesOrdersSyncService.syncFromECI();
    await sleep(1000);

    console.debug(
      "create invoices from zoho salesorders and sync the created invoices back to ECI DB (creates ECI invoice & zoho invocie in ECI DB)",
    );
    await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();
    await sleep(1000);

    console.debug(
      "sync all payments to zoho from ECI (and connect the payments in zoho with: order.invoices and the order.mainContact)",
    );
    await zohoPaymentSyncService.syncFromECI();
    await sleep(1000);

    console.info("Test 3 completed");
  }, 1_200_000);

  test("Test 4: Orders to Xentral Auftrag and Xentral Lieferschei back to Packages", async () => {
    console.info("Test 4 started");
    console.debug(
      "sync all contacts to zoho contacts & zoho contact persons & addresses from ECI",
    );

    if (!xentralProxyApp)
      throw new Error(
        "Testing Tenant or xentral app/integration not found in DB",
      );
    const xentralXmlClient = new XentralXmlClient(xentralProxyApp);
    const xentralRestClient = new XentralRestClient(xentralProxyApp);
    const xentralProxyOrderSyncService = new XentralProxyOrderSyncService({
      xentralXmlClient,
      xentralRestClient,
      logger: xentralProxyOrderLogger,
      db: prismaClient,
      xentralProxyApp,
    });
    await xentralProxyOrderSyncService.syncFromECI();
    const xentralProxyLieferscheinSyncService =
      new XentralProxyLieferscheinSyncService({
        xentralXmlClient,
        xentralRestClient,
        logger: xentralProxyLieferscheinLogger,
        db: prismaClient,
        xentralProxyApp,
      });
    await xentralProxyLieferscheinSyncService.syncToECI();

    console.info("Test 4 completed");
  }, 1_200_000);
});
