/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
  queryWithPagination,
  SaleorCronPackagesOverviewQuery,
} from "@eci/pkg/saleor";
import { PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";

interface SaleorPackageSyncServiceConfig {
  saleorClient: {
    saleorCronPackagesOverview: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPackagesOverviewQuery>;
  };
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
  orderPrefix: string;
}

export class SaleorPackageSyncService {
  public readonly saleorClient: {
    saleorCronPackagesOverview: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPackagesOverviewQuery>;
  };

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly orderPrefix: string;

  public constructor(config: SaleorPackageSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.orderPrefix = config.orderPrefix;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "packages",
    });
  }

  /**
   * Pull payment metadata from braintree
   */
  //   private async braintreeGetPaymentDetails() {}

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

    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronPackagesOverview({
        first,
        after,
        createdGte,
      }),
    );

    const parcels = result.orders?.edges
      .map((order) => order.node)
      .map((x) => {
        return x.fulfillments.map((ful) => {
          return { ...ful, order: { id: x.id, number: x.number } };
        });
      })
      .flat();

    if (!result.orders || result.orders.edges.length === 0 || !parcels) {
      this.logger.info(
        "Saleor returned no orders with fulfillments. Don't sync anything",
      );
      return;
    }
    this.logger.info(`Syncing ${parcels?.length} packages`);

    for (const parcel of parcels) {
      if (!parcel || !parcel?.id) continue;
      if (!parcel?.order?.id) {
        this.logger.warn(
          `Can't sync saleor fulfillment ${parcel.id} - No related order id given`,
        );
        continue;
      }
      const order = parcel.order;
      if (typeof order.number !== "string") continue;

      /**
       * The full order number including prefix
       */
      const prefixedOrderNumber = `${this.orderPrefix}-${order.number}`;

      const orderExist = await this.db.order.findUnique({
        where: {
          orderNumber_tenantId: {
            orderNumber: prefixedOrderNumber,
            tenantId: this.tenantId,
          },
        },
      });

      if (orderExist)
        this.logger.info(
          `Connecting saleor fulfillment ${parcel.id} with order ${orderExist.orderNumber} - id ${orderExist.id}`,
        );

      // look-up packages by tracking number to connect them with this
      // saleor fulfillment.
      const existingPackage = await this.db.package.findFirst({
        where: {
          trackingId: parcel.trackingNumber,
          tenantId: this.tenantId,
        },
      });
      if (!existingPackage) {
        this.logger.info(
          `We can't find an internal Package entity for tracking number ${parcel.trackingNumber} - Skipping creation`,
        );
        continue;
      }

      await this.db.saleorPackage.upsert({
        where: {
          id_installedSaleorAppId: {
            id: parcel.id,
            installedSaleorAppId: this.installedSaleorAppId,
          },
        },
        create: {
          id: parcel.id,
          createdAt: parcel.created,
          package: {
            connect: {
              id: existingPackage.id,
            },
          },
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorAppId,
            },
          },
        },
        update: {
          package: {
            connect: {
              id: existingPackage.id,
            },
          },
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  /**
   * Should be run AFTER syncToECI() - all orders with a related SaleorOrder
   * and related payments. Tries to create these payments in saleor
   */
  public async syncFromECI(): Promise<void> {
    /**
     * We search all packages that have a related saleor order, but that don't have any related packages in saleor,
     * but related packages in our DB.
     */
    const packagesNotYetInSaleor = await this.db.package.findMany({
      where: {
        AND: [
          {
            order: {
              saleorOrders: {
                some: {
                  installedSaleorAppId: {
                    contains: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
          {
            saleorPackage: {
              none: {
                installedSaleorAppId: {
                  contains: this.installedSaleorAppId,
                },
              },
            },
          },
        ],
      },
    });
    this.logger.info(
      `Received ${
        packagesNotYetInSaleor.length
      } orders that have a package and are saleor orders: ${packagesNotYetInSaleor
        .map((p) => p.orderId)
        .join(",")}`,
    );

    // for (const payment of paymentsNotYetInSaleor) {

    //   // Pull current order data from saleor - only capture payment, if payment
    //   // does not exit yet. Uses the orderCapture mutation from saleor

    // }
  }
}
