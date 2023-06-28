import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ReviewsioApp } from "@eci/pkg/prisma";
import axios, { AxiosError } from "axios";

interface ReviewsioProductRatingSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  reviewsioApp: ReviewsioApp;
}

export class ReviewsioProductRatingSyncService {
  // get all productVariants and call the reviews.io api for each one. URL: https://api.reviews.io/product/review?store=STORE-ID&sku=SKU
  // make a random pause between 1ms and 200ms between each call. You need the reviews.io app and logger as variables.
  // if the call is succesfull, update the product variant with the new rating and the number of reviews.
  // if the call is not succesfull, log the error and continue with the next product variant.
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly reviewsioApp: ReviewsioApp;

  public constructor(config: ReviewsioProductRatingSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.reviewsioApp = config.reviewsioApp;
  }

  public async syncToEci() {
    const allProductVariants = await this.db.productVariant.findMany({
      where: {
        tenantId: this.reviewsioApp.tenantId,
      },
    });

    this.logger.info(
      `Found ${allProductVariants.length} product variants to pull data from reviews.io`,
    );

    for (const productVariant of allProductVariants) {
      const reviewsResponse = await axios({
        method: "get",
        url: "https://api.reviews.io/product/review",
        params: {
          store: this.reviewsioApp.storeId,
          sku: productVariant.sku,
        },
      }).catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            this.logger.error(
              `Unauthorized request to reviews.io API. Check your store ID.${error.message}`,
            );
          }
        }
      });

      if (reviewsResponse) {
        const { data } = reviewsResponse;
        const stats = data.stats;

        if (!stats) {
          this.logger.error(
            `data returned from reviews.io API does not contain stats.${JSON.stringify(
              data,
            )}`,
          );
          continue;
        }

        this.logger.info(
          // eslint-disable-next-line max-len
          `Updating product variant ${productVariant.id}, ${productVariant.sku} with rating ${stats.average} and ${stats.count} reviews.`,
        );

        await this.db.productVariant.update({
          where: {
            id: productVariant.id,
          },
          data: {
            averageRating: stats.average,
            ratingCount: stats.count,
          },
        });
      }

      const randomPause = Math.floor(Math.random() * 200) + 1;
      await new Promise((resolve) => setTimeout(resolve, randomPause));
    }
  }
}
