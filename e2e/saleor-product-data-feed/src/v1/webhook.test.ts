import { beforeAll, describe, expect, it } from "@jest/globals";
import { HttpClient } from "@eci/pkg/http";
import { PrismaClient } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { CountryCode, createSaleorClient } from "@eci/pkg/saleor";
import { env } from "@eci/pkg/env";

const webhookId = id.id("test");

beforeAll(async () => {
  const prisma = new PrismaClient();

  let saleorClient = createSaleorClient({
    traceId: id.id("trace"),
    graphqlEndpoint: env.require("SALEOR_URL"),
  });

  const setup = await saleorClient.tokenCreate({
    email: "admin@example.com",
    password: "admin",
  });
  if (!setup?.tokenCreate?.token) {
    throw new Error("Unable to get saleor token");
  }

  saleorClient = createSaleorClient({
    traceId: id.id("trace"),
    graphqlEndpoint: env.require("SALEOR_URL"),
    token: setup.tokenCreate.token,
  });

  const categoryResponse = await saleorClient.categoryCreate({
    input: {
      name: "juices",
    },
  });
  const category = categoryResponse?.categoryCreate?.category;

  if (category == null) {
    throw new Error(
      `Unable to create category: ${JSON.stringify(categoryResponse, null, 2)}`,
    );
  }

  const channelResponse = await saleorClient.channelCreate({
    input: {
      isActive: true,
      name: id.id("test"),
      slug: id.id("test"),
      currencyCode: "EUR",
      defaultCountry: CountryCode.De,
    },
  });
  const channel = channelResponse?.channelCreate?.channel;

  if (channel == null) {
    throw new Error(
      `Unable to create channel: ${JSON.stringify(channelResponse, null, 2)}`,
    );
  }

  const productTypeResponse = await saleorClient.productTypeCreate({
    input: {
      name: id.id("test"),
      slug: id.id("test"),
      hasVariants: false,
      isDigital: true,
      isShippingRequired: false,
      weight: 2,
    },
  });
  const productType = productTypeResponse?.productTypeCreate?.productType?.id;
  if (!productType) {
    throw new Error(
      `Unable to create productType: ${JSON.stringify(
        productTypeResponse,
        null,
        2,
      )}`,
    );
  }

  const productResponse = await saleorClient.productCreate({
    input: {
      name: "Apple Juice",
      slug: "slug",
      category: category.id,
      description:
        // eslint-disable-next-line max-len
        '{"time": 1633343031152, "blocks": [{"data": {"text": "Hello world"}, "type": "paragraph"}], "version": "2.20.0"}',

      // weight: 2,
      productType,
    },
  });
  const product = productResponse?.productCreate?.product;
  if (product == null) {
    throw new Error("no product " + JSON.stringify(productResponse, null, 2));
  }
  const productVariantResponse = await saleorClient.productVariantCreate({
    input: {
      attributes: [],
      product: product.id,
      sku: "juicy-juicy-sku",
      trackInventory: true,
    },
  });
  const productVariant =
    productVariantResponse?.productVariantCreate?.productVariant;
  if (productVariant == null) {
    throw new Error(
      "no productVariant " + JSON.stringify(productVariantResponse, null, 2),
    );
  }

  await saleorClient.productChannelListingUpdate({
    id: product.id,
    input: {
      updateChannels: [
        {
          channelId: channel.id,
          availableForPurchaseDate: null,
          isPublished: true,
          visibleInListings: true,
          isAvailableForPurchase: true,
          addVariants: [productVariant.id],
        },
      ],
    },
  });

  await saleorClient.productVariantChannelListingUpdate({
    id: productVariant.id,
    input: [
      {
        channelId: channel.id,
        price: "1",
        costPrice: "2",
      },
    ],
  });

  const tenant = await prisma.tenant.create({
    data: {
      id: id.id("test"),
      name: id.id("test"),
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const saleorApp = await prisma.saleorApp.create({
    data: {
      id: id.id("test"),
      name: id.id("test"),
      tenantId: tenant.id,
      channelSlug: channel.slug,
      domain: "http://saleor.eci:8000",
    },
  });
  const productDataFeed = await prisma.productDataFeedApp.create({
    data: {
      id: id.id("test"),
      tenant: {
        connect: {
          id: tenant.id,
        },
      },
      productDetailStorefrontURL: "www.storefront.com",
    },
  });

  await prisma.incomingWebhook.create({
    data: {
      id: webhookId,
      productDataFeedApp: {
        connect: {
          id: productDataFeed.id,
        },
      },
    },
  });

  const integration = await prisma.productDataFeedIntegration.create({
    data: {
      id: id.id("test"),
      tenantId: tenant.id,
      enabled: true,
      productDataFeedAppId: productDataFeed.id,
      saleorAppId: saleorApp.id,
    },
  });
  await prisma.subscription.create({
    data: {
      id: id.id("test"),
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
}, 20_000);

describe("productdatafeed", () => {
  const variants = ["facebookcommerce", "googlemerchant"];

  const http = new HttpClient();
  for (const variant of variants) {
    it(`generates a feed for ${variant}`, async () => {
      const res = await http.call<string>({
        method: "GET",
        url: `http://localhost:3000/api/product-data-feed/v1/${variant}/${webhookId}`,
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
