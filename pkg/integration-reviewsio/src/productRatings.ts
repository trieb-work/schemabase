import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ReviewsioApp } from "@eci/pkg/prisma";
import axios, { AxiosError, AxiosResponse } from "axios";

interface ReviewsioProductRatingSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  reviewsioApp: ReviewsioApp;
}

export class ReviewsioProductRatingSyncService {
  // get all productVariants and call the reviews.io api for each one. URL: https://api.reviews.io/product/rating-batch?store=STORE-ID&sku=SKU1;SKU2;SKU3
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
      `Found ${allProductVariants.length} product variants to pull data from reviews.io now..`,
    );

    // use one API call to get all product ratings for all SKU's. Use rating-batch API endpoint.
    // The returning data looks like this:
    // [
    //   {
    //       "sku": "00-8URW-4EH6",
    //       "average_rating": "4.7059",
    //       "num_ratings": 51,
    //       "name": "Sneaker Socken Mix (Schwarz\/Wei\u00df\/Grau) \/ 43 - 46 \/ 6 Paar"
    //   },
    //   {
    //       "sku": "06-BNOF-39IM",
    //       "average_rating": "5.0000",
    //       "num_ratings": 1,
    //       "name": "Jogginghose Schwarz - NEU \/ 2XL \/ 1 St\u00fcck"
    //   }
    //   ]

    const reviewsResponse: void | AxiosResponse<
      { sku: string; average_rating: string; num_ratings: number }[]
    > = await axios({
      method: "get",
      url: "https://api.reviews.io/product/rating-batch",
      params: {
        store: this.reviewsioApp.storeId,
        sku: allProductVariants.map((pv) => pv.sku).join(";"),
      },
    }).catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.logger.error(
            `Unauthorized request to reviews.io API. Check your store ID.${error.message}`,
          );
        } else {
          this.logger.error(
            `Error while calling reviews.io API: ${error.message}`,
          );
        }
      } else {
        this.logger.error(
          `Error while calling reviews.io API: ${
            error.message
          } - ${JSON.stringify(error)}`,
        );
      }
    });

    if (!reviewsResponse || !reviewsResponse.data) {
      this.logger.error("No response from reviews.io API");
      return;
    }

    const { data } = reviewsResponse;

    this.logger.debug(
      `Received following data from reviews.io: ${JSON.stringify(data)}`,
    );

    this.logger.info(`Received ${data.length} product ratings from reviews.io`);

    const updateStats = { updated: 0, skipped: 0 };
    for (const rating of data) {
      const productVariant = allProductVariants.find(
        (pv) => pv.sku === rating.sku,
      );

      if (!productVariant) {
        this.logger.error(
          `No internal product variant found for SKU ${rating.sku}`,
        );
        continue;
      }
      const numericAverageRating = parseFloat(rating.average_rating);
      if (productVariant.averageRating !== numericAverageRating) {
        this.logger.info(
          // eslint-disable-next-line max-len
          `Updating product variant ${productVariant.id} - ${productVariant.sku} with new rating ${numericAverageRating} and ${rating.num_ratings} ratings`,
        );
        await this.db.productVariant.update({
          where: {
            id: productVariant.id,
          },
          data: {
            averageRating: numericAverageRating,
            ratingCount: rating.num_ratings,
          },
        });
        updateStats.updated += 1;
      } else {
        updateStats.skipped += 1;
      }
    }

    this.logger.info(
      // eslint-disable-next-line max-len
      `Updated ${updateStats.updated} product variants. Skipped ${updateStats.skipped} product variants.`,
    );
  }
}
