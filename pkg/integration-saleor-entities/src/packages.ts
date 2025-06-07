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
import { InstalledSaleorApp, Prisma, PrismaClient } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subMinutes, subYears } from "date-fns";
import { closestsMatch } from "@eci/pkg/utils/closestMatch";

interface SaleorPackageSyncServiceConfig {
    saleorClient: SaleorClient;
    installedSaleorApp: InstalledSaleorApp;
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
    orderPrefix: string;
}

type SaleorOrder = Prisma.SaleorOrderGetPayload<{
    include: {
        order: {
            include: {
                orderLineItems: {
                    include: {
                        saleorOrderLineItems: true;
                    };
                };
            };
        };
    };
}>;

type Package = Prisma.PackageGetPayload<{
    include: {
        order: true;
        events: true;
        packageLineItems: {
            include: {
                productVariant: {
                    include: {
                        product: true;
                    };
                };
                warehouse: {
                    include: {
                        saleorWarehouse: true;
                    };
                };
            };
        };
    };
}>;

type PackageAndEvents = Prisma.PackageGetPayload<{
    include: {
        order: true;
        events: true;
    };
}>;

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
                } else {
                    this.logger.warn(
                        `We can't find an internal Package entity for order ${order.number}, as we don't have a tracking number. Skipping creation`,
                    );
                    continue;
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
     * E.g. carrierTrackingUrl and status (delivered, in transit, etc.).
     * If it is a virtual package, we need to write it all to the order metadata in
     * with the key package number
     * @param entityId The fulfillment or the order id, if virtual package only
     * @param parcel
     */
    public async updateFulfillmentMetadata(
        entityId: string,
        parcel: PackageAndEvents,
        isVirtual?: boolean,
    ): Promise<void> {
        const metadata: MetadataInput[] = [];
        if (isVirtual) {
            metadata.push({
                key: parcel.number,
                value: JSON.stringify(parcel),
            });
            await this.saleorClient.saleorUpdateMetadata({
                id: entityId,
                input: metadata,
            });
            return;
        }

        if (parcel.state) metadata.push({ key: "state", value: parcel.state });
        if (parcel.carrierTrackingUrl)
            metadata.push({
                key: "carrierTrackingUrl",
                value: parcel.carrierTrackingUrl,
            });
        if (parcel.carrier)
            metadata.push({ key: "carrier", value: parcel.carrier });
        if (parcel.events && parcel.events.length > 0)
            metadata.push({
                key: "events",
                value: JSON.stringify(parcel.events),
            });
        if (metadata.length > 0)
            await this.saleorClient.saleorUpdateMetadata({
                id: entityId,
                input: metadata,
            });
        this.logger.debug(
            `Updated metadata for entity ${entityId} with ${JSON.stringify(
                metadata,
            )}`,
            {
                orderNumber: parcel?.order?.orderNumber,
                packageNumber: parcel.number,
            },
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
            this.logger.info(`Setting GTE date to ${createdGte}. `);
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
                            // gt: subMonths(new Date(), 5),
                            /**
                             * making sure, that package is already 30 mins old to make sure that all orderlines are already processed
                             */
                            lt: subMinutes(new Date(), 30),
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
                                none: {
                                    status: "FULFILLED",
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
                order: true,
                events: true,
                packageLineItems: {
                    include: {
                        productVariant: {
                            include: {
                                product: true,
                            },
                        },
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
            },
        });
        this.logger.info(
            `Received ${
                packagesNotYetInSaleor.length
            } orders that have a package and are saleor orders: ${packagesNotYetInSaleor
                .map((p) => p.number)
                .join(",")}`,
            {
                orderNumbers: Array.from(
                    new Set(
                        packagesNotYetInSaleor
                            .map((p) => p.order?.orderNumber)
                            .filter(Boolean),
                    ),
                ).join(", "),
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

            this.logger.debug(
                `Working on package ${parcel.id} - ${parcel.number} for order ${parcel.orderId} - ${saleorOrder.order.orderNumber}`,
                {
                    saleorOrderNumber: saleorOrder.id,
                    orderNumber: saleorOrder.order.orderNumber,
                    packageNumber: parcel.number,
                },
            );

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

            let saleorLines = this.generateSaleorFulfillmentLines(
                saleorOrder,
                parcel,
                defaultWarehouse?.saleorWarehouse[0].id as string,
            );

            if (!saleorLines) {
                /**
                 * When we can't match safely, but have just one package
                 * and see that the order is fully shipped, we just hard-coding a
                 * package. All saleorOrderLines come in this package.
                 */
                if (
                    !parcel.isMultiPieceShipment &&
                    saleorOrder.order.shipmentStatus === "shipped"
                ) {
                    const shortCircuitPackage =
                        this.generateShortCircuitPackage(
                            saleorOrder,
                            parcel,
                            defaultWarehouse?.saleorWarehouse[0].id as string,
                        );
                    if (shortCircuitPackage) {
                        saleorLines = shortCircuitPackage;
                    } else {
                        this.logger.error(
                            `Can't create fulfillment for order ${saleorOrder.id} - ${parcel.number} - ${parcel.orderId}. Short circuit package doesn't match order line items`,
                            {
                                orderNumber: saleorOrder.order.orderNumber,
                                shortCircuitPackage,
                                orderLineItems:
                                    saleorOrder.order.orderLineItems,
                            },
                        );
                    }
                } else {
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
                }
            }

            if (saleorLines) {
                // creating the real package in Saleor.
                await this.createSaleorFulfillment(
                    saleorOrder,
                    parcel,
                    saleorLines,
                );
            } else {
                // we just create a "virtual package". So we practically write all data to the metadata of the order and
                // create a virtual saleor package in our DB.
                await this.createVirtualSaleorPackage(saleorOrder.id, parcel);
            }
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
                order: true,
                events: true,
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
            const isVirtual = updatedPackage.saleorPackage?.[0]?.isVirtual;

            await this.updateFulfillmentMetadata(
                updatedPackage.saleorPackage[0].id,
                updatedPackage,
                isVirtual,
            );
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    private generateSaleorFulfillmentLines(
        saleorOrder: SaleorOrder,
        parcel: Package,
        defaultSaleorWarehouseId: string,
    ) {
        const saleorLines: OrderFulfillLineInput[] =
            saleorOrder.order.orderLineItems
                .map((line) => {
                    if (!line.saleorOrderLineItems?.[0]?.id) {
                        // `No saleor order line for order line ${line.id}. Can't fulfill this orderline`,
                        return undefined;
                    }
                    const saleorOrderLineId = line.saleorOrderLineItems[0].id;

                    const filteredForSKU = parcel.packageLineItems.filter(
                        (x) => x.sku === line.sku,
                    );
                    /**
                     * We can't match an orderline. For example when items consist of other items,
                     * and we just get the information on the shipped part not the original item..
                     * or if we have multiple shipments and this item is in a different package
                     */
                    if (filteredForSKU.length === 0) {
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
                            bestMatchByQuantity.warehouse?.saleorWarehouse?.[0];
                        if (
                            warehouseSearch &&
                            warehouseSearch.installedSaleorAppId ===
                                this.installedSaleorAppId
                        )
                            return warehouseSearch.id;
                        return defaultSaleorWarehouseId;
                    };
                    if (bestMatchByQuantity.quantity < 1) {
                        this.logger.warn(
                            `Quantity is below 0 for SKU ${line.sku}. This is not supported by Saleor. SaleorOrderLineId: ${saleorOrderLineId}`,
                            {
                                orderNumber: saleorOrder.order.orderNumber,
                                saleorOrderLineId: saleorOrderLineId,
                            },
                        );
                        // we currently can't handle this case and need to skip this line
                        return undefined;
                    }
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
            this.logger.info(
                `Could not match all orderlines for order ${saleorOrder.id}. Returning null`,
            );
            return null;
        }

        // check, if all package line items are in saleor lines with the same quantity. Check
        // using the SKU as identifier
        const packageLineItemsCheck = parcel.packageLineItems.every((i) => {
            const orderLine = saleorOrder.order.orderLineItems.find(
                (x) => x.sku === i.sku,
            )?.saleorOrderLineItems?.[0];
            if (!orderLine) return false;

            const saleorLine = saleorLines.find(
                (x) => x.orderLineId === orderLine.id,
            );
            if (!saleorLine) return false;
            return saleorLine.stocks[0].quantity === i.quantity;
        });
        if (!packageLineItemsCheck) {
            this.logger.info(
                `Not all package line items are in saleor lines with the same quantity for order ${saleorOrder.id}. Returning null`,
            );
            return null;
        }

        return saleorLines;
    }

    /**
     * Generate a short circuit package for the given saleor order and parcel.
     * Returns null if not all orderlines have a saleor orderline
     * @param saleorOrder
     * @param parcel
     * @param defaultSaleorWarehouseId
     * @returns
     */
    private generateShortCircuitPackage(
        saleorOrder: SaleorOrder,
        parcel: Package,
        defaultSaleorWarehouseId: string,
    ): OrderFulfillLineInput[] | null {
        const shortCircuitPackage: OrderFulfillLineInput[] = [];
        for (const line of saleorOrder.order.orderLineItems) {
            if (!line.saleorOrderLineItems?.[0]?.id) {
                this.logger.info(
                    `No saleor order line for order line ${line.id}. Can't fulfill this orderline`,
                );
                return null;
            }
            const saleorOrderLine = line.saleorOrderLineItems[0];
            /**
             * Saleor warehouse id. Using the first package line item to get the id,
             * as all package line items need to be shipped from the same warehouse
             */
            const warehouse =
                parcel.packageLineItems[0]?.warehouse?.saleorWarehouse[0].id ||
                defaultSaleorWarehouseId;
            if (!warehouse) return null;
            shortCircuitPackage.push({
                orderLineId: saleorOrderLine.id,
                stocks: [
                    {
                        warehouse: warehouse,
                        quantity: line.quantity,
                    },
                ],
            });
        }

        this.logger.info(
            `Using short circuit package for order ${saleorOrder.id} - ${parcel.number} - ${parcel.orderId}`,
            {
                orderNumber: saleorOrder.order.orderNumber,
                shortCircuitPackage,
                orderLineItems: saleorOrder.order.orderLineItems,
            },
        );
        return shortCircuitPackage;
    }

    private async createSaleorFulfillment(
        saleorOrder: SaleorOrder,
        parcel: Package,
        saleorLines: OrderFulfillLineInput[],
    ) {
        this.logger.info(
            `Creating fulfillment now in Saleor ${saleorOrder.id} - ${parcel.number} - ${parcel.orderId}`,
            {
                orderNumber: saleorOrder.order.orderNumber,
                trackingNumber: parcel.trackingId,
                saleorOrderId: saleorOrder.id,
            },
        );
        const trackingNumber = parcel.trackingId || undefined;
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
            response.orderFulfill?.errors.length ||
            !response.orderFulfill?.fulfillments
        ) {
            for (const e of response.orderFulfill!.errors) {
                if (
                    e.code === "FULFILL_ORDER_LINE" &&
                    e.message?.includes("Only 0 items remaining to fulfill")
                ) {
                    this.logger.info(
                        `Saleor orderline ${e.orderLines} from order ${saleorOrder.orderNumber} - ${saleorOrder.id} is already fulfilled: ${e.message}. Continue`,
                    );

                    // create internal package for that / check if order is already fulfilled and write status back.
                    // we check the saleor order, see the orderlines, get the fulfillment id from there and create the corresponding saleor package.
                    // we pull the order with the fulfillments from Saleor. We match saleorLines with the fulfillment lines to get the
                    // fulfillment id and create the corresponding saleor package in our DB.
                    const orderFromSaleor =
                        await this.saleorClient.saleorOrderWithFulfillment({
                            orderId: saleorOrder.id,
                        });
                    const fulfillments = orderFromSaleor.order?.fulfillments;
                    if (!fulfillments) {
                        this.logger.error(
                            `No fulfillments found for order ${saleorOrder.id}`,
                            {
                                orderNumber: saleorOrder.orderNumber,
                                orderLines: saleorOrder.order.orderLineItems,
                            },
                        );
                        return;
                    }

                    // find the fulfillment that matches the saleorLines
                    const fulfillmentsMatch = fulfillments.filter((f) => {
                        return f.lines?.some((l) => {
                            return (
                                l.orderLine?.id ===
                                    saleorLines[0].orderLineId &&
                                l.quantity === saleorLines[0].stocks[0].quantity
                            );
                        });
                    });

                    if (!fulfillmentsMatch.length) {
                        this.logger.error(
                            `No matching fulfillment found for order ${saleorOrder.id}. Creating virtual fulfillment`,
                            {
                                orderNumber: saleorOrder.orderNumber,
                            },
                        );
                        await this.createVirtualSaleorPackage(
                            saleorOrder.id,
                            parcel,
                        );
                        return;
                    }

                    let fulfillment;
                    if (fulfillmentsMatch.length > 1) {
                        // we need to select now the fulfillmentid that we do not yet have in our DB
                        for (const f of fulfillmentsMatch) {
                            const exists =
                                await this.db.saleorPackage.findUnique({
                                    where: {
                                        id_installedSaleorAppId: {
                                            id: f.id,
                                            installedSaleorAppId:
                                                this.installedSaleorApp.id,
                                        },
                                    },
                                });
                            if (!exists) {
                                fulfillment = f;
                                break;
                            }
                        }
                    } else {
                        fulfillment = fulfillmentsMatch[0];
                    }
                    if (!fulfillment) {
                        this.logger.error(
                            `No fulfillment found for order ${saleorOrder.id}. Creating virtual fulfillment`,
                            {
                                orderNumber: saleorOrder.order.orderNumber,
                            },
                        );
                        await this.createVirtualSaleorPackage(
                            saleorOrder.id,
                            parcel,
                        );
                        return;
                    }
                    this.logger.info(
                        `Fulfillment found for order ${saleorOrder.id}: ${fulfillment.id}`,
                    );
                    await this.upsertSaleorPackage(
                        fulfillment.id,
                        parcel.id,
                        fulfillment.created,
                    );
                } else if (e.code === "INSUFFICIENT_STOCK") {
                    this.logger.error(
                        `Saleor has not enough stock to fulfill order ${saleorOrder.id}: ${e.message}`,
                    );
                } else if (
                    e.code === "FULFILL_ORDER_LINE" &&
                    (e.message?.includes("item remaining to fulfill.") ||
                        e.message?.includes("items remaining to fulfill."))
                ) {
                    this.logger.warn(
                        `We try to fulfill more items than still to fulfill: ${e.message}`,
                    );
                    // Just run the virtual fulfillment logic as we have definitely some wrong data and want to show the customer the actual package
                    await this.createVirtualSaleorPackage(
                        saleorOrder.id,
                        parcel,
                    );
                } else {
                    this.logger.error(
                        "Unhandled error trying to create order fulfillment",
                        { lines: saleorLines },
                    );
                    throw new Error(JSON.stringify(e));
                }
                continue;
            }
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
                await this.updateFulfillmentMetadata(fulfillment.id, parcel);
            }
        }
    }

    /**
     * We just write all package data to the saleor order metadata and create a new saleor package
     * in our DB with the order id as parcel id and mark is as virtual. It is possible to have multiple
     * virtual packages for one order. We create a data structure of packageLines per package
     * @param parcel
     */
    private async createVirtualSaleorPackage(
        saleorOrderId: string,
        parcel: Package,
    ) {
        const packageLines = {
            [parcel.number]: parcel.packageLineItems.map((line) => {
                return {
                    id: line.id,
                    number: parcel.number,
                    quantity: line.quantity,
                    sku: line.sku,
                    productName: line.productVariant.product.name,
                    variantName: line.productVariant.variantName,
                    warehouse: line.warehouse?.saleorWarehouse[0].id,
                    carrier: parcel.carrier,
                    carrierTrackingUrl: parcel.carrierTrackingUrl,
                };
            }),
        };

        // fetch the saleor order metadata
        const order = await this.saleorClient.orderMetadata({
            id: saleorOrderId,
        });

        const existingPackageLines = order.order?.metadata.find(
            (m) => m.key === "packageLines",
        )?.value;
        const lines = existingPackageLines
            ? JSON.parse(existingPackageLines)
            : [];
        lines.push(packageLines);

        const metadata = [
            { key: "packageLines", value: JSON.stringify(lines) },
            { key: "virtualPackage", value: "true" },
            { key: "orderStatus", value: parcel.order?.orderStatus || "" },
        ];
        this.logger.info(`Creating virtual package in the order metadata`, {
            orderNumber: parcel.order?.orderNumber,
            packageNumber: parcel.number,
            saleorOrderId,
        });
        await this.saleorClient.saleorUpdateMetadata({
            id: saleorOrderId,
            input: metadata,
        });
        await this.db.saleorPackage.create({
            data: {
                id: parcel.id,
                createdAt: new Date(),
                installedSaleorApp: {
                    connect: {
                        id: this.installedSaleorAppId,
                    },
                },
                isVirtual: true,
                package: {
                    connect: {
                        id: parcel.id,
                    },
                },
            },
        });
    }
}
