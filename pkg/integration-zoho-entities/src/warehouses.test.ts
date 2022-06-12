import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho } from "@trieb.work/zoho-ts";
import { ZohoWarehouseSyncService } from "./warehouses";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Zoho Inventory Warehouse Sync", () => {
  const prismaClient = new PrismaClient();

  const mockedZohoClient = {
    warehouse: {
      list: async () =>
        await Promise.resolve([
          {
            warehouse_id: "98644000000108128",
            warehouse_name: "GIGATEC GmbH",
            attention: "gigatec GmbH",
            address: "Siegelsdorfer Str. 30",
            address1: "Siegelsdorfer Str. 30",
            address2: "c/o Pfeffer & Frost",
            city: "Fürth",
            state: "",
            state_code: "",
            country: "Germany",
            zip: "90768",
            phone: "",
            email: "",
            is_primary: true,
            status: "active",
            status_formatted: "Aktiv",
            is_fba_warehouse: false,
            sales_channels: [],
          },
          {
            warehouse_id: "98644000003868314",
            warehouse_name: "trieb.work",
            attention: "",
            address: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            state_code: "",
            country: "Germany",
            zip: "",
            phone: "",
            email: "",
            is_primary: false,
            status: "active",
            status_formatted: "Aktiv",
            is_fba_warehouse: false,
            sales_channels: [],
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

  test("It should work to sync Zoho Items with internal ECI DB", async () => {
    const xx = new ZohoWarehouseSyncService({
      zoho: mockedZohoClient,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });
    await xx.syncToECI();
  }, 90000);
});
