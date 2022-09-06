
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { id } from "@eci/pkg/ids";
import { Prisma, PrismaClient } from "@prisma/client";

const LOGGING = true;

export async function deleteOrders(prisma: PrismaClient, orderNumber: string | Prisma.StringFilter) {
  const delRes = await prisma.order.deleteMany({
    where: {
      AND: {
        orderNumber,
        tenantId: "test",
      }
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
      }
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

export async function upsertOrder(prisma: PrismaClient, orderNumber: string) {
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
  if (LOGGING) console.log("created one generic order");
}

export async function upsertLineItem1(prisma: PrismaClient, orderNumber: string) {
  await prisma.lineItem.upsert({
    where: {
      id: `test-l1-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l1-${orderNumber}`,
      quantity: 10,
      uniqueString: uniqueStringOrderLine(orderNumber, `test-l1-${orderNumber}`, 10),
      tax: {
        connect: {
          id: "test"
        }
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

export async function upsertLineItem2(prisma: PrismaClient, orderNumber: string) {
  await prisma.lineItem.upsert({
    where: {
      id: `test-l2-${orderNumber}`,
    },
    update: {},
    create: {
      id: `test-l2-${orderNumber}`,
      quantity: 5,
      uniqueString: uniqueStringOrderLine(orderNumber, `test-l2-${orderNumber}`, 5),
      tax: {
        connect: {
          id: "test"
        }
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







export async function upsertContact(prisma: PrismaClient) {
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
    },
  });
  if (LOGGING) console.log("created contact");
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

export async function upsertTax(prisma: PrismaClient) {
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
      }
    },
  });
  if (LOGGING) console.log("created tax");
}






/**
 * 
 * --------------  combined creation with zoho entities as well  ----------------------------
 */

export async function upsertContactWithZohoContactPersonsAndZohoContact(prisma: PrismaClient) {
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
  if (LOGGING) console.log("created one address + zohoAddress for the generic order");
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
      }
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
        }
      }
    },
  });
  if (LOGGING) console.log("created zohoItem");
}

export async function deleteZohoItem(prisma: PrismaClient) {
  const delRes = await prisma.zohoItem.deleteMany({
    where: {
      id: "116240000000203041",
      zohoAppId: "test",
    }
  });
  if (LOGGING) console.log("deleted zohoItem", delRes.count);
};
