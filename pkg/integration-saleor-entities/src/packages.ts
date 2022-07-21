/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
  queryWithPagination,
  SaleorCronPackagesOverviewQuery,
  SaleorCreatePackageMutation,
  OrderFulfillInput,
  OrderFulfillLineInput,
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
    saleorCreatePackage: (variables: {
      order: string;
      input: OrderFulfillInput;
    }) => Promise<SaleorCreatePackageMutation>;
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
    saleorCreatePackage: (variables: {
      order: string;
      input: OrderFulfillInput;
    }) => Promise<SaleorCreatePackageMutation>;
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

  private async upsertSaleorPackage(
    saleorPackageId: string,
    internalPackageId: string,
    createdAt: Date,
  ): Promise<void> {
    await this.db.saleorPackage.upsert({
      where: {
        id_installedSaleorAppId: {
          id: saleorPackageId,
          installedSaleorAppId: this.installedSaleorAppId,
        },
      },
      create: {
        id: saleorPackageId,
        createdAt,
        package: {
          connect: {
            id: internalPackageId,
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
            id: internalPackageId,
          },
        },
      },
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
      createdGte = format(subYears(now, 2), "yyyy-MM-dd");
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
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

      let existingPackageId = "";

      if (!parcel.trackingNumber) {
        this.logger.info(
          `Saleor fulfillment ${parcel.id} for order ${parcel.order.id} has no tracking number attached. We maybe can't match it correctly`,
        );

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
          include: {
            packages: true,
          },
        });

        // If we don't have a tracking number, but an order with just one package attached,
        // We just assume, that this is the right package and match it
        if (orderExist && orderExist.packages.length === 1) {
          const thisPackage = orderExist.packages[0];
          existingPackageId = thisPackage.id;
          this.logger.info(
            `Connecting saleor fulfillment ${parcel.id} with order ${orderExist.orderNumber} - Package number ${thisPackage.id}`,
          );
        }
      }

      // look-up packages by tracking number to connect them with this
      // saleor fulfillment.
      const existingPackage =
        existingPackageId ||
        (
          await this.db.package.findFirst({
            where: {
              trackingId: parcel.trackingNumber,
              tenantId: this.tenantId,
            },
          })
        )?.id;
      if (!existingPackage) {
        this.logger.info(
          `We can't find an internal Package entity for tracking number ${parcel.trackingNumber} - Skipping creation`,
        );
        continue;
      }

      await this.upsertSaleorPackage(
        parcel.id,
        existingPackage,
        parcel.created,
      );
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
            // Orders, that have a related saleorOrder
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
      // include the warehouse information from every line item
      // but filter the saleor warehouses to just the one we need
      include: {
        lineItems: {
          include: {
            warehouse: {
              include: {
                saleorWarehouse: {
                  where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
        },
      },
    });
    this.logger.info(
      `Received ${
        packagesNotYetInSaleor.length
      } orders that have a package and are saleor orders: ${packagesNotYetInSaleor
        .map((p) => p.orderId)
        .join(",")}`,
    );

    for (const parcel of packagesNotYetInSaleor) {
      if (!parcel.lineItems) {
        this.logger.error(
          `No line_items for package ${parcel.id} - ${parcel.number}. Can't create package in Saleor`,
        );
        continue;
      }

      const saleorOrder = await this.db.saleorOrder.findFirst({
        where: {
          orderId: parcel.orderId,
          installedSaleorAppId: this.installedSaleorAppId,
        },
        include: {
          order: {
            include: {
              lineItems: {
                include: {
                  // To create a fulfillment in Saleor, we need the
                  // ID of the orderLine
                  saleorLineItem: {
                    where: {
                      installedSaleorAppId: this.installedSaleorAppId,
                    },
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!saleorOrder) {
        this.logger.error(
          `Can't create fulfillment for order ${parcel.orderId} as we have no corresponding saleorOrder!`,
        );
        continue;
      }

      /**
       * False if any of the lineItems of this package are missing the information
       * on the warehouse.
       */
      const warehouseCheck = parcel.lineItems.some((i) => {
        if (!i.warehouseId || !i.warehouse?.saleorWarehouse?.[0]?.id) {
          return false;
        }
        return true;
      });
      if (!warehouseCheck) {
        this.logger.error(
          `Can't create fulfillment in saleor. Warehouse or SaleorWarehouse is missing for (some) line items of package ${parcel.id} - ${parcel.number}`,
        );
      }

      const lines: OrderFulfillLineInput[] = parcel.lineItems.map(
        (packageOrderLine) => {
          // Get the corresponding order to this package and lookup the saleor Order Line
          // using the product SKU
          const orderLineId = saleorOrder.order.lineItems.find(
            (item) => item.sku === packageOrderLine.sku,
          )?.saleorLineItem[0]?.id;
          if (!orderLineId) {
            this.logger.error(
              `Can't find a saleor orderLine for order ${
                saleorOrder.orderNumber
              }, LineItem SKU ${
                packageOrderLine.sku
              } - Can't create fulfillment in saleor. Orderlines: ${JSON.stringify(
                saleorOrder.order.lineItems,
              )}`,
            );
          }
          return {
            // The OrderLine ID of the saleor order
            orderLineId,
            stocks: [
              {
                warehouse: packageOrderLine.warehouse?.saleorWarehouse[0].id as string,
                quantity: packageOrderLine.quantity,
              },
            ],
          };
        },
      );
      // Continue, if the lines array is missing the orderline Id
      const fulfillmentLinesCheck = lines.every((i) => {
        if (!i.orderLineId) return false;
        return true;
      });
      if (!fulfillmentLinesCheck) continue;

      this.logger.info(`Line Item: ${JSON.stringify(lines)}`);

      const response = await this.saleorClient.saleorCreatePackage({
        order: saleorOrder.id,
        input: {
          lines,
        },
      });

      // Catch all mutation errors and handle them correctly
      if (
        response.orderFulfill?.errors ||
        !response.orderFulfill?.fulfillments
      ) {
        response.orderFulfill?.errors.map((e) => {
          if (
            e.code === "FULFILL_ORDER_LINE" &&
            e.message?.includes("Only 0 items remaining to fulfill")
          ) {
            this.logger.info(
              `Saleor orderline ${e.orderLines} from order ${saleorOrder.orderNumber} - ${saleorOrder.id}  is already fulfilled: ${e.message}. Continue`,
            );
          } else {
            throw new Error(JSON.stringify(e));
          }
          return true;
        });
      } else {
        for (const fulfillment of response.orderFulfill?.fulfillments) {
          if (!fulfillment?.id)
            throw new Error(`Fulfillment id missing for ${saleorOrder.id}`);
          await this.upsertSaleorPackage(
            fulfillment?.id,
            parcel.id,
            fulfillment?.created,
          );
        }
      }
    }
  }
}
