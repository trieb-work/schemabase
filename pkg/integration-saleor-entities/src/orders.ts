/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
  SaleorCronOrdersOverviewQuery,
  SaleorCronOrdersDetailsQuery,
  PageInfoMetaFragment,
} from "@eci/pkg/saleor";
import { InstalledSaleorApp, PrismaClient, Tenant } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { setHours, subDays, subYears, format } from "date-fns";
import { id } from "@eci/pkg/ids";
// import { id } from "@eci/pkg/ids";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorCronOrdersDetails: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };
  channelSlug: string;
  installedSaleorApp: InstalledSaleorApp;
  tenant: Tenant;
  db: PrismaClient;
  logger: ILogger;
}


type PagedSaleorResult<ResultNode, EntryName extends string> = Record<EntryName, {
  pageInfo: PageInfoMetaFragment
  edges: Array<{
    node: ResultNode;
  }>;
}>
type PagedSaleorQuery<ResultNode, EntryName extends string> = PagedSaleorResult<ResultNode, EntryName> | {
  __typename?: "Query";
};

export class SaleorOrderSyncService {
  public readonly saleorClient: {
    saleorCronOrdersDetails: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
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
  private async queryWithPagination<EntryName extends string, SpecificPagedSaleorQuery extends PagedSaleorQuery<ResultNode, EntryName>, ResultNode = any>(
    client: (cursor: {
      first: number;
      after: string;
    }) => Promise<SpecificPagedSaleorQuery>,
    first: number = 100,
  ): Promise<SpecificPagedSaleorQuery> {
    const recQueryWithPagination = async (firstInner: number, after: string, resultAkkumulator?: PagedSaleorResult<ResultNode, EntryName>): Promise<PagedSaleorResult<ResultNode, EntryName>> => {
      const res = await client({first: firstInner, after});
      const resultEntries = Object.entries(res).filter(([key]) => key !== "__typename") as Array<[EntryName, PagedSaleorResult<ResultNode, EntryName>[EntryName]]>;
      if(resultEntries.length > 1) throw new Error(`Only one result entrie is allowed. Used following entries: ${Object.keys(res)}`);
      if(resultEntries.length === 0) throw new Error(`No result entrie provided. Used following entries: ${Object.keys(res)}`);
      const [singleEntryKey, singleEntryValue] = resultEntries[0];
      let newResultAkkumulator: PagedSaleorResult<ResultNode, EntryName> | undefined = resultAkkumulator;
      if(typeof newResultAkkumulator === "undefined"){
        newResultAkkumulator = { [singleEntryKey]: singleEntryValue } as PagedSaleorResult<ResultNode, EntryName>;
      } else {
        newResultAkkumulator[singleEntryKey].edges = newResultAkkumulator[singleEntryKey].edges.concat(singleEntryValue.edges);
      }
      if(singleEntryValue.pageInfo.hasNextPage) {
        if(!singleEntryValue.pageInfo.endCursor) throw new Error(`No endCursor provided by query result. res: ${res}`);
        return recQueryWithPagination(firstInner, singleEntryValue.pageInfo.endCursor,  newResultAkkumulator)
      }
      return newResultAkkumulator;
    }
    return recQueryWithPagination(first, "") as Promise<SpecificPagedSaleorQuery>;
  }

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let createdGte = format(yesterdayMidnight, "yyyy-MM-dd");
    if (!cronState.lastRun) {
      createdGte = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Year to: ${createdGte}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${createdGte}`);
    }
    const result = await this.queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronOrdersOverview({ first, after, createdGte, channel: this.channelSlug }),
    );


    if (!result.orders || result.orders.edges.length === 0) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
      return;
    }
    const orders = result.orders.edges.map((order) => order.node);

    this.logger.info(`Working on ${orders.length} orders`);

    for (const order of orders) {
      if (!order.number || typeof (order.number) === "undefined") {
        this.logger.error(`No orderNumber in order ${order.id} - Can't sync`)
        continue;
      }
      await this.db.saleorOrder.upsert({
        where: {
          id_installedSaleorAppId: {
            id: order.id,
            installedSaleorAppId: this.installedSaleorApp.id
          }
        },
        create: {
          id: order.id,
          installedSaleorApp: { 
            connect: {
              id: this.installedSaleorApp.id
            }
          },
          createdAt: order.created,
          order: {
            connectOrCreate: {
              where: {
                orderNumber_tenantId: {
                  orderNumber: order.number,
                  tenantId: this.tenant.id,
                },
              }, 
              create: {
                id: id.id("order"),
                orderNumber: order.number,
                tenant: {
                  connect: {
                    id: this.tenant.id
                  }
                }
              }
            }
          }
        },
        update: {}
      })
    }
  }
}
