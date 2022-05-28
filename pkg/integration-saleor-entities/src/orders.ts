import { ILogger } from "@eci/pkg/logger";
import { SaleorEntitySyncProductsQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel: string;
      after: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorOrderSyncService {
  public readonly saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel: string;
      after: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorOrderSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenant = config.tenant;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.tenant.id,
      appId: this.installedSaleorApp.id,
      db: this.db,
      syncEntity: "orders",
    });
  }

  public async syncToECI(): Promise<void> {}
}
