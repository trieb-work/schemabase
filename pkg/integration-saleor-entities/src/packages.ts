/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
    queryWithPagination,
    OrderFulfillLineInput,
    OrderStatusFilter,
    OrderSortField,
    OrderDirection,
    SaleorClient,
    MetadataInput,
} from "@eci/pkg/saleor";
import { InstalledSaleorApp, Package, PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subMonths, subYears } from "date-fns";
import { closestsMatch } from "@eci/pkg/utils/closestMatch";

interface SaleorPackageSyncServiceConfig {
    saleorClient: SaleorClient;
    installedSaleorApp: InstalledSaleorApp;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    orderPrefix: string;
}

export class SaleorPackageSyncService {
    public readonly saleorClient: SaleorClient;

    private readonly logger: ILogger;

    public readonly installedSaleorAppId: string;

    public readonly installedSaleorApp: InstalledSaleorApp;

    public readonly tenantId: string;

    private readonly cronState: CronStateHandler;

    private readonly db: PrismaClient;

    private readonly orderPrefix: string;

    public constructor(config: SaleorPackageSyncServiceConfig) {
        this.saleorClient = config.saleorClient;
        this.logger = config.logger;
        this.installedSaleorAppId = config.installedSaleorApp.id;
        this.installedSaleorApp = config.installedSaleorApp;
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
     * Store the saleor fulfillment Ids in our DB (upsert saleor package)
     * @param saleorPackageId
     * @param internalPackageId
     * @param createdAt
     */
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

    public async syncToECI(): Promise<void> {
        const cronState = await this.cronState.get();

        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for all (partially) fulfilled orders with lastUpdated GTE.`,
            );
        }

        const result = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorCronPackagesOverview({
                first,
                after,
                orderDirection: OrderDirection.Desc,
                orderSortField: OrderSortField.LastModifiedAt,
                orderStatusFilter: [
                    OrderStatusFilter.Fulfilled,
                    OrderStatusFilter.PartiallyFulfilled,
                ],
                updatedAtGte: createdGte,
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
    }

    /**
     * Take a saleor fulfillment id and update the metadata of the fulfillment
     * with current status information from the package entity from our DB
     * E.g. carrierTrackingUrl and status (delivered, in transit, etc.)
     * @param saleorFulfillmentId
     * @param parcel
     */
    public async updateFulfillmentMetadata(
        saleorFulfillmentId: string,
        parcel: Package,
    ): Promise<void> {
        const metadata: MetadataInput[] = [];

        if (parcel.state) metadata.push({ key: "state", value: parcel.state });
        if (parcel.carrierTrackingUrl)
            metadata.push({
                key: "carrierTrackingUrl",
                value: parcel.carrierTrackingUrl,
            });
        if (parcel.carrier)
            metadata.push({ key: "carrier", value: parcel.carrier });
        if (metadata.length > 0)
            await this.saleorClient.saleorUpdateMetadata({
                id: saleorFulfillmentId,
                input: metadata,
            });
        this.logger.debug(
            `Updated metadata for fulfillment ${saleorFulfillmentId} with ${JSON.stringify(
                metadata,
            )}`,
        );
    }

    /**
     * Should be run AFTER syncToECI() - all orders with a related SaleorOrder
     * and related payments. Tries to create these payments in saleor
     */
    public async syncFromECI(): Promise<void> {
        const cronState = await this.cronState.get();

        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(
                `Setting GTE date to ${createdGte}. Asking Saleor for all (partially) fulfilled orders with lastUpdated GTE.`,
            );
        }
        /**
         * We search all packages that have a related saleor order, but that don't have any related packages in saleor,
         * but related packages in our DB.
         */
        const packagesNotYetInSaleor = await this.db.package.findMany({
            where: {
                AND: [
                    {
                        createdAt: {
                            gt: subMonths(new Date(), 5),
                        },
                    },
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
                packageLineItems: {
                    include: {
                        warehouse: {
                            include: {
                                saleorWarehouse: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorAppId,
                                    },
                                },
                            },
                        },
                    },
                },
                order: {
                    select: {
                        orderNumber: true,
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
            {
                orderNumbers: packagesNotYetInSaleor
                    .map((p) => p.order?.orderNumber)
                    .join(", "),
            },
        );

        /**
         * We need to pull a default warehouse, for packages without a warehouse
         */
        const defaultWarehouse = this.installedSaleorApp.defaultWarehouseId
            ? await this.db.warehouse.findUnique({
                  where: {
                      id: this.installedSaleorApp.defaultWarehouseId,
                  },
                  include: {
                      saleorWarehouse: {
                          where: {
                              installedSaleorAppId: this.installedSaleorAppId,
                          },
                      },
                  },
              })
            : undefined;

        for (const parcel of packagesNotYetInSaleor) {
            if (!parcel.packageLineItems) {
                this.logger.error(
                    `No line_items for package ${parcel.id} - ${parcel.number}. Can't create package in Saleor`,
                );
                continue;
            }

            if (!parcel.orderId) {
                this.logger.error(
                    `No order id for package ${parcel.id} - ${parcel.number}. Can't create package in Saleor`,
                );
                continue;
            }

            const saleorOrder = await this.db.saleorOrder.findUnique({
                where: {
                    orderId_installedSaleorAppId: {
                        orderId: parcel.orderId,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                include: {
                    order: {
                        include: {
                            orderLineItems: {
                                include: {
                                    // To create a fulfillment in Saleor, we need the
                                    // ID of the orderLine
                                    saleorOrderLineItems: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
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
            const warehouseCheck = parcel.packageLineItems.some((i) => {
                if (!i.warehouseId || !i.warehouse?.saleorWarehouse?.[0]?.id) {
                    return false;
                }
                return true;
            });
            if (
                !warehouseCheck &&
                !this.installedSaleorApp.defaultWarehouseId
            ) {
                this.logger.error(
                    `Warehouse or SaleorWarehouse missing for ${parcel.id} - ${parcel.number} and no default warehouse given. Can't create fulfillment`,
                );
                continue;
            }

            const saleorLines: OrderFulfillLineInput[] =
                saleorOrder.order.orderLineItems
                    .map((line) => {
                        if (!line.saleorOrderLineItems?.[0]?.id) {
                            this.logger.info(
                                `No saleor order line for order line ${line.id}. Can't fulfill this orderline`,
                            );
                            return undefined;
                        }
                        const saleorOrderLineId =
                            line.saleorOrderLineItems[0].id;

                        const filteredForSKU = parcel.packageLineItems.filter(
                            (x) => x.sku === line.sku,
                        );
                        if (filteredForSKU.length === 0) {
                            this.logger.warn(
                                `Can't find a package line item for orderline with SKU ${line.sku}`,
                            );
                            return undefined;
                        }
                        const bestMatchByQuantity = closestsMatch(
                            filteredForSKU,
                            line.quantity,
                            "quantity",
                        );
                        if (bestMatchByQuantity.sku !== line.sku) {
                            this.logger.error(
                                `Security check failed! The best match is from a wrong SKU`,
                            );
                            return undefined;
                        }
                        /**
                         * Find the saleor warehouse id. Use the default warehouse if non given
                         * @returns
                         */
                        const saleorWarehouse = () => {
                            const warehouseSearch =
                                bestMatchByQuantity.warehouse
                                    ?.saleorWarehouse?.[0];
                            if (
                                warehouseSearch &&
                                warehouseSearch.installedSaleorAppId ===
                                    this.installedSaleorAppId
                            )
                                return warehouseSearch.id;
                            return defaultWarehouse?.saleorWarehouse?.[0]
                                .id as string;
                        };
                        return {
                            orderLineId: saleorOrderLineId,
                            stocks: [
                                {
                                    warehouse: saleorWarehouse(),
                                    quantity: bestMatchByQuantity.quantity,
                                },
                            ],
                        };
                    })
                    .filter(
                        (x) => typeof x?.orderLineId === "string",
                    ) as OrderFulfillLineInput[];

            const fulfillmentLinesCheck = saleorLines.every((i) => {
                if (!i.orderLineId) return false;
                return true;
            });
            if (!fulfillmentLinesCheck || saleorLines.length === 0) {
                this.logger.error(
                    `Can't create fulfillment for order ${saleorOrder.id} - ${
                        parcel.number
                    } - ${
                        parcel.orderId
                    }. Missing orderLineId or quantity: ${JSON.stringify(
                        saleorLines,
                    )}`,
                    {
                        orderNumber: saleorOrder.order.orderNumber,
                        saleorOrderLines: JSON.stringify(
                            saleorOrder.order.orderLineItems,
                        ),
                        packageLineItems: JSON.stringify(
                            parcel.packageLineItems,
                        ),
                    },
                );

                continue;
            }

            this.logger.info(
                `Creating fulfillment now in Saleor ${saleorOrder.id} - ${parcel.number} - ${parcel.orderId}`,
                {
                    orderNumber: saleorOrder.order.orderNumber,
                    trackingNumber: parcel.trackingId,
                },
            );
            this.logger.debug(
                `Saleor line items for saleor order ${saleorOrder.id}:` +
                    JSON.stringify(saleorLines),
            );
            const trackingNumber = parcel.trackingId;
            const response = await this.saleorClient.saleorCreatePackage({
                order: saleorOrder.id,
                input: {
                    allowStockToBeExceeded: true,
                    lines: saleorLines,
                    trackingNumber,
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
                        // TODO: create internal package for that
                    } else if (e.code === "INSUFFICIENT_STOCK") {
                        this.logger.error(
                            `Saleor has not enough stock to fulfill order ${saleorOrder.id}: ${e.message}`,
                        );
                    } else {
                        throw new Error(JSON.stringify(e));
                    }
                    return true;
                });
            } else {
                /**
                 * one package = one fullfillment in Saleor, so we should actually never have more than one
                 * fulfillment in the response..
                 */
                for (const fulfillment of response.orderFulfill.fulfillments) {
                    if (!fulfillment?.id)
                        throw new Error(
                            `Fulfillment id missing for ${saleorOrder.id}`,
                        );
                    this.logger.info(
                        `Fulfillment created successfully in Saleor: ${fulfillment.id}`,
                    );
                    await this.upsertSaleorPackage(
                        fulfillment?.id,
                        parcel.id,
                        fulfillment?.created,
                    );
                    /**
                     * Update the carrierTrackingUrl and other package related information
                     * in saleor
                     */
                    await this.updateFulfillmentMetadata(
                        fulfillment.id,
                        parcel,
                    );
                }
            }

            /**
             * Find packages that received updates since the last run
             * (updates in the package) and update the metadata of the fulfillment
             * in saleor
             */
        }

        /**
         * Packages, that have a saleor package, that got
         * updated since the last run
         */
        const updatedPackages = await this.db.package.findMany({
            where: {
                updatedAt: {
                    gt: createdGte,
                },
                saleorPackage: {
                    some: {
                        installedSaleorAppId: {
                            contains: this.installedSaleorAppId,
                        },
                    },
                },
            },
            include: {
                saleorPackage: true,
            },
        });

        this.logger.info(
            `Found ${updatedPackages.length} packages, that have been updated since the last run`,
        );

        for (const updatedPackage of updatedPackages) {
            if (!updatedPackage.saleorPackage?.[0]?.id) {
                this.logger.error(
                    `No saleor package found for package ${updatedPackage.id} - ${updatedPackage.number}`,
                );
                continue;
            }
            await this.updateFulfillmentMetadata(
                updatedPackage.saleorPackage[0].id,
                updatedPackage,
            );
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }
}
