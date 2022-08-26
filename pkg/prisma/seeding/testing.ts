import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { PrismaClient } from "..";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DB started");
  await prisma.tenant.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      name: "test",
    },
  });
  console.log("created tenant");
  await prisma.saleorApp.upsert({
    where: {
      id: "test",
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
  });
  console.log("created saleorApp");
  await prisma.installedSaleorApp.upsert({
    where: {
      id: "test",
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
  });
  console.log("created installedSaleorApp");
  await prisma.zohoApp.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      orgId: "20070434578",
      clientId: "1000.O4V6IZ9VXZ0FE3INNQ8HKLILJBAM0R",
      clientSecret: "7380507184e37a8df4b4074ed2cf7bd8d84b9dca5e",
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created zohoApp");
  await prisma.warehouse.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      normalizedName: "test",
      name: "test",
      tenant: {
        connect: {
          id: "test",
        },
      },
      zohoWarehouse: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000000067007",
              zohoAppId: "test",
            }
          },
          create: {
            id: "116240000000067007",
            zohoApp: {
              connect: {
                id: "test",
              }
            }
          }
        },
      }
    },
  });
  console.log("created warehouse");
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
      zohoItem: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000000203041",
              zohoAppId: "test"
            }
          },
          create: {
            id: "116240000000203041",
            createdAt: "1970-01-01T00:00:00.000Z",
            updatedAt: "1970-01-01T00:00:00.000Z",
            zohoApp: {
              connect: {
                id: "test",
              }
            }
          }
        }
      },
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created one generic productVariant");
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
            }
          },
          create: {
            createdAt: "1970-01-01T00:00:00.000Z",
            updatedAt: "1970-01-01T00:00:00.000Z",
            id: "116240000001504007",
            zohoApp: {
              connect: {
                id: "test"
              }
            }
          }
        }
      }
    },
  });
  console.log("created one address for the generic order");
  await prisma.contact.upsert({
    where: {
      id: "test"
    },
    update: {},
    create: {
      id: "test",
      email: "tilman@trieb.work",
      tenant: {
        connect: {
          id: "test",
        }
      },
      zohoContactPersons: {
        connectOrCreate: {
          where: {
            id_zohoAppId: {
              id: "116240000001504004",
              zohoAppId: "test"
            }
          },
          create: {
            email: "jannik@trieb.work",
            id: "116240000001504004",
            zohoApp: {
              connect: {
                id: "test"
              }
            },
            zohoContact: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: "116240000001504002",
                    zohoAppId: "test",
                  }
                },
                create: {
                  id: "116240000001504002",
                  zohoApp: {
                    connect: {
                      id: "test"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  await prisma.order.upsert({
    where: {
      orderNumber_tenantId: {
        orderNumber: "STORE-123",
        tenantId: "test",
      },
    },
    update: {},
    create: {
      id: id.id("order"),
      createdAt: "1970-01-01T00:00:00.000Z",
      orderNumber: "STORE-123",
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
        }
      },
      contacts: {
        connect: {
          id: "test"
        },
      },
    },
  });
  console.log("created one generic order");
  await prisma.lineItem.upsert({
    where: {
      id: "test-l1",
    },
    update: {},
    create: {
      id: "test-l1",
      quantity: 10,
      uniqueString: uniqueStringOrderLine("STORE-123", "test-1", 10),
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber: "STORE-123",
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
          id: "test"
        }
      }
    },
  });
  console.log("created one generic lineitem for the order");
  await prisma.lineItem.upsert({
    where: {
      id: "test-l2",
    },
    update: {},
    create: {
      id: "test-l2",
      quantity: 5,
      uniqueString: uniqueStringOrderLine("STORE-123", "test-1", 5),
      productVariant: {
        connect: {
          id: "test",
        },
      },
      order: {
        connect: {
          orderNumber_tenantId: {
            orderNumber: "STORE-123",
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
  await prisma.xentralProxyApp.upsert({
    where: {
      id: "test",
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
          id: "test",
        },
      },
    },
  });
  console.log("created xentralProxyApp");
  await prisma.saleorZohoIntegration.upsert({
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
  });
  console.log("created saleorZohoIntegration");
  await prisma.xentralProxyIntegration.upsert({
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
      warehouse: {
        connect: {
          id: "test",
        },
      },
      xentralProxyApp: {
        connect: {
          id: "test",
        },
      },
    },
  });
  console.log("created xentralProxyIntegration");
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
