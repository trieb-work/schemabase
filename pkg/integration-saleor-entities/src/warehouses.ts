import { ILogger } from "@eci/pkg/logger";
import { WarehousesQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";

interface SaleorWarehouseSyncServiceConfig {
  saleorClient: {
    warehouses: (variables: {
      first: number;
      channel: string;
    }) => Promise<WarehousesQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorWarehouseSyncService {
  public readonly saleorClient: {
    warehouses: (variables: {
      first: number;
      channel: string;
    }) => Promise<WarehousesQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly db: PrismaClient;

  public constructor(config: SaleorWarehouseSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenant = config.tenant;
    this.db = config.db;
  }

  public async syncToECI(): Promise<void> {
    const response = await this.saleorClient.warehouses({
      first: 100,
      channel: this.channelSlug,
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
      const warehouseCreateOrConnect = {
        connectOrCreate: {
          where: {
            name_tenantId: {
              name: warehouse.name,
              tenantId: this.tenant.id,
            },
          },
          create: {
            id: id.id("warehouse"),
            name: warehouse.name,
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
