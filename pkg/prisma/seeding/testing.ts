import { PrismaClient } from "..";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DB started");
  // TODO move to new package pkg/prisma-seeding-utils/eci, pkg/prisma-seeding-utils/zoho, pkg/prisma-seeding-utils/saleor
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
    },
  });
  console.log("created test warehouse for xentralProxyIntegration");
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

  await prisma.braintreeApp.upsert({
    where: {
      id: "test",
    },
    create: {
      id: "test",
      merchantId:
        "v1.aesgcm256.39f74810.Fr-96izv6IBnZuMN.GpEKApLL0yFyyfxY_LHrUUbdDeJAPQBnBaIeOTFyZSZt",
      publicKey:
        "v1.aesgcm256.39f74810.MNCmQiIZ9VlCmPwo.JwHa8jIqOgHcBRi7WTk9iCbqaNMAlDWyyWwYj4JRfhBc",
      privateKey:
        // eslint-disable-next-line max-len
        "v1.aesgcm256.39f74810.6Kbq4jddRRF2SOg6.PDtnEAdjC0VWNMfoVptyODEUoQGRVFGXwohIFEBa6_wISZHR7MMzOSkdWkKiNdj5og==",
      sandbox: true,
      tenant: {
        connect: {
          id: "test",
        },
      },
    },
    update: {},
  });
  console.log("created Braintree App");
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
