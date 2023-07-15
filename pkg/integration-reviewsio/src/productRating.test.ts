// Test the productRating.ts file with Jest. Use five different product SKUs and simulate a case with a wrong SKU.
import { ReviewsioProductRatingSyncService } from "./productRatings";
import { NoopLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeAll, describe, jest, test, expect } from "@jest/globals";

const testStoreId = "snocks";
const testSkus = ["00-8URW-4EH6", "06-BNOF-39IM", "07-JT9L-PZX0"];

beforeAll(async () => {
  jest.setTimeout(30000);
  const prismaClient = new PrismaClient();

  await prismaClient.tenant.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      name: "test",
    },
  });

  const testProduct = await prismaClient.product.upsert({
    where: {
      id: "test",
    },
    update: {},
    create: {
      id: "test",
      tenantId: "test",
      normalizedName: "test",
      name: "test",
    },
  });

  for (const testSKU of testSkus) {
    await prismaClient.productVariant.upsert({
      where: {
        sku_tenantId: {
          sku: testSKU,
          tenantId: "test",
        },
      },
      update: {},
      create: {
        id: testSKU,
        sku: testSKU,
        tenantId: "test",
        productId: testProduct.id,
      },
    });
  }
});

describe("Reviewsio Entity Sync Product Ratings Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync mocked Product Ratings to internal ECI db", async () => {
    const reviewsIoApp = await prismaClient.reviewsioApp.upsert({
      where: {
        id: "test",
      },
      update: {},
      create: {
        id: "test",
        tenantId: "test",
        storeId: testStoreId,
      },
    });
    const xx = new ReviewsioProductRatingSyncService({
      logger: new NoopLogger(),
      db: prismaClient,
      reviewsioApp: reviewsIoApp,
    });
    await xx.syncToEci();

    const validatingProductVariant =
      await prismaClient.productVariant.findUnique({
        where: {
          id: testSkus[0],
        },
      });
    expect(validatingProductVariant?.averageRating).toBeGreaterThan(0);
  });
});
