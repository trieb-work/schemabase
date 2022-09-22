import { ILogger } from "@eci/pkg/logger";
import {
  ProductVariantStockEntryUpdateMutation,
  queryWithPagination,
  SaleorEntitySyncProductsQuery,
  SaleorProductVariantStocksQuery,
  StockInput,
} from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
// import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";

interface SaleorProductSyncServiceConfig {
  saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantStocks: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantStocksQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
  };
  channelSlug: string;
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
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantStocks: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantStocksQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
  };

  public readonly channelSlug: string;

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
    const response = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorEntitySyncProducts({
        first,
        after,
        channel: this.channelSlug,
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
        try{
          if (!variant) {
            throw new Error("Variant empty");
          }
          if (!variant?.sku) {
            throw new Error(`Product Variant ${variant?.id} has no SKU! Aborting sync`);
          }
          if(!variant?.stocks || variant.stocks.length === 0){
            throw new Error(`Product Variant has no stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`);
          }
          if(variant?.stocks?.length > 1){
            throw new Error(`Product Variant has multiple stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`);
          }
          if(!variant.stocks?.[0]?.warehouse?.name){
            throw new Error(`First Warehouse of Product Variant (the default warehouse) has no name set. Aborting sync.`);
          }
          const normalizedDefaultWarehouseName = normalizeStrings.warehouseNames(variant.stocks?.[0]?.warehouse.name);
  
          /**
           * The product variants EAN-13 number. Stored as metadata field in Saleor
           */
          const ean = variant.metadata.find((meta) => meta?.key === "EAN")?.value;
  
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
                    // TODO: does it make sense to set stock entries here as well
                    id: id.id("variant"),
                    defaultWarehouse: {
                      connect: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedDefaultWarehouseName,
                          tenantId: this.tenantId,
                        }
                      }
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
                        }
                      }
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
                      }
                    }
                  },
                  ean,
                },
              },
            },
          });
          this.logger.debug("Successfully synced", defaultLogFields);
        } catch (err) {
          if (err instanceof Warning) {
            this.logger.warn(err.message, { ...defaultLogFields, stack: err.stack });
          } else if (err instanceof Error) {
            // if(err.name)
            if(err instanceof PrismaClientKnownRequestError){
              if(err.code === "P2025" && (err?.meta?.cause as string).includes("No 'Warehouse' record")){
                this.logger.warn("Warehouse for defaultwarehouse relation is missing. Aborting sync. Should retry after rerun of Saleor Warehouse sync.");
              }
            } else {
              this.logger.error(err.message, { ...defaultLogFields, stack: err.stack });
            }
          } else {
            this.logger.error(
              "An unknown Error occured during product-variant sync loop: " + (err as any)?.toString(),
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
    const saleorProducts = await this.db.saleorProductVariant.findMany({
      where: {
        installedSaleorApp: {
          id: this.installedSaleorAppId,
        },
      },
      select: {
        id: true,
        productVariant: {
          include: {
            stockEntries: true,
          },
        },
      },
    });
    if (saleorProducts.length === 0) {
      this.logger.info(
        "We have no saleor products in our DB. Returning nothing",
      );
      return;
    }

    this.logger.info(
      `Setting stock level for ${saleorProducts.length} saleor products`,
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

    for (const variant of saleorProducts) {
      // Get the current commited stock of this product variant from saleor
      const saleorProductVariant =
        await this.saleorClient.saleorProductVariantStocks({
          id: variant.id,
        });
      if (
        !saleorProductVariant ||
        !saleorProductVariant.productVariant?.id ||
        !saleorProductVariant.productVariant.stocks
      ) {
        this.logger.warn(
          `No product variant returned from saleor for id ${variant.id}! Cant update stocks`,
        );
        continue;
      }

      // loop over all stock entries that we have and bring them to saleor
      for (const stockEntry of variant.productVariant.stockEntries) {
        // Check, if we have a saleor warehouse for this stock entry.
        // If not continue.
        const saleorWarehouseId = warehouses.find(
          (saleorWarehouse) =>
            saleorWarehouse.warehouseId === stockEntry.warehouseId,
        )?.id;
        if (!saleorWarehouseId) {
          this.logger.info(
            `No saleor warehouse for ECI warehouse ${stockEntry.warehouseId}`,
          );
          continue;
        }
        // TODO: add the current commited stock of saleor to the available stock
        const totalQuantity = stockEntry.actualAvailableForSaleStock;
        await this.saleorClient.productVariantStockEntryUpdate({
          variantId: variant.id,
          stocks: [
            {
              warehouse: saleorWarehouseId,
              quantity: totalQuantity,
            },
          ],
        });
      }
    }
  }
}
