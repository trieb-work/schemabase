import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho } from "@trieb.work/zoho-ts";
import { ZohoTaxSyncService } from "./taxes";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory Tax Sync", () => {
  const prismaClient = new PrismaClient();

  const mockedZohoClient = {
    tax: {
      list: async () =>
        await Promise.resolve([
          {
            tax_id: "116240000000032144",
            tax_name: "Reduziert",
            tax_percentage: 7,
            tax_type: "tax",
            tax_specific_type: "",
            output_tax_account_name: "Steuerverbindlichkeiten",
            purchase_tax_account_name: "Steuerverbindlichkeiten",
            tax_account_id: "116240000000000364",
            purchase_tax_account_id: "116240000000000364",
            is_value_added: true,
            is_default_tax: false,
            is_editable: true,
          },
          {
            tax_id: "116240000000147001",
            tax_name: "Reduziert - Temp",
            tax_percentage: 5,
            tax_type: "tax",
            tax_specific_type: "",
            output_tax_account_name: "Steuerverbindlichkeiten",
            purchase_tax_account_name: "Steuerverbindlichkeiten",
            tax_account_id: "116240000000000364",
            purchase_tax_account_id: "116240000000000364",
            is_value_added: true,
            is_default_tax: false,
            is_editable: true,
          },
          {
            tax_id: "116240000000566001",
            tax_name: "Regulär",
            tax_percentage: 19,
            tax_type: "tax",
            tax_specific_type: "",
            output_tax_account_name: "Steuerverbindlichkeiten",
            purchase_tax_account_name: "Steuerverbindlichkeiten",
            tax_account_id: "116240000000000364",
            purchase_tax_account_id: "116240000000000364",
            is_value_added: true,
            is_default_tax: false,
            is_editable: true,
          },
          {
            tax_id: "116240000000147005",
            tax_name: "Regulär - temp",
            tax_percentage: 16,
            tax_type: "tax",
            tax_specific_type: "",
            output_tax_account_name: "Steuerverbindlichkeiten",
            purchase_tax_account_name: "Steuerverbindlichkeiten",
            tax_account_id: "116240000000000364",
            purchase_tax_account_id: "116240000000000364",
            is_value_added: true,
            is_default_tax: false,
            is_editable: true,
          },
          {
            tax_id: "116240000000566005",
            tax_name: "Tax Free",
            tax_percentage: 0,
            tax_type: "tax",
            tax_specific_type: "",
            output_tax_account_name: "Steuerverbindlichkeiten",
            purchase_tax_account_name: "Steuerverbindlichkeiten",
            tax_account_id: "116240000000000364",
            purchase_tax_account_id: "116240000000000364",
            is_value_added: true,
            is_default_tax: false,
            is_editable: true,
          },
        ]),
    },
  } as unknown as Zoho;

  beforeAll(async () => {
    zohoApp = await prismaClient.zohoApp.findUnique({
      where: {
        id: "test",
      },
      include: { tenant: true },
    });
    if (!zohoApp) throw new Error("No testing Zoho App found!");
  });

  test("It should work to sync Zoho Taxes with internal ECI DB", async () => {
    const xx = new ZohoTaxSyncService({
      zoho: mockedZohoClient,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });
    await xx.syncToECI();
  }, 90000);
});
