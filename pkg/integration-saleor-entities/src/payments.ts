import { ILogger } from "@eci/pkg/logger";
import { SaleorCronPaymentsQuery } from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { setHours, subDays, subYears } from "date-fns";
// import { id } from "@eci/pkg/ids";

interface SaleorPaymentSyncServiceConfig {
  saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: Date;
    }) => Promise<SaleorCronPaymentsQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorPaymentSyncService {
  public readonly saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: Date;
    }) => Promise<SaleorCronPaymentsQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorApp: InstalledSaleorApp;

  public readonly tenant: Tenant;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorPaymentSyncServiceConfig) {
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
      syncEntity: "payments",
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
    results: SaleorCronPaymentsQuery = {},
  ): Promise<SaleorCronPaymentsQuery> {
    const result = await this.saleorClient.saleorCronPayments({
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

  /**
   * Pull payment metadata from braintree
   */
  //   private async braintreeGetPaymentDetails() {}

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let gteDate = yesterdayMidnight;
    if (!cronState.lastRun) {
      gteDate = subYears(now, 1);
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Year to: ${gteDate.toISOString()}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${yesterdayMidnight.toISOString}`);
    }

    const result = await this.queryWithPagination(gteDate);

    if (!result.orders || result.orders.edges.length === 0) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
    }
  }
}
