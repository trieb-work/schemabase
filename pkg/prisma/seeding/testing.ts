import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { PrismaClient } from "..";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DB started");
  await prisma.tenant.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      name: "test",
    },
  })
  console.log("created tenant");
  await prisma.saleorApp.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      name: "test",
      domain: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  })
  console.log("created saleorApp");
  await prisma.warehouse.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      normalizedName: "test",
      name: "test",
      tenant: {
        connect: {
          id: "test"
        }
      }
    },
  })
  console.log("created warehouse");
  await prisma.productVariant.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      sku: "test-1",
      variantName: "mixed",
      ean: "123456780123",
      product: {
        create: {
          id: "test",
          name: "test",
          normalizedName: "test",
          tenant: {
            connect: {
              id: "test"
            }
          }
        }
      },
      tenant: {
        connect: {
          id: "test"
        }
      }
    },
  })
  console.log("created one generic productVariant");
  const address = await prisma.address.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test"
        }
      },
      city: "Nürnberg",
      countryCode: "DE",
      fullname: "Tilman Marquart",
      plz: "90459",
      street: "Gabelsbergerstr. 15",
    }
  })
  console.log("created one address for the generic order");
  await prisma.order.upsert({
    where: {
      orderNumber_tenantId: {
        orderNumber: "STORE-123",
        tenantId: "test"
      }
    },
    update: {},
    create: {
      id: id.id("order"),
      orderNumber: "STORE-123",
      totalPriceGross: 10.23,
      orderStatus: "confirmed",
      readyToFullfill: true,
      shippingAddress: {
        connect: {
          id: address.id,
        }
      },
      invoiceAddress: {
        connect: {
          id: address.id,
        }
      },
      tenant: {
        connect: {
          id: "test"
        }
      }
    },
  })
  console.log("created one generic order");
  await prisma.lineItem.upsert({
    where: {
      id: "test-l1"
    },
    update: {},
    create: {
      id: "test-l1",
      quantity: 10,
      uniqueString: uniqueStringOrderLine(
        "STORE-123",
        "test-1",
        10,
      ),
      productVariant: {
        connect: {
          id: "test"
        }
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber: "STORE-123",
            tenantId: "test"
          }
        }
      },
      tenant: {
        connect: {
          id: "test"
        }
      }
    }
  })
  console.log("created one generic lineitem for the order");
  await prisma.lineItem.upsert({
    where: {
      id: "test-l2"
    },
    update: {},
    create: {
      id: "test-l2",
      quantity: 5,
      uniqueString: uniqueStringOrderLine(
        "STORE-123",
        "test-1",
        5,
      ),
      productVariant: {
        connect: {
          id: "test"
        }
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber: "STORE-123",
            tenantId: "test"
          }
        }
      },
      tenant: {
        connect: {
          id: "test"
        }
      },
      warehouse: {
        connect: {
          id: "test"
        }
      }
    }
  })
  console.log("created second generic lineitem for the order");
  await prisma.installedSaleorApp.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      token: "test",
      saleorApp: {
        connect: {
          id: "test",
        },
      },
    },
  })
  console.log("created installedSaleorApp");
  await prisma.zohoApp.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      orgId: "test",
      clientId: "test",
      clientSecret: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  })
  console.log("created zohoApp");
  console.log("created zohoApp");
  await prisma.xentralProxyApp.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      username: "testAppName",
      password: "testKey",
      projectId: 0, // Standard project
      url: "https://62fba42929e58.xentral.biz",
      tenant: {
        connect: {
          id: "test"
        }
      }
    },
  })
  console.log("created xentralProxyApp");
  await prisma.saleorZohoIntegration.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoApp: {
        connect: {
          id: "test",
        },
      },
      installedSaleorApp: {
        connect: {
          id: "test",
        },
      },
    },
  })
  console.log("created saleorZohoIntegration");
  await prisma.xentralProxyIntegration.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      tenant: {
        connect: {
          id: "test"
        }
      },
      warehouse: {
        connect: {
          id: "test"
        }
      },
      xentralProxyApp: {
        connect: {
          id: "test"
        }
      }
    }
  })
  console.log("created xentralProxyIntegration")
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding DB finished");
  });
