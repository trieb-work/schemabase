import { PrismaClient } from "@prisma/client";
import { Logger } from "tslog";

const prisma = new PrismaClient();
const logger = new Logger({ name: "DB seed" });

async function main() {
  const tenantId = "294de72d-6498-4355-a182-422bbed7b825";
  const tenant = await prisma.tenant.upsert({
    where: { id: tenantId },
    update: {},
    create: {
      id: tenantId,
      enabled: true,
    },
  });

  const saleorDomain = "https://pundf-test-api.triebwork.com";
  const appToken = process.env["SALEOR_TEMPORARY_APP_TOKEN"];
  if (!appToken) {
    throw new Error(`SALEOR_TEMPORARY_APP_TOKEN missing`);
  }
  await prisma.saleorApp.upsert({
    where: {
      domain: saleorDomain,
    },
    update: {
      appToken,
    },
    create: {
      tenantId: tenant.id,
      name: "name",
      domain: "pundf-test-api.triebwork.com",
      appToken,
      channelSlug: "storefront",
    },
  });

  await prisma.productDataFeed.upsert({
    where: { publicId: "cksq51dwk00009ci06armhpsq" },
    update: {},
    create: {
      enabled: true,
      productDetailStorefrontURL: "pundf-test-api.triebwork.com",
      tenantId: tenant.id,
    },
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
