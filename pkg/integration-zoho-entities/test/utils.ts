import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { id } from "@eci/pkg/ids";
import { Prisma, PrismaClient } from "@prisma/client";
import { normalizeStrings } from "@eci/pkg/normalization";

const LOGGING = false;

export async function deleteInvoices(
  prisma: PrismaClient,
  orderNumber: string | Prisma.StringFilter,
) {
  const delRes = await prisma.invoice.deleteMany({
    where: {
      orders: {
        some: {
          AND: {
            orderNumber,
            tenantId: "test",
          },
        },
      },
    },
  });
  if (LOGGING) console.log("deleted Invoice", delRes.count);
}
export async function deleteOrders(
  prisma: PrismaClient,
  orderNumber: string | Prisma.StringFilter,
) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      },
    },
  });
  if (LOGGING) console.log("deleted Order", delRes.count);
}

export async function deleteOrder(prisma: PrismaClient, orderNumber: string) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      },
    },
  });
  if (LOGGING) console.log("deleted Order", delRes.count);
}

export async function upsertProductVariant(prisma: PrismaClient) {
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
  if (LOGGING) console.log("created one generic productVariant");
}

export async function upsertOrder(
  prisma: PrismaClient,
  orderNumber: string,
  totalPriceGross = 234.68,
  discountValueNet: number | undefined = undefined,
) {
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
      date: "2022-01-01T00:00:00.000Z",
      orderNumber,
      totalPriceGross,
      ...(discountValueNet ? { discountValueNet } : {}),
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
  if (LOGGING) console.log("created one generic order");
}

export async function upsertLineItem1(
  prisma: PrismaClient,
  orderNumber: string,
  discountValueNet: number | undefined = undefined,
) {
  await prisma.orderLineItem.upsert({
    where: {
      id: `test-l1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-${orderNumber}`,
      quantity: 10,
      ...(discountValueNet ? { discountValueNet } : {}),
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
  if (LOGGING) console.log("created one generic lineitem for the order");
}

export async function upsertLineItemWithRealProductVariantFromZoho(
  prisma: PrismaClient,
  orderNumber: string,
) {
  await prisma.orderLineItem.upsert({
    where: {
      id: `test-l1-1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-1-${orderNumber}`,
      quantity: 10,
      uniqueString: uniqueStringOrderLine(
        orderNumber,
        `test-l1-1-${orderNumber}`,
        10,
      ),
      tax: {
        connect: {
          id: "test",
        },
      },
      productVariant: {
        connect: {
          sku_tenantId: {
            sku: "pf-leb-5-gemischt",
            tenantId: "test",
          },
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
  if (LOGGING) console.log("created one generic lineitem for the order");
}

export async function upsertLineItem2(
  prisma: PrismaClient,
  orderNumber: string,
) {
  await prisma.orderLineItem.upsert({
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
  if (LOGGING) console.log("created second generic lineitem for the order");
}

export async function recreateContact(prisma: PrismaClient) {
  const delRes = await prisma.contact.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted contact", delRes.count);
  await upsertContact(prisma);
}

export async function upsertContact(prisma: PrismaClient) {
  await prisma.contact.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      email: "tilman@trieb.work",
      firstName: "Tilman",
      lastName: "Marquart",
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created contact");
}
export async function recreateAddress(prisma: PrismaClient) {
  const delRes = await prisma.address.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted address", delRes.count);
  await upsertAddress(prisma);
}
export async function upsertAddress(prisma: PrismaClient) {
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
      contact: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created one address for the generic order");
}

export async function recreateTax(prisma: PrismaClient) {
  await prisma.tax.deleteMany({
    where: {
      id: "test",
    },
  });
  if (LOGGING) console.log("deleted tax");
  await upsertTax(prisma);
}

export async function upsertTax(prisma: PrismaClient) {
  await prisma.tax.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      name: "Reduziert - Temp",
      normalizedName: normalizeStrings.taxNames("Reduziert - Temp"),
      percentage: 5,
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  if (LOGGING) console.log("created tax");
}

/**
 *
 * --------------  combined creation with zoho entities as well  ----------------------------
 */

export async function upsertContactWithZohoContactPersonsAndZohoContact(
  prisma: PrismaClient,
) {
  await prisma.contact.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      email: "tilman+zohoContactTest@trieb.work",
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoContactPersons: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001668125",
              zohoAppId: "test",
            },
          },
          create: {
            email: "tilman+zohoContactTest@trieb.work",
            id: "116240000001668125",
            zohoApp: {
              connect: {
                id: "test",
              },
            },
            zohoContact: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: "116240000001558532",
                    zohoAppId: "test",
                  },
                },
                create: {
                  id: "116240000001558532",
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
  if (LOGGING) console.log("created contact + zohoContact + zohoContactPerson");
}

export async function upsertAddressWithZohoAddress(prisma: PrismaClient) {
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
              id: "116240000001558534",
              zohoAppId: "test",
            },
          },
          create: {
            id: "116240000001558534",
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
  if (LOGGING)
    console.log("created one address + zohoAddress for the generic order");
}

export async function upsertTaxWithZohoTax(prisma: PrismaClient) {
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
  if (LOGGING) console.log("created tax + zohoTax");
}

export async function upsertZohoItem(prisma: PrismaClient) {
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
  if (LOGGING) console.log("created zohoItem");
}

/**
 *
 * this deletes pf-leb-5-gemischt
 */
export async function deleteZohoItem(prisma: PrismaClient) {
  const delRes = await prisma.zohoItem.deleteMany({
    where: {
      id: "116240000000203041", // = pf-leb-5-gemischt
      zohoAppId: "test",
    },
  });
  if (LOGGING) console.log("deleted zohoItem", delRes.count);
}
