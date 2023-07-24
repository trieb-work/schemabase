import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface KencoveApiAppProductSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppProductSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppProductSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "items",
    });
  }

  public async syncToECI() {
    const cronState = await this.cronState.get();
    const now = new Date();
    let createdGte: Date;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
      );
    } else {
      // for security purposes, we sync one hour more than the last run
      createdGte = subHours(cronState.lastRun, 1);
      this.logger.info(`Setting GTE date to ${createdGte}.`);
    }

    const client = new KencoveApiClient(this.kencoveApiApp);
    const products = await client.getProducts(createdGte);
    this.logger.info(`Found ${products.length} products to sync`);
    if (products.length === 0) {
      this.logger.info("No products to sync. Exiting.");
      await this.cronState.set({ lastRun: new Date() });
      return;
    }
    /// all product variant ids in one variable using products as start point
    const productVariantIds = products
      .map((p) => p.variants.map((v) => v.id))
      .flat();

    const existingProductVariants =
      await this.db.kencoveApiProductVariant.findMany({
        where: {
          kencoveApiAppId: this.kencoveApiApp.id,
          id: {
            in: productVariantIds,
          },
        },
      });

    /**
     * just kencove Api product variants enhanced with all data from their parent product
     */
    const enhancedProductVariants = products
      .map((p) =>
        p.variants.map((v) => ({
          ...v,
          productId: p.id,
          productName: p.name,
          countryOfOrigin: p.countryOfOrigin,
        })),
      )
      .flat();

    for (const productVariant of enhancedProductVariants) {
      const updatedAt = new Date(productVariant.updatedAt);
      const createdAt = new Date(productVariant.createdAt);
      const existingProductVariant = existingProductVariants.find(
        (p) => p.id === productVariant.id,
      );
      const normalizedProductName = normalizeStrings.productNames(
        productVariant.productName,
      );

      if (
        !existingProductVariant ||
        existingProductVariant.updatedAt < updatedAt
      ) {
        this.logger.info(
          `Syncing product variant ${productVariant.id} of product ${productVariant.productName}`,
        );

        await this.db.kencoveApiProductVariant.upsert({
          where: {
            id_kencoveApiAppId: {
              id: productVariant.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          create: {
            id: productVariant.id,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
            createdAt,
            updatedAt,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: productVariant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: productVariant.sku,
                  weight: productVariant.weight,
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                  product: {
                    connectOrCreate: {
                      where: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedProductName,
                          tenantId: this.kencoveApiApp.tenantId,
                        },
                      },
                      create: {
                        id: id.id("product"),
                        name: productVariant.productName,
                        normalizedName: normalizedProductName,
                        tenant: {
                          connect: {
                            id: this.kencoveApiApp.tenantId,
                          },
                        },
                        // TODO: country of origin parsed / validated
                      },
                    },
                  },
                },
              },
            },
          },
          update: {
            updatedAt,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: productVariant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: productVariant.sku,
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                  product: {
                    connectOrCreate: {
                      where: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedProductName,
                          tenantId: this.kencoveApiApp.tenantId,
                        },
                      },
                      create: {
                        id: id.id("product"),
                        name: productVariant.productName,
                        normalizedName: normalizedProductName,
                        tenant: {
                          connect: {
                            id: this.kencoveApiApp.tenantId,
                          },
                        },
                      },
                    },
                  },
                },
              },
              update: {
                weight: productVariant.weight,
              },
            },
          },
        });
      }
    }
  }
}
