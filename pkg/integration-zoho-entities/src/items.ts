import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp, ProductVariant } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { CronStateHandler } from "@eci/pkg/cronstate";

export interface ZohoItemSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoItemSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoItemSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "items",
    });
  }

  public async syncToECI() {
    // Get all Items from Zoho. We don't filter out non-active products, as we
    // might need them for older orderlines etc.
    const items = await this.zoho.item.list({});
    const tenantId = this.zohoApp.tenantId;

    this.logger.info(`Upserting ${items.length} items with the internal DB`);

    // Loop through every item and upsert the corresponding
    // product, productVariant and ZohoItem in the DB
    for (const item of items) {
      const stock = item.stock_on_hand ?? null;

      const stockBefore = await this.db.productVariant.findUnique({
        where: {
          sku_tenantId: {
            tenantId,
            sku: item.sku,
          },
        },
        select: {
          stockOnHand: true,
        },
      });

      /**
       * If the stockOnHand value is different than the one from Zoho, we pull the full product data
       */
      const stockHasChanged = stockBefore?.stockOnHand === stock ?? false;

      let eciVariant: ProductVariant | null = null;

      try {
        eciVariant = await this.db.productVariant.upsert({
          where: {
            sku_tenantId: {
              tenantId,
              sku: item.sku,
            },
          },
          update: {
            zohoItem: {
              upsert: {
                where: {
                  id_zohoAppId: {
                    id: item.item_id,
                    zohoAppId: this.zohoApp.id,
                  },
                },
                create: {
                  id: item.item_id,
                  zohoAppId: this.zohoApp.id,
                  createdAt: new Date(item.created_time),
                  updatedAt: new Date(item.last_modified_time),
                },
                update: {
                  createdAt: new Date(item.created_time),
                  updatedAt: new Date(item.last_modified_time),
                },
              },
            },
            stockOnHand: stock,
          },
          create: {
            id: id.id("variant"),
            sku: item.sku,
            tenant: {
              connect: {
                id: tenantId,
              },
            },
            zohoItem: {
              create: {
                id: item.item_id,
                createdAt: new Date(item.created_time),
                updatedAt: new Date(item.last_modified_time),
                zohoAppId: this.zohoApp.id,
              },
            },
            stockOnHand: stock,
            // It is a product variant, if we have a "group_name" in Zoho.
            // In this moment, we first have to check, if a product does already exist using the
            // group_name (which is actually a product name)
            product: {
              connectOrCreate: {
                where: {
                  normalizedName_tenantId: {
                    tenantId,
                    normalizedName: normalizeStrings.productNames(
                      item?.group_name || "",
                    ),
                  },
                },
                create: {
                  id: id.id("product"),
                  tenantId,
                  // If this is a single variant product, we set the variant name as
                  // the product name
                  name: item?.group_name || item.name,
                  normalizedName: normalizeStrings.productNames(
                    item?.group_name || item.name,
                  ),
                },
              },
            },
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            this.logger.error(
              `Prisma unique constrained failed for product ${item.item_id} - SKU ${item.sku}`,
            );
            continue;
          }
        } else {
          throw new Error(JSON.stringify(e));
        }
      }

      if (stockHasChanged && eciVariant) {
        this.logger.info(
          `Pulling full item details for item ${item.name} - ${item.item_id}`,
        );
        const fullItem = await this.zoho.item.get(item.item_id);

        if (!fullItem.warehouses) {
          this.logger.info(
            `Item ${item.name} - ${item.item_id} has no stock data given. Don't update stocks`,
          );
          continue;
        }

        for (const stocks of fullItem.warehouses) {
          const zohoWarehouse = await this.db.zohoWarehouse.findUnique({
            where: {
              id_zohoAppId: {
                id: stocks.warehouse_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          });
          if (!zohoWarehouse?.id) {
            this.logger.error(
              // eslint-disable-next-line max-len
              `No internal Zoho Warehouse with id ${stocks.warehouse_id} - ${stocks.warehouse_name} found!`,
            );
            continue;
          }
          const eciWarehouseId = zohoWarehouse?.warehouseId;

          await this.db.stockEntries.upsert({
            where: {
              warehouseId_productVariantId_tenantId: {
                warehouseId: eciWarehouseId,
                productVariantId: eciVariant.id,
                tenantId: this.zohoApp.tenantId,
              },
            },
            create: {
              id: id.id("stockEntry"),
              warehouse: {
                connect: {
                  id: eciWarehouseId,
                },
              },
              // eslint-disable-next-line prettier/prettier
              actualAvailableForSaleStock:
                stocks.warehouse_actual_available_for_sale_stock,
              actualAvailableStock: stocks.warehouse_actual_available_stock,
              actualCommittedStock: stocks.warehouse_actual_committed_stock,
              tenant: {
                connect: {
                  id: this.zohoApp.tenantId,
                },
              },
              productVariant: {
                connect: {
                  id: eciVariant.id,
                },
              },
            },
            update: {
              // eslint-disable-next-line prettier/prettier
              actualAvailableForSaleStock:
                stocks.warehouse_actual_available_for_sale_stock,
              actualAvailableStock: stocks.warehouse_actual_available_stock,
              actualCommittedStock: stocks.warehouse_actual_committed_stock,
            },
          });
        }
      }
    }
    this.logger.info(`Sync finished for ${items.length} Zoho Items`);
    this.cronState.set({ lastRun: new Date(), lastRunStatus: "success" });
  }
}
