import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const seedTenant = {
    id: "294de72d-6498-4355-a182-422bbed7b825",
    name: "test tenant",
    enabled: true,
  };
  const tenant = await prisma.tenant.upsert({
    where: { id: seedTenant.id },
    update: seedTenant,
    create: seedTenant,
  });

  const saleorDomain = "pundf-test-api.triebwork.com";
  const appToken = process.env["SALEOR_TEMPORARY_APP_TOKEN"];
  if (!appToken) {
    throw new Error(`SALEOR_TEMPORARY_APP_TOKEN missing`);
  }
  const seedSaleorApp = {
    tenantId: tenant.id,
    name: "name",
    domain: saleorDomain,
    appToken,
    channelSlug: "storefront",
  };
  await prisma.saleorApp.upsert({
    where: {
      domain: saleorDomain,
    },
    update: {},
    create: seedSaleorApp,
  });

  const seedProductDataFeed = {
    publicId: "cksq51dwk00009ci06armhpsq",
    enabled: true,

    // productDetailStorefrontURL: "pundf-test-api.triebwork.com", // v11 ~> v3
    productDetailStorefrontURL: "pundf-staging-api.triebwork.com", // v7  ~> v2.7
    tenantId: tenant.id,
  };
  await prisma.productDataFeed.upsert({
    where: { publicId: seedProductDataFeed.publicId },
    update: seedProductDataFeed,
    create: seedProductDataFeed,
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
