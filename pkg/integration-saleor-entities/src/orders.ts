import { ILogger } from "@eci/pkg/logger";
import { SaleorCronOrdersQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
// import { id } from "@eci/pkg/ids";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorCronOrders: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: Date;
    }) => Promise<SaleorCronOrdersQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorOrderSyncService {
  public readonly saleorClient: {
    saleorCronOrders: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: Date;
    }) => Promise<SaleorCronOrdersQuery>;
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

  /**
   * Recursively query saleor for orders
   * @param cursor
   * @param results
   * @returns
   */
  private async queryWithPagination(
    createdGte: Date,
    cursor: string = "",
    results: SaleorCronOrdersQuery = {},
  ): Promise<SaleorCronOrdersQuery> {
    const result = await this.saleorClient.saleorCronOrders({
      first: 50,
      after: cursor,
      channel: this.channelSlug,
      createdGte,
    });
    if (
      !result.orders?.pageInfo.hasNextPage ||
      !result.orders.pageInfo.endCursor
    ) {
      return result;
    }
    result.orders.edges.map((order) => results.orders?.edges.push(order));
    return this.queryWithPagination(
      createdGte,
      result.orders.pageInfo.endCursor,
      results,
    );
  }

  public async syncToECI(): Promise<void> {
    await this.cronState.get();
    const result = await this.queryWithPagination(new Date());

    if (!result.orders || result.orders.edges.length === 0) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
    }
  }
}
