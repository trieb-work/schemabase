import { AssertionLogger, NoopLogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import {
    beforeEach,
    describe,
    jest,
    test,
    beforeAll,
    afterAll,
} from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoInvoiceSyncService } from "./invoices";
import {
    deleteInvoices,
    deleteOrders,
    upsertAddressWithZohoAddress,
    upsertContactWithZohoContactPersonsAndZohoContact,
    upsertLineItem1,
    upsertLineItem2,
    upsertOrder,
    upsertProductVariant,
    upsertTaxWithZohoTax,
    upsertZohoItem,
} from "../test/utils";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ZohoSalesOrdersSyncService } from "./salesorders";

const ORDERNR_DATE_PREFIX = "SO-DATE-INV-";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Zoho Inventory Invoice Sync", () => {
    const prismaClient = new PrismaClient();

    const zohoClient = undefined as unknown as ZohoApiClient;
    const mockedZohoClient = {
        invoice: {
            list: async () => Promise.resolve([]),
        },
        util: new Zoho(zohoClient).util,
    } as unknown as Zoho;
    let zoho: Zoho;
    let zohoApp: ZohoApp;
    let zohoSalesOrdersSyncService: ZohoSalesOrdersSyncService;
    let zohoSalesOrdersLogger: AssertionLogger;
    let newOrderNumber: string;
    let zohoInvoiceLogger: AssertionLogger;
    let zohoInvoiceSyncService: ZohoInvoiceSyncService;
    const invoicesToDeleteAfterTest: string[] = [];

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
        zohoSalesOrdersLogger = new AssertionLogger();
        zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
            zoho,
            logger: zohoSalesOrdersLogger,
            db: new PrismaClient(),
            zohoApp,
            createdTimeOffset: 1,
        });
        zohoInvoiceLogger = new AssertionLogger();
        zohoInvoiceSyncService = new ZohoInvoiceSyncService({
            zoho,
            logger: zohoInvoiceLogger,
            db: new PrismaClient(),
            zohoApp,
            createdTimeOffset: 1,
        });
    });

    afterAll(async () => {
        await deleteInvoices(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
        await deleteOrders(prismaClient, { startsWith: ORDERNR_DATE_PREFIX });
        const zohoIds = (await zoho.salesOrder.search(ORDERNR_DATE_PREFIX)).map(
            (so) => so.salesorder_id,
        );
        console.log("zohoIds for deletion", zohoIds);
        console.log("invoicesToDeleteAfterTest", invoicesToDeleteAfterTest);
        console.log(
            "invoice delete res",
            await zoho.invoice.delete(invoicesToDeleteAfterTest),
        );
        console.log("zoho delete res", await zoho.salesOrder.delete(zohoIds));
    });

    test("It should work to sync Zoho invoices to internal ECI DB", async () => {
        const xx = new ZohoInvoiceSyncService({
            zoho: mockedZohoClient,
            logger: new NoopLogger(),
            db: new PrismaClient(),
            zohoApp,
            createdTimeOffset: 0,
        });
        await xx.syncToECI();
    }, 90000);

    test("It should work to create Invoices and ZohoInvoices from ECI Orders with attached ZohoSalesorders", async () => {
        newOrderNumber = `${ORDERNR_DATE_PREFIX}${Math.round(
            (Number(new Date()) - 1662000000000) / 1000,
        )}`;
        console.log("newOrderNumber", newOrderNumber);
        await Promise.all([
            upsertTaxWithZohoTax(prismaClient),
            upsertProductVariant(prismaClient),
            upsertContactWithZohoContactPersonsAndZohoContact(prismaClient),
        ]);
        await Promise.all([
            upsertZohoItem(prismaClient),
            upsertAddressWithZohoAddress(prismaClient),
        ]);
        await upsertOrder(prismaClient, newOrderNumber);
        await Promise.all([
            upsertLineItem1(prismaClient, newOrderNumber),
            upsertLineItem2(prismaClient, newOrderNumber),
        ]);
        zohoSalesOrdersLogger.clearMessages();
        // For preparation create the salesorder in ECI and sync it back
        await zohoSalesOrdersSyncService.syncFromECI();
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders that are not synced with Zoho/,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber),
        );
        zohoSalesOrdersLogger.assertOneLogMessageMatches(
            "info",
            `Successfully created zoho salesorder ${newOrderNumber}`,
        );
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* order\(s\)./,
                ) &&
                (fields?.salesorderNumbersToConfirm as string[])?.includes(
                    newOrderNumber,
                ),
        );
        console.log(
            "Preparation complete (Creation of ZohoSalesOrder in Zoho and ECI DB)",
        );
        zohoInvoiceLogger.clearMessages();
        await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders without a zohoInvoice. Creating zohoInvoices from them./,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber),
        );
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) => {
                if (message.match(/Successfully created a zoho Invoice /)) {
                    if (
                        fields?.invoiceNumber &&
                        fields?.invoiceId &&
                        (fields?.orderNumber as string) === newOrderNumber
                    ) {
                        invoicesToDeleteAfterTest.push(fields?.invoiceId);
                        return true;
                    }
                    return false;
                }
                return false;
            },
        );
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* invoice\(s\)./,
                ) &&
                (fields?.invoiceIDsToConfirm as string[])?.some((invIds) =>
                    invoicesToDeleteAfterTest.includes(invIds),
                ),
        );
    }, 90000);

    test("It should abort sync of a invoice if invoice was aldready created but is missing in ECI DB", async () => {
        await deleteInvoices(prismaClient, newOrderNumber);
        zohoInvoiceLogger.clearMessages();
        await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();
        zohoInvoiceLogger.assertOneLogMessageMatches(
            "warn",
            `Aborting sync of this invoice since it was already created. The syncToECI will handle this. Original Error: There are no items in this sales order to be invoiced.`,
        );
    }, 90000);

    test("It should work to create Invoices and ZohoInvoices with entity level discount", async () => {
        const newOrderNumber2 = `${ORDERNR_DATE_PREFIX}${Math.round(
            (Number(new Date()) - 1662000000000) / 1000,
        )}`;
        console.log("newOrderNumber2", newOrderNumber2);
        await Promise.all([
            upsertTaxWithZohoTax(prismaClient),
            upsertProductVariant(prismaClient),
            upsertContactWithZohoContactPersonsAndZohoContact(prismaClient),
        ]);
        await Promise.all([
            upsertZohoItem(prismaClient),
            upsertAddressWithZohoAddress(prismaClient),
        ]);
        // await upsertOrder(prismaClient, newOrderNumber2, 234.68, 10); // 10€ discount
        await upsertOrder(prismaClient, newOrderNumber2, 151.2);
        await upsertLineItem1(prismaClient, newOrderNumber2, 5);
        zohoSalesOrdersLogger.clearMessages();
        // For preparation create the salesorder in ECI and sync it back
        await zohoSalesOrdersSyncService.syncFromECI();
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders that are not synced with Zoho/,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber2),
        );
        zohoSalesOrdersLogger.assertOneLogMessageMatches(
            "info",
            `Successfully created zoho salesorder ${newOrderNumber2}`,
        );
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* order\(s\)./,
                ) &&
                (fields?.salesorderNumbersToConfirm as string[])?.includes(
                    newOrderNumber2,
                ),
        );
        console.log(
            "Preparation complete (Creation of ZohoSalesOrder in Zoho and ECI DB)",
        );
        zohoInvoiceLogger.clearMessages();
        await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders without a zohoInvoice. Creating zohoInvoices from them./,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber2),
        );
        let invoiceId: string;
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) => {
                if (message.match(/Successfully created a zoho Invoice /)) {
                    if (
                        fields?.invoiceNumber &&
                        fields?.invoiceId &&
                        (fields?.orderNumber as string) === newOrderNumber2
                    ) {
                        invoicesToDeleteAfterTest.push(fields?.invoiceId);
                        invoiceId = fields?.invoiceId;
                        return true;
                    }
                    return false;
                }
                return false;
            },
        );
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* invoice\(s\)./,
                ) &&
                (fields?.invoiceIDsToConfirm as string[])?.some((invIds) =>
                    invoicesToDeleteAfterTest.includes(invIds),
                ),
        );
        const invoice = await zoho.invoice.get(invoiceId!);
        if (invoice?.total !== 151.2) {
            throw new Error(
                `Invoice total ${invoice.total} does not match with excpected total.`,
            );
        }
    }, 90000);

    test("It should work to create Invoices and ZohoInvoices with order level discount", async () => {
        const newOrderNumber3 = `${ORDERNR_DATE_PREFIX}${Math.round(
            (Number(new Date()) - 1662000000000) / 1000,
        )}`;
        console.log("newOrderNumber3", newOrderNumber3);
        await Promise.all([
            upsertTaxWithZohoTax(prismaClient),
            upsertProductVariant(prismaClient),
            upsertContactWithZohoContactPersonsAndZohoContact(prismaClient),
        ]);
        await Promise.all([
            upsertZohoItem(prismaClient),
            upsertAddressWithZohoAddress(prismaClient),
        ]);
        await upsertOrder(prismaClient, newOrderNumber3, 145.95, 10); // 10€ discount
        await upsertLineItem1(prismaClient, newOrderNumber3);
        zohoSalesOrdersLogger.clearMessages();
        // For preparation create the salesorder in ECI and sync it back
        await zohoSalesOrdersSyncService.syncFromECI();
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders that are not synced with Zoho/,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber3),
        );
        zohoSalesOrdersLogger.assertOneLogMessageMatches(
            "info",
            `Successfully created zoho salesorder ${newOrderNumber3}`,
        );
        zohoSalesOrdersLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* order\(s\)./,
                ) &&
                (fields?.salesorderNumbersToConfirm as string[])?.includes(
                    newOrderNumber3,
                ),
        );
        console.log(
            "Preparation complete (Creation of ZohoSalesOrder in Zoho and ECI DB)",
        );
        zohoInvoiceLogger.clearMessages();
        await zohoInvoiceSyncService.syncFromECI_autocreateInvoiceFromSalesorder();
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Received [\d]+ orders without a zohoInvoice. Creating zohoInvoices from them./,
                ) &&
                (fields?.orderNumbers as string[])?.includes(newOrderNumber3),
        );
        let invoiceId: string;
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) => {
                if (message.match(/Successfully created a zoho Invoice /)) {
                    if (
                        fields?.invoiceNumber &&
                        fields?.invoiceId &&
                        (fields?.orderNumber as string) === newOrderNumber3
                    ) {
                        invoicesToDeleteAfterTest.push(fields?.invoiceId);
                        invoiceId = fields?.invoiceId;
                        return true;
                    }
                    return false;
                }
                return false;
            },
        );
        zohoInvoiceLogger.assertOneLogEntryMatches(
            "info",
            ({ message, fields }) =>
                !!message.match(
                    /Successfully confirmed [1-9]+[0]* invoice\(s\)./,
                ) &&
                (fields?.invoiceIDsToConfirm as string[])?.some((invIds) =>
                    invoicesToDeleteAfterTest.includes(invIds),
                ),
        );
        const invoice = await zoho.invoice.get(invoiceId!);
        if (invoice?.total !== 145.95) {
            throw new Error(
                `Invoice total ${invoice.total} does not match with excpected total.`,
            );
        }
    }, 90000);
});
