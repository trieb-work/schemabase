import { Zoho } from "@trieb.work/zoho-ts/dist/v2";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

export interface ZohoTaxSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoTaxSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  public constructor(config: ZohoTaxSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
  }

  public async syncToECI() {
    // Get all active Items from Zoho
    const taxes = await this.zoho.tax.list();
    const tenantId = this.zohoApp.tenantId;

    // Loop through every item and upsert the corresponding
    // product, productVariant and ZohoItem in the DB
    for (const tax of taxes) {
      const normalizedTaxName = normalizeStrings.taxNames(tax.tax_name);

      const taxCreateOrConnect = {
        connectOrCreate: {
          where: {
            normalizedName_tenantId: {
              tenantId,
              normalizedName: normalizedTaxName,
            },
          },
          create: {
            id: id.id("tax"),
            name: tax.tax_name,
            normalizedName: normalizedTaxName,
            percentage: tax.tax_percentage,
            tenant: {
              connect: {
                id: tenantId,
              },
            },
          },
        },
      };

      await this.db.zohoTax.upsert({
        where: {
          id_zohoAppId: {
            zohoAppId: this.zohoApp.id,
            id: tax.tax_id,
          },
        },
        create: {
          id: tax.tax_id,
          tax: taxCreateOrConnect,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
        },
        update: {
          tax: taxCreateOrConnect,
        },
      });
    }
    this.logger.info(`Sync finished for ${taxes.length} Zoho Taxes`);
  }
}
