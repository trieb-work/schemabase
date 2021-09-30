import { HttpClient } from "@eci/http";
import { PrismaClient } from "@eci/data-access/prisma";
import { createHash } from "crypto";
import {idGenerator} from "@eci/util/ids"
import {
  CountryCode,
  createSaleorClient,
  ProductTypeKindEnum,
} from "@eci/adapters/saleor/api";
import { env } from "@chronark/env";

const webhookId = idGenerator.id("test");

beforeAll(async () => {
  const prisma = new PrismaClient();

  let saleorClient = await createSaleorClient({
    traceId: idGenerator.id("trace"),
    graphqlEndpoint: env.require("SALEOR_URL"),
  });

  const setup = await saleorClient.tokenCreate({
    email: "admin@example.com",
    password: "admin",
  });
  if (!setup?.tokenCreate?.token) {
    throw new Error(`Unable to get saleor token`);
  }

  saleorClient = createSaleorClient({
    traceId: idGenerator.id("trace"),
    graphqlEndpoint: env.require("SALEOR_URL"),
    token: setup.tokenCreate.token,
  });

  const categoryResponse = await saleorClient.categoryCreate({
    input: {
      name: "juices",
    },
  });
  const category = categoryResponse?.categoryCreate?.category;

  if (!category) {
    throw new Error(
      `Unable to create category: ${JSON.stringify(categoryResponse, null, 2)}`,
    );
  }

  const channelResponse = await saleorClient.channelCreate({
    input: {
      isActive: true,
      name: idGenerator.id("test"),
      slug: idGenerator.id("test"),
      currencyCode: "EUR",
      defaultCountry: CountryCode.De,
    },
  });
  const channel = channelResponse?.channelCreate?.channel;

  if (!channel) {
    throw new Error(
      `Unable to create channel: ${JSON.stringify(channelResponse, null, 2)}`,
    );
  }

  const productTypeResponse = await saleorClient.productTypeCreate({
    input: {
      name: idGenerator.id("test"),
      slug: idGenerator.id("test"),
      hasVariants: false,
      isDigital: true,
      isShippingRequired: false,
      weight: 2,
      kind: ProductTypeKindEnum.Normal,
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
      slug: "apple-juice",
      category: category.id,
      // description: "Apple juice is great",
      // weight: 2,
      productType,
    },
  });
  const product = productResponse?.productCreate?.product;
  if (!product) {
    throw new Error("no product " + JSON.stringify(productResponse, null, 2));
  }
  const productVariantResponse = await saleorClient.productVariantCreate({
    input: {
      attributes: [],
      product: product.id,
      sku: "apple-juice-sku",
      trackInventory: true,
    },
  });
  const productVariant =
    productVariantResponse?.productVariantCreate?.productVariant;
  if (!productVariant) {
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
      id: idGenerator.id("test"),
      name: idGenerator.id("test"),
    },
  });

  /**
   * Upserting because there is a unique constraint on the domain
   */
  const saleorApp = await prisma.saleorApp.create({
    data: {
      id: idGenerator.id("test"),
      name: idGenerator.id("test"),
      tenantId: tenant.id,
      channelSlug: channel.slug,
      domain: "http://saleor.eci:8000",
    },
  });
  const productDataFeed = await prisma.productDataFeedApp.create({
    data: {
      id: idGenerator.id("test"),
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

  const secret = idGenerator.id("test");
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
      id: idGenerator.id("test"),
      tenantId: tenant.id,
      enabled: true,
      productDataFeedAppId: productDataFeed.id,
      saleorAppId: saleorApp.id,
    },
  });
  await prisma.subscription.create({
    data: {
      id: idGenerator.id("test"),
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
  const variants = ["facebookcommerce"]; //, "googlemerchant"];

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
