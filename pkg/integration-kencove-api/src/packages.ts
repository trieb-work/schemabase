// The KencoveApiPackageSyncService is responsible for syncing packages from the
// Odoo Kencove API to the ECI
import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { Carrier, KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/utils/uniqueStringOrderline";
import { KencoveApiWarehouseSync } from "./warehouses";
import { lbsToKg } from "@eci/pkg/utils/transform";

interface KencoveApiAppPackageSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppPackageSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppPackageSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "packages",
        });
    }

    /**
     * Match the carrier names coming from kencove to our generic internal ones.
     */
    private matchCarrier(carrier: string): Carrier {
        const carrierLower = carrier.toLowerCase();
        if (carrierLower.includes("ups")) {
            return Carrier.UPS;
        }
        if (carrierLower.includes("fedex")) {
            return Carrier.FEDEX;
        }
        if (carrierLower.includes("usps")) {
            return Carrier.USPS;
        }
        if (carrierLower.includes("dhl")) {
            return Carrier.DHL;
        }

        return Carrier.UNKNOWN;
    }

    /**
     * Transform the package line items: we use the "itemCode" of the "packageItemline" from the API
     * and match it with our internal SKUs. We return PackageLineItem
     */

    public async syncToEci() {
        const cronState = await this.cronState.get();
        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 1);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            // for security purposes, we sync one hour more than the last run
            createdGte = subHours(cronState.lastRun, 1);
            this.logger.info(`Setting GTE date to ${createdGte}.`);
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);
        const packagesYield = client.getPackagesStream(createdGte);

        let errors = [];
        for await (const packages of packagesYield) {
            this.logger.info(`Found ${packages.length} packages to sync.`, {
                packageNumbers: packages.map((p) => p.packageName),
            });
            /**
             * Helper to match warehouse
             */
            const whHelper = new KencoveApiWarehouseSync({
                db: this.db,
                kencoveApiApp: this.kencoveApiApp,
                logger: this.logger,
            });

            for (const pkg of packages) {
                // we are using the pkg.packageName as the unique identifier for packages.
                // we work with a upsert command directly.
                if (!pkg.carrierName) {
                    this.logger.error(
                        `Package ${pkg.packageName} has no carrier name.`,
                    );
                    continue;
                }
                const carrier = this.matchCarrier(pkg?.carrierName);

                const warehouseId = await whHelper.getWareHouseId(
                    pkg.warehouseCode,
                );

                /**
                 * When we find a package with the same salesOrderNo, but a different package name,
                 * we have a multi piece shipment.
                 */
                const isMultiPieceShipment = !!packages.find(
                    (p) =>
                        p.salesOrderNo === pkg.salesOrderNo &&
                        p.packageName !== pkg.packageName,
                );

                // when the trackingNumber is a string like: "1Z2632010391767531+1Z2632010394224148"
                // or "1Z2632010391767531,1Z2632010394224148"
                // we have a multi piece shipment, that is currently not supported by the ERP.
                // In that case, we don't write the tracking number to the package. Newer packages don't face this problem
                let trackingId: string | undefined = pkg.trackingNumber;
                if (
                    pkg?.trackingNumber?.includes("+") ||
                    pkg?.trackingNumber?.includes(",")
                ) {
                    trackingId = undefined;
                }

                const createdAt = new Date(pkg.createdAt);
                const updatedAt = new Date(pkg.updatedAt);

                const weightGrams = lbsToKg(pkg.shippingWeight) * 1000;

                this.logger.debug(
                    `Syncing package ${pkg.packageName} from Kencove API to ECI.`,
                    {
                        packageId: pkg.packageId,
                        packageName: pkg.packageName,
                        salesOrderNo: pkg.salesOrderNo,
                        trackingId,
                        isMultiPieceShipment,
                        carrier,
                        warehouseId,
                        weightGrams,
                        createdAt,
                    },
                );

                const schemabaseOrder = await this.db.order.findUnique({
                    where: {
                        orderNumber_tenantId: {
                            orderNumber: pkg.salesOrderNo,
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                });

                if (!schemabaseOrder) {
                    this.logger.warn(
                        `Could not find order ${pkg.salesOrderNo} for package ${pkg.packageName}. Skipping.`,
                        {
                            packageId: pkg.packageId,
                        },
                    );
                    continue;
                }

                try {
                    await this.db.kencoveApiPackage.upsert({
                        where: {
                            id_kencoveApiAppId: {
                                id: pkg.packageId.toString(),
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        },
                        create: {
                            id: pkg.packageId.toString(),
                            createdAt,
                            updatedAt,
                            kencoveApiApp: {
                                connect: {
                                    id: this.kencoveApiApp.id,
                                },
                            },
                            package: {
                                connectOrCreate: {
                                    where: {
                                        number_tenantId: {
                                            number: pkg.packageName,
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("package"),
                                        number: pkg.packageName,
                                        trackingId,
                                        isMultiPieceShipment,
                                        carrierTrackingUrl: trackingId
                                            ? pkg.trackingUrl
                                            : undefined,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                        carrier,
                                        order: {
                                            connect: {
                                                id: schemabaseOrder.id,
                                            },
                                        },
                                        packageLineItems: {
                                            // when we miss certain SKUs in our DB, this is going to fail.
                                            // we don't create the package in that case
                                            create: pkg?.packageItemline?.map(
                                                (item, index) => ({
                                                    id: id.id(
                                                        "packageLineItem",
                                                    ),
                                                    uniqueString:
                                                        uniqueStringOrderLine(
                                                            pkg.packageName,
                                                            item.itemCode,
                                                            item.quantity,
                                                            index,
                                                        ),
                                                    quantity: item.quantity,
                                                    tenant: {
                                                        connect: {
                                                            id: this
                                                                .kencoveApiApp
                                                                .tenantId,
                                                        },
                                                    },
                                                    warehouse: {
                                                        connect: {
                                                            id: warehouseId,
                                                        },
                                                    },
                                                    productVariant: {
                                                        connect: {
                                                            sku_tenantId: {
                                                                sku: item.itemCode,
                                                                tenantId:
                                                                    this
                                                                        .kencoveApiApp
                                                                        .tenantId,
                                                            },
                                                        },
                                                    },
                                                }),
                                            ),
                                        },
                                        weightGrams,
                                    },
                                },
                            },
                        },
                        update: {
                            updatedAt,
                            package: {
                                connectOrCreate: {
                                    where: {
                                        number_tenantId: {
                                            number: pkg.packageName,
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("package"),
                                        number: pkg.packageName,
                                        trackingId,
                                        isMultiPieceShipment,
                                        carrierTrackingUrl: trackingId
                                            ? pkg.trackingUrl
                                            : undefined,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                        carrier,
                                        order: {
                                            connect: {
                                                id: schemabaseOrder.id,
                                            },
                                        },
                                        packageLineItems: {
                                            create: pkg.packageItemline?.map(
                                                (item, index) => ({
                                                    id: id.id(
                                                        "packageLineItem",
                                                    ),
                                                    uniqueString:
                                                        uniqueStringOrderLine(
                                                            pkg.packageName,
                                                            item.itemCode,
                                                            item.quantity,
                                                            index,
                                                        ),
                                                    quantity: item.quantity,
                                                    tenant: {
                                                        connect: {
                                                            id: this
                                                                .kencoveApiApp
                                                                .tenantId,
                                                        },
                                                    },
                                                    warehouse: {
                                                        connect: {
                                                            id: warehouseId,
                                                        },
                                                    },
                                                    productVariant: {
                                                        connect: {
                                                            sku_tenantId: {
                                                                sku: item.itemCode,
                                                                tenantId:
                                                                    this
                                                                        .kencoveApiApp
                                                                        .tenantId,
                                                            },
                                                        },
                                                    },
                                                }),
                                            ),
                                        },
                                        weightGrams,
                                    },
                                },
                                update: {
                                    trackingId,
                                    carrierTrackingUrl: trackingId
                                        ? pkg.trackingUrl
                                        : undefined,
                                    order: {
                                        connect: {
                                            id: schemabaseOrder.id,
                                        },
                                    },
                                    weightGrams,
                                },
                            },
                        },
                    });
                } catch (error) {
                    this.logger.error(
                        `Error while syncing package ${
                            pkg.packageName
                        } from Kencove API to ECI: ${JSON.stringify(
                            error,
                        )}. Package line items: ${JSON.stringify(
                            pkg.packageItemline,
                        )}. Error: ${error}`,
                    );
                    errors.push(error);
                }
            }
        }

        // we update the last run date
        if (errors.length < 3) {
            await this.cronState.set({
                lastRun: now,
                lastRunStatus: "success",
            });
        } else {
            throw new Error(
                `${errors.length} errors occurred while syncing packages`,
            );
        }
    }
}
