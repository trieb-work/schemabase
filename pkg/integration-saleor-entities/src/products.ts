/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
  ProductVariantStockEntryUpdateMutation,
  queryWithPagination,
  SaleorEntitySyncProductsQuery,
  SaleorProductVariantBasicDataQuery,
  SaleorUpdateMetadataMutation,
  StockInput,
} from "@eci/pkg/saleor";
import { PrismaClient, Prisma } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { subHours, subYears } from "date-fns";

interface SaleorProductSyncServiceConfig {
  saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
      updatedAtGte?: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantBasicData: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantBasicDataQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
    saleorUpdateMetadata: (variables: {
      id: string;
      input: {
        key: string;
        value: string;
        __typename?: "MetadataItem" | undefined;
      }[];
    }) => Promise<SaleorUpdateMetadataMutation>;
  };
  channelSlug?: string;
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorProductSyncService {
  public readonly saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
      updatedAtGte?: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantBasicData: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantBasicDataQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
    saleorUpdateMetadata: (variables: {
      id: string;
      input: {
        key: string;
        value: string;
        __typename?: "MetadataItem" | undefined;
      }[];
    }) => Promise<SaleorUpdateMetadataMutation>;
  };

  public readonly channelSlug?: string;

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorProductSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "items",
    });
  }

  public async syncToECI(): Promise<void> {
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
    const response = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorEntitySyncProducts({
        first,
        after,
        channel: this.channelSlug,
        updatedAtGte: createdGte.toISOString(),
      }),
    );

    const products = response.products?.edges.map((x) => x.node);

    if (!products) {
      this.logger.info("No products returned from saleor! Aborting sync");
      return;
    }

    this.logger.info(`Syncing ${products.length} products`);

    for (const product of products) {
      if (!product.variants) {
        this.logger.warn(
          // eslint-disable-next-line max-len
          `No variants returned for product ${product.id} There should be minimum one variant per product.`,
        );
        continue;
      }

      const normalizedProductName = normalizeStrings.productNames(product.name);

      for (const variant of product.variants) {
        const defaultLogFields = {
          variantId: variant?.id,
          variantSku: variant?.sku,
          variantName: variant?.name,
          productId: product.id,
          productName: product.name,
        };
        try {
          if (!variant) {
            throw new Error("Variant empty");
          }
          if (!variant?.sku) {
            throw new Error(
              `Product Variant ${variant?.id} has no SKU! Aborting sync`,
            );
          }
          if (!variant?.stocks || variant.stocks.length === 0) {
            throw new Error(
              `Product Variant has no stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`,
            );
          }
          if (variant?.stocks?.length > 1) {
            throw new Error(
              `Product Variant has multiple stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`,
            );
          }
          if (!variant.stocks?.[0]?.warehouse?.name) {
            throw new Error(
              `First Warehouse of Product Variant (the default warehouse) has no name set. Aborting sync.`,
            );
          }
          const normalizedDefaultWarehouseName =
            normalizeStrings.warehouseNames(
              variant.stocks?.[0]?.warehouse.name,
            );

          /**
           * The product variants EAN-13 number. Stored as metadata field in Saleor
           */
          const ean = variant.metadata.find(
            (meta) => meta?.key === "EAN",
          )?.value;

          await this.db.saleorProductVariant.upsert({
            where: {
              id_installedSaleorAppId: {
                id: variant.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
            create: {
              id: variant!.id,
              productId: product.id,
              updatedAt: product.updatedAt,
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
              productVariant: {
                connectOrCreate: {
                  where: {
                    sku_tenantId: {
                      sku: variant.sku,
                      tenantId: this.tenantId,
                    },
                  },
                  create: {
                    id: id.id("variant"),
                    defaultWarehouse: {
                      connect: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedDefaultWarehouseName,
                          tenantId: this.tenantId,
                        },
                      },
                    },
                    sku: variant.sku,
                    variantName: variant.name,
                    ean,
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                    product: {
                      connectOrCreate: {
                        where: {
                          normalizedName_tenantId: {
                            normalizedName: normalizedProductName,
                            tenantId: this.tenantId,
                          },
                        },
                        create: {
                          id: id.id("product"),
                          tenant: {
                            connect: {
                              id: this.tenantId,
                            },
                          },
                          name: product.name,
                          normalizedName: normalizedProductName,
                        },
                      },
                    },
                  },
                },
              },
            },
            update: {
              updatedAt: product.updatedAt,
              productId: product.id,
              productVariant: {
                connectOrCreate: {
                  where: {
                    sku_tenantId: {
                      sku: variant.sku,
                      tenantId: this.tenantId,
                    },
                  },
                  create: {
                    // TODO: does it make sense to set stock entries here as well
                    id: id.id("variant"),
                    defaultWarehouse: {
                      connect: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedDefaultWarehouseName,
                          tenantId: this.tenantId,
                        },
                      },
                    },
                    sku: variant.sku,
                    variantName: variant.name,
                    ean,
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                    product: {
                      connectOrCreate: {
                        where: {
                          normalizedName_tenantId: {
                            normalizedName: normalizedProductName,
                            tenantId: this.tenantId,
                          },
                        },
                        create: {
                          id: id.id("product"),
                          tenant: {
                            connect: {
                              id: this.tenantId,
                            },
                          },
                          name: product.name,
                          normalizedName: normalizedProductName,
                        },
                      },
                    },
                  },
                },
                update: {
                  variantName: variant.name,
                  sku: variant.sku,
                  // TODO: does it make sense to update stock entries here as well
                  defaultWarehouse: {
                    connect: {
                      normalizedName_tenantId: {
                        normalizedName: normalizedDefaultWarehouseName,
                        tenantId: this.tenantId,
                      },
                    },
                  },
                  ean,
                },
              },
            },
          });
          this.logger.debug("Successfully synced", defaultLogFields);
        } catch (err) {
          if (err instanceof Warning) {
            this.logger.warn(err.message, {
              ...defaultLogFields,
              stack: err.stack,
            });
          } else if (err instanceof Error) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
              if (
                err.code === "P2025" &&
                (err?.meta?.cause as string).includes("No 'Warehouse' record")
              ) {
                this.logger.warn(
                  "Warehouse for defaultwarehouse relation is missing. Aborting sync. Should retry after rerun of Saleor Warehouse sync.",
                );
              }
            } else {
              this.logger.error(err.message, {
                ...defaultLogFields,
                stack: err.stack,
              });
            }
          } else {
            this.logger.error(
              "An unknown Error occured during product-variant sync loop: " +
                (err as any)?.toString(),
              defaultLogFields,
            );
          }
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
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

    /**
     * get all saleor productVariants where related stockEntries have been updated since last run or where related
     * productVariants have been updated since last run
     */
    const saleorProductVariants = await this.db.saleorProductVariant.findMany({
      where: {
        OR: [
          {
            updatedAt: {
              gte: createdGte,
            },
          },
          {
            productVariant: {
              updatedAt: {
                gte: createdGte,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        productId: true,
        productVariant: {
          select: {
            id: true,
            sku: true,
            stockEntries: true,
            averageRating: true,
            ratingCount: true,
            productId: true,
          },
        },
      },
    });

    if (saleorProductVariants.length === 0) {
      this.logger.info(
        "We have no saleor products in our DB. Returning nothing",
      );
      return;
    }

    this.logger.info(
      `Working on ${saleorProductVariants.length} saleor product variants, where we have stock or review changes since the last run.`,
    );

    /**
     * All warehouses with saleor id and internal ECI id
     */
    const warehouses = await this.db.saleorWarehouse.findMany({
      where: {
        installedSaleorAppId: this.installedSaleorAppId,
      },
      select: {
        id: true,
        warehouseId: true,
      },
    });

    /**
     * A set of products, whose reviews have changed. We need this to update the average rating of the product.
     * Stores the internal ECI product id and the saleor product id.
     */
    const productsWithReviewsChanged = new Set<{
      eciProductId: string;
      saleorProductId: string;
    }>();

    for (const variant of saleorProductVariants) {
      // Get the current commited stock and the metadata of this product variant from saleor.
      // We need fresh data here, as the commited stock can change all the time.
      const saleorProductVariant =
        await this.saleorClient.saleorProductVariantBasicData({
          id: variant.id,
        });
      if (
        !saleorProductVariant ||
        !saleorProductVariant.productVariant?.id ||
        !saleorProductVariant.productVariant.stocks
      ) {
        this.logger.warn(
          `No product variant returned from saleor for id ${variant.id}! Cant update stocks.\
          Deleting variant in internal DB`,
        );
        if (variant.id)
          await this.db.saleorProductVariant.delete({
            where: {
              id_installedSaleorAppId: {
                id: variant.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          });
        continue;
      }

      // loop over all stock entries that we have and bring them to saleor
      for (const stockEntry of variant.productVariant.stockEntries) {
        // Check, if we have a saleor warehouse for this stock entry.
        // If not continue.
        const saleorWarehouse = warehouses.find(
          (saleorWarehouse) =>
            saleorWarehouse.warehouseId === stockEntry.warehouseId,
        );
        const saleorWarehouseId = saleorWarehouse?.id;
        /**
         * Just update the stock for warehouses, that we have configured in Saleor
         */
        if (!saleorWarehouseId) {
          continue;
        }
        /**
         * The stock information of the current product variant in the current warehouse
         */
        const saleorStockEntry =
          saleorProductVariant.productVariant.stocks.find(
            (x) => x?.warehouse.id === saleorWarehouseId,
          );
        const currentlyAllocated = saleorStockEntry?.quantityAllocated || 0;

        /**
         * to get the "real" available stock, we have to add the currently allocated stock from saleor
         */
        const totalQuantity =
          stockEntry.actualAvailableForSaleStock + currentlyAllocated;
        await this.saleorClient.productVariantStockEntryUpdate({
          variantId: variant.id,
          stocks: [
            {
              warehouse: saleorWarehouseId,
              quantity: totalQuantity,
            },
          ],
        });
        this.logger.debug(`Updated stock entry ${variant.id}`);
      }

      // parse the product rating from the metadata. Don't fail, when no metadata is present
      let productRating: {
        averageRating: number;
        ratingCount: number;
      } | null = null;
      try {
        const metadata = saleorProductVariant.productVariant.metadata.find(
          (x) => x.key === "customerRatings",
        );
        if (metadata) {
          productRating = JSON.parse(metadata.value);
        }
      } catch (error) {
        this.logger.info(
          `No metadata customerRatings found for ${variant.id}. Creating it now: ${error}`,
        );
      }

      if (
        !productRating?.averageRating ||
        productRating?.averageRating !== variant.productVariant.averageRating
      ) {
        if (variant.productVariant.averageRating === null) continue;
        this.logger.info(
          `Updating average rating for ${variant.id} / ${variant.productVariant.sku} to ${variant.productVariant.averageRating}`,
        );

        // adding the product to the set of products with changed reviews
        productsWithReviewsChanged.add({
          eciProductId: variant.productVariant.productId,
          saleorProductId: variant.productId,
        });

        const metadataNew: {
          __typename?: "MetadataItem" | undefined;
          key: string;
          value: string;
        }[] = saleorProductVariant.productVariant.metadata.filter(
          (x) => x.key !== "customerRatings",
        );
        metadataNew.push({
          key: "customerRatings",
          value: JSON.stringify({
            averageRating: variant.productVariant.averageRating,
            ratingCount: variant.productVariant.ratingCount,
          }),
        });
        await this.saleorClient.saleorUpdateMetadata({
          id: saleorProductVariant.productVariant.id,
          input: metadataNew,
        });
      }
    }

    // calculate the average product rating and the sum of ratings using the customer rating from all related
    // and active product variants of the current product. Just do it, if one of the reviews has changed.
    for (const productSet of productsWithReviewsChanged) {
      this.logger.info(
        `Updating average aggregated product rating for ${JSON.stringify(
          productSet,
        )}.`,
      );
      const productRatings = await this.db.productVariant.aggregate({
        where: {
          productId: productSet.eciProductId,
          active: true,
        },
        _count: {
          ratingCount: true,
        },
        _avg: {
          averageRating: true,
        },
      });

      const metadataNew = [
        {
          key: "customerRatings",
          value: JSON.stringify({
            averageRating: productRatings._avg.averageRating,
            ratingCount: productRatings._count.ratingCount,
          }),
        },
      ];
      this.logger.debug(
        `Sending this metadata: ${JSON.stringify(metadataNew)}`,
      );
      await this.saleorClient.saleorUpdateMetadata({
        id: productSet.saleorProductId,
        input: metadataNew,
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
