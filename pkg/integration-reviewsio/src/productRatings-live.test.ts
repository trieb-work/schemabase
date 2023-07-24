import { AssertionLogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { beforeEach, describe, jest, test } from "@jest/globals";
import "@eci/pkg/jest-utils/consoleFormatter";
import { ReviewsioProductRatingSyncService } from "./productRatings";

/// Use this file to locally run this service

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Reviews.io production Test", () => {
  const prismaClient = new PrismaClient();

  test("It should work to sync reviews", async () => {
    const reviewsApp = await prismaClient.reviewsioApp.findUnique({
      where: {
        id: "ken_prod",
        // id: "test",
      },
    });
    if (!reviewsApp)
      throw new Error("Testing Tenant or zoho app/integration not found in DB");

    const service = new ReviewsioProductRatingSyncService({
      logger: new AssertionLogger(),
      db: prismaClient,
      reviewsioApp: reviewsApp,
    });
    await service.syncToECI();
  }, 1000000);
});
