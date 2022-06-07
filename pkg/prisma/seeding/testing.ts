import { PrismaClient } from "..";

const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.create({
    data: {
      id: "test",
      name: "test",
    },
  });
  await prisma.saleorApp.create({
    data: {
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
  await prisma.installedSaleorApp.create({
    data: {
      id: "test",
      token: "test",
      saleorApp: {
        connect: {
          id: "test",
        },
      },
    },
  });
  await prisma.zohoApp.create({
    data: {
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
  });
  await prisma.saleorZohoIntegration.create({
    data: {
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
