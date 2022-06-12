import { ILogger } from "@eci/pkg/logger";
import { WarehousesQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";

interface SaleorWarehouseSyncServiceConfig {
  saleorClient: {
    warehouses: (variables: { first: number }) => Promise<WarehousesQuery>;
  };
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorWarehouseSyncService {
  public readonly saleorClient: {
    warehouses: (variables: { first: number }) => Promise<WarehousesQuery>;
  };

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly db: PrismaClient;

  public constructor(config: SaleorWarehouseSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenant = config.tenant;
    this.db = config.db;
  }

  public async syncToECI(): Promise<void> {
    const response = await this.saleorClient.warehouses({
      first: 100,
    });

    if (
      !response.warehouses?.edges ||
      response.warehouses?.edges.length === 0
    ) {
      this.logger.info("Got no warehouses from saleor. Can't sync");
      return;
    }

    const warehouses = response.warehouses?.edges.map((x) => x.node);
    this.logger.info(`Syncing ${warehouses?.length}`);

    for (const warehouse of warehouses) {
      const normalizedWarehouseName = normalizeStrings.warehouseNames(
        warehouse.name,
      );

      const warehouseCreateOrConnect = {
        connectOrCreate: {
          where: {
            normalizedName_tenantId: {
              normalizedName: normalizedWarehouseName,
              tenantId: this.tenant.id,
            },
          },
          create: {
            id: id.id("warehouse"),
            name: warehouse.name,
            normalizedName: normalizedWarehouseName,
            tenant: {
              connect: {
                id: this.tenant.id,
              },
            },
          },
        },
      };

      await this.db.saleorWarehouse.upsert({
        where: {
          id_installedSaleorAppId: {
            id: warehouse.id,
            installedSaleorAppId: this.installedSaleorApp.id,
          },
        },
        create: {
          id: warehouse.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },
          warehouse: warehouseCreateOrConnect,
        },
        update: {
          warehouse: warehouseCreateOrConnect,
        },
      });
    }
  }
}
