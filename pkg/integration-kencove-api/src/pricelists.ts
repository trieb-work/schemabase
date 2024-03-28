// pricelist integration class, taking the pricelists endpoint from the kencove api to get
// availabilities and prices for product variants. Synchronising them with our internal database
// models SalesChannel and SalesChannelPriceEntry

import { ILogger } from "@eci/pkg/logger";
import { Attribute, KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { KencoveApiClient } from "./client";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subHours, subYears } from "date-fns";
import { normalizeStrings } from "@eci/pkg/normalization";
import { id } from "@eci/pkg/ids";
import { KencoveApiPricelistItem } from "./types";

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

    private shippingStatusAttribute: Attribute | undefined = undefined;

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

    /**
     * The kencove API get us shipping metainformation like "free shipping qualified" as pricelist entry.
     * We model that as actual product attribute
     * @param priceListItem
     */
    private async setShippingAttributes(
        priceListItem: KencoveApiPricelistItem,
        productId: string,
    ) {
        const shippingAttribute =
            this.shippingStatusAttribute ||
            (await this.db.attribute.upsert({
                where: {
                    normalizedName_tenantId: {
                        normalizedName: "shippingstatus",
                        tenantId: this.kencoveApiApp.tenantId,
                    },
                },
                create: {
                    id: id.id("attribute"),
                    tenant: {
                        connect: {
                            id: this.kencoveApiApp.tenantId,
                        },
                    },
                    name: "Shipping Status",
                    normalizedName: "shippingstatus",
                    type: "MULTISELECT",
                },
                update: {},
            }));
        if (!this.shippingStatusAttribute) {
            this.shippingStatusAttribute = shippingAttribute;
        }
        /**
         * Is there already an entry for attribute Shipping Status and the current product, we are working on
         */
        const attrValue = await this.db.attributeValueProduct.findUnique({
            where: {
                productId_attributeId_normalizedName_tenantId: {
                    productId,
                    attributeId: shippingAttribute.id,
                    normalizedName: "shippingstatus",
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
        });
        if (!attrValue) {
            await this.db.attributeValueProduct.create({
                data: {
                    id: id.id("attributeValue"),
                    tenant: {
                        connect: {
                            id: this.kencoveApiApp.tenantId,
                        },
                    },
                    attribute: {
                        connect: {
                            id: shippingAttribute.id,
                        },
                    },
                    product: {
                        connect: {
                            id: productId,
                        },
                    },
                    normalizedName: "shippingstatus",
                    value: priceListItem.freeship_qualified
                        ? "FREE Shipping"
                        : "Shipping Fees Apply",
                },
            });
            await this.db.product.update({
                where: {
                    id: productId,
                },
                data: {
                    updatedAt: new Date(),
                },
            });
        } else {
            // only update the entry, if it has changed
            if (
                attrValue.value !==
                (priceListItem.freeship_qualified
                    ? "FREE Shipping"
                    : "Shipping Fees Apply")
            ) {
                await this.db.attributeValueProduct.update({
                    where: {
                        productId_attributeId_normalizedName_tenantId: {
                            productId,
                            attributeId: shippingAttribute.id,
                            normalizedName: "shippingstatus",
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                    data: {
                        value: priceListItem.freeship_qualified
                            ? "FREE Shipping"
                            : "Shipping Fees Apply",
                    },
                });
                await this.db.product.update({
                    where: {
                        id: productId,
                    },
                    data: {
                        updatedAt: new Date(),
                    },
                });
            }
        }
    }

    public async syncToEci(gteDataTesting?: Date): Promise<void> {
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
            this.logger.info(
                `Setting GTE date to ${gteDataTesting || createdGte}.`,
            );
        }
        if (gteDataTesting) {
            createdGte = gteDataTesting;
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);
        const pricelistsYield = client.getPricelistStream(createdGte);

        for await (const pricelists of pricelistsYield) {
            this.logger.info(
                `Processing ${pricelists.length} pricelist entries from Kencove API`,
            );
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

                    const startDate = pricelistEntry.date_start
                        ? new Date(pricelistEntry.date_start)
                        : null;
                    const endDate = pricelistEntry.date_end
                        ? new Date(pricelistEntry.date_end)
                        : null;

                    if (pricelistEntry.min_quantity === 0) {
                        await this.setShippingAttributes(
                            pricelistEntry,
                            productVariant.productId,
                        );
                    }

                    const existingPriceEntry =
                        await this.db.salesChannelPriceEntry.findFirst({
                            where: {
                                salesChannelId: salesChannel.id,
                                productVariantId: productVariant.id,
                                tenantId: this.kencoveApiApp.tenantId,
                                startDate,
                                endDate,
                                minQuantity: pricelistEntry.min_quantity,
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
                                minQuantity: pricelistEntry.min_quantity,
                            },
                        });
                    } else {
                        this.logger.info(
                            `Price entry for SKU ${pricelist.itemCode} and ` +
                                `${pricelistEntry.pricelist_name} already exists. Updating.`,
                        );
                        await this.db.salesChannelPriceEntry.update({
                            where: {
                                id: existingPriceEntry.id,
                            },
                            data: {
                                price: pricelistEntry.price,
                            },
                        });
                    }
                }
            }
        }

        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
