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
  await prisma.xentralProxyApp.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      username: "protonea",
      password: "2b995033dd61455591ce",
      projectId: 2,
      url: "https://62fb63a4bdbf9.xentral.biz",
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
            },
          },
          create: {
            id: "116240000000067007",
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
  console.log("created warehouse");
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
