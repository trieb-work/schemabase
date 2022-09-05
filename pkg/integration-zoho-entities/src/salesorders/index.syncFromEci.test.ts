/* eslint-disable max-len */
import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test, beforeAll } from "@jest/globals";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import { ZohoSalesOrdersSyncService } from ".";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { id } from "@eci/pkg/ids";

let zohoApp: any;

beforeEach(() => {
  jest.clearAllMocks();
});

async function deleteZohoSalesOrder(prisma: PrismaClient, orderNumber: string) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      },
    },
  });
  console.log("deleted zohoSalesOrder", delRes.count);
}

async function upsertTax(prisma: PrismaClient) {
  await prisma.tax.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      normalizedName: "test",
      name: "test",
      percentage: 19,
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoTaxes: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000000147001",
              zohoAppId: "test",
            },
          },
          create: {
            id: "116240000000147001",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
          },
        },
      },
    },
  });
  console.log("created tax");
}

async function upsertZohoItem(prisma: PrismaClient) {
  await prisma.zohoItem.upsert({
    where: {
      id_zohoAppId: {
        id: "116240000000203041",
        zohoAppId: "test",
      },
    },
    update: {},
    create: {
      id: "116240000000203041",
      createdAt: "1970-01-01T00:00:00.000Z",
      updatedAt: "1970-01-01T00:00:00.000Z",
      zohoApp: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created zohoItem");
}

async function upsertProductVariant(prisma: PrismaClient) {
  await prisma.productVariant.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      sku: "test-1",
      variantName: "mixed NEU1",
      ean: "123456780123",
      product: {
        create: {
          id: "test",
          name: "test",
          normalizedName: "test",
          tenant: {
            connect: {
              id: "test",
            },
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created one generic productVariant");
}

async function upsertContact(prisma: PrismaClient) {
  await prisma.contact.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      email: "tilman@trieb.work",
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoContactPersons: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001504004",
              zohoAppId: "test",
            },
          },
          create: {
            email: "jannik@trieb.work",
            id: "116240000001504004",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
            zohoContact: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: "116240000001504002",
                    zohoAppId: "test",
                  },
                },
                create: {
                  id: "116240000001504002",
                  zohoApp: {
                    connect: {
                      id: "test",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  console.log("created contact");
}

async function upsertAddress(prisma: PrismaClient) {
  await prisma.address.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
      normalizedName: "testtestGabelsbergerstr.15",
      city: "Nürnberg",
      countryCode: "DE",
      fullname: "Tilman Marquart",
      plz: "90459",
      street: "Gabelsbergerstr. 15",
      zohoAddress: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001504007",
              zohoAppId: "test",
            },
          },
          create: {
            id: "116240000001504007",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
          },
        },
      },
      contact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created one address for the generic order");
}

async function upsertOrder(prisma: PrismaClient, orderNumber: string) {
  await prisma.order.upsert({
    where: {
      orderNumber_tenantId: {
        orderNumber,
        tenantId: "test",
      },
    },
    update: {},
    create: {
      id: id.id("order"),
      createdAt: "1970-01-01T00:00:00.000Z",
      date: new Date("1970-01-01T00:00:00.000Z"),
      orderNumber,
      totalPriceGross: 234.68,
      orderStatus: "confirmed",
      readyToFullfill: true,
      shippingAddress: {
        connect: {
          id: "test",
        },
      },
      billingAddress: {
        connect: {
          id: "test",
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
      mainContact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created one generic order");
}

async function upsertLineItem1(prisma: PrismaClient, orderNumber: string) {
  await prisma.lineItem.upsert({
    where: {
      id: `test-l1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-${orderNumber}`,
      quantity: 10,
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l1-${orderNumber}`,
        10,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
      warehouse: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created one generic lineitem for the order");
}

async function upsertLineItem2(prisma: PrismaClient, orderNumber: string) {
  await prisma.lineItem.upsert({
    where: {
      id: `test-l2-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l2-${orderNumber}`,
      quantity: 5,
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l2-${orderNumber}`,
        5,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
      warehouse: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created second generic lineitem for the order");
}

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
    const realTestingZohoClient = new Zoho(
      await ZohoApiClient.fromOAuth({
        orgId: zohoApp.orgId,
        client: { id: zohoApp.clientId, secret: zohoApp.clientSecret },
      }),
    );
    const zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      zoho: realTestingZohoClient,
      logger: new NoopLogger(),
      db: new PrismaClient(),
      zohoApp,
    });

    // INFO: All tests listed here since we have to run them sequentlially!
    console.log(
      'First test: "It should abort sync of orders if product variants of lineitems are not synced with zoho items"',
    );
    const newOrderNumber = `SO-DATE-${Math.round(
      (Number(new Date()) - 1662000000000) / 1000,
    )}`;
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
    console.log(
      'Second test: "It should sync a SalesOrders if not synced already"',
    );
    await zohoSalesOrdersSyncService.syncFromECI();

    console.log(
      'Third test: "It should attach the Zoho SalesOrder if it is created in saleor but has no record in eci db"',
    );
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
