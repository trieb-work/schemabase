// class KencoveApiAppStockSyncService: product stock sync. Syncs the last changed product stocks
// from the kencove api to our internal db. creates warehouses if needed.
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { KencoveApiWarehouseSync } from "./warehouses";

interface KencoveApiAppProductStocksSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppProductStockSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppProductStocksSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "itemstocks",
        });
    }

    /**
     * Syncs the last changed product stocks from the kencove api to our internal db.
     * creates warehouses if needed.
     * @returns
     * @memberof KencoveApiAppStockSyncService
     * @throws
     */
    public syncToEci = async (productTemplateId?: string): Promise<void> => {
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
        const stockStream = client.getProductStocksStream(
            createdGte,
            productTemplateId,
        );

        /**
         * Helper to match warehouse
         */
        const whHelper = new KencoveApiWarehouseSync({
            db: this.db,
            kencoveApiApp: this.kencoveApiApp,
            logger: this.logger,
        });
        for await (const stocks of stockStream) {
            if (stocks.length === 0) {
                this.logger.info("No product stocks to sync. Exiting.");
                await this.cronState.set({ lastRun: new Date() });
                return;
            }
            this.logger.info(`Found ${stocks.length} product stocks to sync`);

            /**
             * Create product stocks. The itemCode is the sku we use to match to an internal
             * variant. We have one stock entry per warehouse in warehouse_stock
             */
            for (const variant of stocks) {
                const internalVariant = await this.db.productVariant.findUnique(
                    {
                        where: {
                            sku_tenantId: {
                                sku: variant.itemCode,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                    },
                );
                if (!internalVariant) {
                    this.logger.error(
                        `Could not find internal variant for sku: ${variant.itemCode}`,
                    );
                    continue;
                }
                for (const warehouseEntry of variant.warehouse_stock) {
                    /**
                     * we have the qty available and the warehouse_able_to_make. Some kits might
                     * have a qty_avail of 0 / null but warehouse_able_to_make > 0. We are adding
                     * the warehouse_able_to_make to the qty_avail to get the total available stock
                     */
                    const totalAvailableStock =
                        (warehouseEntry.qty_avail || 0) +
                        (warehouseEntry.warehouse_able_to_make || 0);

                    if (!warehouseEntry.warehouse_code) {
                        this.logger.debug(
                            `Warehouse code is missing for sku: ${
                                variant.itemCode
                            }, ${JSON.stringify(variant.warehouse_stock)}`,
                        );
                        if (totalAvailableStock === 0) {
                            this.logger.info(
                                `Nulling all stock entries for SKU ${variant.itemCode} `,
                            );

                            await this.db.stockEntries.updateMany({
                                where: {
                                    productVariantId: internalVariant.id,
                                    tenantId: this.kencoveApiApp.tenantId,
                                },
                                data: {
                                    actualAvailableForSaleStock: 0,
                                },
                            });
                        }

                        continue;
                    }
                    const warehouseId = await whHelper.getWareHouseId(
                        warehouseEntry.warehouse_code,
                    );

                    const existingStock = await this.db.stockEntries.findUnique(
                        {
                            where: {
                                warehouseId_productVariantId_tenantId: {
                                    warehouseId: warehouseId,
                                    productVariantId: internalVariant.id,
                                    tenantId: this.kencoveApiApp.tenantId,
                                },
                            },
                        },
                    );
                    if (existingStock) {
                        if (
                            existingStock.actualAvailableForSaleStock ===
                            totalAvailableStock
                        ) {
                            this.logger.info(
                                `Stock entry for ${internalVariant.sku} did not change`,
                            );
                            continue;
                        }
                        this.logger.info(
                            `Updating stock entry for ${internalVariant.sku} ` +
                                `from ${existingStock.actualAvailableForSaleStock} to ${totalAvailableStock}`,
                        );
                        await this.db.stockEntries.update({
                            where: {
                                id: existingStock.id,
                            },
                            data: {
                                actualAvailableForSaleStock:
                                    totalAvailableStock,
                            },
                        });
                    } else {
                        await this.db.stockEntries.create({
                            data: {
                                id: id.id("stockEntry"),
                                tenant: {
                                    connect: {
                                        id: this.kencoveApiApp.tenantId,
                                    },
                                },
                                productVariant: {
                                    connect: {
                                        id: internalVariant.id,
                                    },
                                },
                                warehouse: {
                                    connect: {
                                        id: warehouseId,
                                    },
                                },
                                actualAvailableForSaleStock:
                                    totalAvailableStock,
                            },
                        });
                    }
                }
            }
        }

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    };
}
