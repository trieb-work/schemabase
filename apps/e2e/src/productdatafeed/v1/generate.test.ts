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

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const saleorApp = await prisma.saleorApp.upsert({
    where: {
      domain_channelSlug: {
        channelSlug: "default-channel",
        domain: "http://saleor.eci:8000",
      },
    },
    update: {},
    create: {
      id: randomUUID(),
      name: randomUUID(),
      tenantId: tenant.id,
      channelSlug: "default-channel",
      domain: "http://saleor.eci:8000",
    },
  });
  const productDataFeed = await prisma.productDataFeedApp.create({
    data: {
      id: randomUUID(),
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
      productDetailStorefrontURL: "www.storefront.com",
      saleorApp: {
        connect: { id: saleorApp.id },
      },
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

  const integration = await prisma.productDataFeedIntegration.create({
    data: {
      id: randomUUID(),
      tenantId: tenant.id,
      enabled: true,
      productDataFeedAppId: productDataFeed.id,
      saleorAppId: saleorApp.id,
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
