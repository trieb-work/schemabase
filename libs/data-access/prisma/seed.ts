import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tenantId = "294de72d-6498-4355-a182-422bbed7b825";
  const tenant = await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      name: "test tenant",
    },
  });

  await prisma.strapiApp.upsert({
    where: { id: "strapiId" },
    update: {},
    create: {
      id: "strapiId",
      name: "testing",
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
    },
  });

  const saleorDomain = "pundf-test-api.triebwork.com";
  const appToken = process.env["SALEOR_TEMPORARY_APP_TOKEN"];
  if (!appToken) {
    throw new Error(`SALEOR_TEMPORARY_APP_TOKEN missing`);
  }
  await prisma.saleorApp.upsert({
    where: { id: "id" },
    update: {},
    create: {
      id: "id",
      tenantId: tenant.id,
      name: "name",
      domain: saleorDomain,
      appToken,
      channelSlug: "storefront",
    },
  });

  const productDataFeedId = "cksq51dwk00009ci06armhpsq";
  await prisma.productDataFeedApp.upsert({
    where: { id: productDataFeedId },
    update: {},
    create: {
      id: productDataFeedId,
      productDetailStorefrontURL: "pundf-staging-api.triebwork.com",
      tenantId: tenant.id,
      webhooks: {
        create: {
          id: "webhookId",
          secret: {
            create: {
              id: "cksq51dwk00009ci06armhpsq_secret",
              secret:
                "c026162c68d176033fddcf60711d3de76ff9899d278f884e491d7ee3027938e3",
            },
          },
        },
      },
    },
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
