import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoItemSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohoItemSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

  public constructor(config: ZohoItemSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
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
      try {
        await this.db.productVariant.upsert({
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
    }
    this.logger.info(`Sync finished for ${items.length} Zoho Items`);
  }
}
