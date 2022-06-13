import { ILogger } from "@eci/pkg/logger";
import { SaleorEntitySyncProductsQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface SaleorProductSyncServiceConfig {
  saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
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
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorProductSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorApp.id,
      db: this.db,
      syncEntity: "items",
    });
  }

  /**
   * Recursively query saleor for products
   * @param cursor
   * @param results
   * @returns
   */
  private async queryWithPagination(
    cursor: string = "",
    results: SaleorEntitySyncProductsQuery = {},
  ): Promise<SaleorEntitySyncProductsQuery> {
    const result = await this.saleorClient.saleorEntitySyncProducts({
      first: 10,
      after: cursor,
      channel: this.channelSlug,
    });
    if (
      !result.products?.pageInfo.hasNextPage ||
      !result.products.pageInfo.endCursor
    ) {
      return result;
    }
    result.products.edges.map((product) =>
      results.products?.edges.push(product),
    );
    return this.queryWithPagination(
      result.products.pageInfo.endCursor,
      results,
    );
  }

  public async syncToECI(): Promise<void> {
    const response = await this.queryWithPagination();

    const products = response.products?.edges.map((x) => x.node);

    if (!products) {
      this.logger.info("No products returned from saleor! Can't sync");
      return;
    }

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
        if (!variant) throw new Error("Variant empty");
        if (!variant?.sku) {
          this.logger.warn(
            `Product Variant ${variant?.id} has no SKU! Cant't sync`,
          );
        }

        await this.db.saleorProductVariant.upsert({
          where: {
            id_installedSaleorAppId: {
              id: variant.id,
              installedSaleorAppId: this.installedSaleorApp.id,
            },
          },
          create: {
            id: variant!.id,
            productId: product.id,
            updatedAt: product.updatedAt,
            installedSaleorApp: {
              connect: {
                id: this.installedSaleorApp.id,
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
                  sku: variant.sku,
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
          },
        });
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
