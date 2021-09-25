import { HttpClient } from "@eci/http";
import { env } from "@chronark/env";
import { PrismaClient } from "@eci/data-access/prisma";
import { randomUUID, createHash } from "crypto";

const webhookId = randomUUID();

beforeAll(async () => {
  const prisma = new PrismaClient();

  const tenant = await prisma.tenant.create({
    data: {
      id: randomUUID(),
      name: randomUUID(),
    },
  });
  const productDataFeed = await prisma.productDataFeedApp.create({
    data: {
      id: randomUUID(),
      tenantId: tenant.id,
      productDetailStorefrontURL: "pundf-staging-api.triebwork.com",
    },
  });

  const secret = randomUUID();
  const secretHash = createHash("sha256").update(secret).digest("hex");
  await prisma.incomingProductDataFeedWebhook.create({
    data: {
      id: webhookId,
      productDataFeedApp: {
        connect: {
          id: productDataFeed.id,
        },
      },
      secret: {
        create: {
          id: secret,
          secret: secretHash,
        },
      },
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const saleor = await prisma.saleorApp.upsert({
    where: {
      domain: "pundf-test-api.triebwork.com",
    },
    update: {},
    create: {
      id: randomUUID(),
      name: randomUUID(),
      tenantId: tenant.id,
      channelSlug: "storefront",
      domain: "pundf-test-api.triebwork.com",
      appToken: env.require("SALEOR_TEMPORARY_APP_TOKEN"),
    },
  });

  const integration = await prisma.productDataFeedIntegration.create({
    data: {
      id: randomUUID(),
      tenantId: tenant.id,
      enabled: true,
      productDataFeedAppId: productDataFeed.id,
      saleorAppId: saleor.id,
    },
  });
  await prisma.subscription.create({
    data: {
      id: randomUUID(),
      tenantId: tenant.id,
      payedUntil: new Date(Date.now() + 1000 * 60 * 5),
      productDataFeedIntegration: {
        connect: {
          id: integration.id,
        },
      },
    },
  });
  await prisma.$disconnect();
});

describe("productdatafeed", () => {
  const variants = ["facebookcommerce", "googlemerchant"];

  const http = new HttpClient();
  for (const variant of variants) {
    it(`generates a feed for ${variant}`, async () => {
      const res = await http.call<string>({
        method: "GET",
        url: `${env.require(
          "ECI_BASE_URL",
        )}/api/product-data-feed/v1/${webhookId}?variant=${variant}`,
      });

      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toEqual("text/csv");
      expect(res.headers["cache-control"]).toEqual(
        "s-maxage=1, stale-while-revalidate",
      );
      expect(res.data).toMatchSnapshot();
    }, 20_000);
  }
});
