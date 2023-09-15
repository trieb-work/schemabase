// pricelist integration class, taking the pricelists endpoint from the kencove api to get
// availabilities and prices for product variants. Synchronising them with our internal database
// models SalesChannel and SalesChannelPriceEntry

import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";
import { id } from "@eci/pkg/ids";

interface KencoveApiAppPricelistSyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppPricelistSyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    constructor(config: KencoveApiAppPricelistSyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "pricelist",
        });
    }

    public async syncToEci(): Promise<void> {
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

        const client = new KencoveApiClient(this.kencoveApiApp);
        const pricelistsYield = client.getPricelistStream(createdGte);

        for await (const pricelists of pricelistsYield) {
            for (const pricelist of pricelists) {
                this.logger.info(
                    `Processing pricelist for SKU ${pricelist.itemCode}`,
                );
                /**
                 * The schemabase item that is related to the current pricelist entry
                 */
                const productVariant = await this.db.productVariant.findUnique({
                    where: {
                        sku_tenantId: {
                            sku: pricelist.itemCode,
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                });
                if (!productVariant) {
                    this.logger.warn(
                        `Could not find item with SKU ${pricelist.itemCode}`,
                    );
                    continue;
                }

                for (const pricelistEntry of pricelist.priceListItems) {
                    const channelNormalizedName = normalizeStrings.channelNames(
                        pricelistEntry.pricelist_name,
                    );
                    const salesChannel = await this.db.salesChannel.upsert({
                        where: {
                            normalizedName_tenantId: {
                                normalizedName: channelNormalizedName,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("salesChannel"),
                            tenant: {
                                connect: {
                                    id: this.kencoveApiApp.tenantId,
                                },
                            },
                            name: pricelistEntry.pricelist_name,
                            normalizedName: channelNormalizedName,
                        },
                        update: {},
                    });

                    const startDate = new Date(pricelistEntry.date_start);
                    const endDate = pricelistEntry.date_end
                        ? new Date(pricelistEntry.date_end)
                        : null;

                    const existingPriceEntry =
                        await this.db.salesChannelPriceEntry.findFirst({
                            where: {
                                salesChannelId: salesChannel.id,
                                productVariantId: productVariant.id,
                                startDate,
                            },
                        });
                    if (!existingPriceEntry) {
                        await this.db.salesChannelPriceEntry.create({
                            data: {
                                id: id.id("salesChannelPriceEntry"),
                                tenant: {
                                    connect: {
                                        id: this.kencoveApiApp.tenantId,
                                    },
                                },
                                salesChannel: {
                                    connect: {
                                        id: salesChannel.id,
                                    },
                                },
                                productVariant: {
                                    connect: {
                                        id: productVariant.id,
                                    },
                                },
                                startDate,
                                endDate,
                                price: pricelistEntry.price,
                            },
                        });
                    } else {
                        this.logger.info(
                            `Price entry for SKU ${pricelist.itemCode} and` +
                                `${pricelistEntry.pricelist_name} already exists. Doing nothing`,
                        );
                        continue;
                    }
                }
            }
        }
    }
}
