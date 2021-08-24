import { PrismaClient } from "@prisma/client";
import { Logger } from "tslog";

const prisma = new PrismaClient();
const logger = new Logger({ name: "DB seed" });

async function main() {
  const seedTenant = {
    id: "294de72d-6498-4355-a182-422bbed7b825",
    enabled: true,
  };
  const tenant = await prisma.tenant.upsert({
    where: { id: seedTenant.id },
    update: seedTenant,
    create: seedTenant,
  });

  const saleorDomain = "https://pundf-test-api.triebwork.com";
  const appToken = process.env["SALEOR_TEMPORARY_APP_TOKEN"];
  if (!appToken) {
    throw new Error(`SALEOR_TEMPORARY_APP_TOKEN missing`);
  }
  const seedSaleorApp = {
    tenantId: tenant.id,
    name: "name",
    domain: "pundf-test-api.triebwork.com",
    appToken,
    channelSlug: "storefront",
  };
  await prisma.saleorApp.upsert({
    where: {
      domain: saleorDomain,
    },
    update: seedSaleorApp,
    create: seedSaleorApp,
  });

  const seedProductDataFeed = {
    publicId: "cksq51dwk00009ci06armhpsq",
    enabled: true,
    productDetailStorefrontURL: "pundf-test-api.triebwork.com",
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
    logger.prettyError(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
