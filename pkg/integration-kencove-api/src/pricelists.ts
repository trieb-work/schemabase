// pricelist integration class, taking the pricelists endpoint from the kencove api to get
// availabilities and prices for product variants. Synchronising them with our internal database
// models SalesChannel and SalesChannelPriceEntry

import { ILogger } from "@eci/pkg/logger";
import {
    Attribute,
    KencoveApiApp,
    PrismaClient,
    ProductVariant,
} from "@eci/pkg/prisma";
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

    private async getItemBySku(sku: string) {
        const productVariant = await this.db.productVariant.findUnique({
            where: {
                sku_tenantId: {
                    sku: sku,
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
        });
        if (!productVariant) {
            this.logger.warn(`Could not find item with SKU ${sku}`);
            return;
        }
        return productVariant;
    }

    public async syncToEci(
        gteDataTesting?: Date,
        productTemplateId?: string,
    ): Promise<void> {
        const cronState = await this.cronState.get();
        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 3);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            // for security purposes, we sync 5 hours more than the last run. We got issues otherwise
            createdGte = subHours(cronState.lastRun, 5);
            this.logger.info(
                `Setting GTE date to ${gteDataTesting || createdGte}.`,
            );
        }
        if (gteDataTesting) {
            createdGte = gteDataTesting;
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);
        const pricelistsYield = client.getPricelistStream(
            createdGte,
            productTemplateId,
        );

        for await (const pricelists of pricelistsYield) {
            this.logger.info(
                `Processing ${pricelists.length} pricelist entries from Kencove API`,
            );
            for (const pricelist of pricelists) {
                /**
                 * The schemabase item that is related to the current pricelist entry
                 */
                let productVariant: ProductVariant | undefined = undefined;
                if (pricelist.itemCode) {
                    this.logger.info(
                        `Processing pricelist for SKU ${pricelist.itemCode}`,
                    );
                    const variant = await this.getItemBySku(pricelist.itemCode);
                    if (!variant) {
                        continue;
                    }
                    productVariant = variant;
                } else {
                    this.logger.info(
                        `Processing pricelist for different variants`,
                        {
                            productTemplateId: pricelist.product_template_id,
                        },
                    );
                }
                this.logger.debug(
                    `Working on ${pricelist.priceListItems.length} entries for ${pricelist.product_template_id}`,
                    {
                        productTemplateId,
                        sku: pricelist.itemCode,
                    },
                );
                for (const pricelistEntry of pricelist.priceListItems) {
                    if (!productVariant && !pricelistEntry.variantItemCode) {
                        this.logger.warn(
                            `No product variant found for SKU ${pricelist.itemCode} and no variantItemCode set. Skipping.`,
                        );
                        continue;
                    }

                    /**
                     * SKU can be found on pricelist or on pricelistEntry level, depending on the setup in Odoo
                     */
                    if (!pricelist.itemCode && pricelistEntry.variantItemCode) {
                        const variant = await this.getItemBySku(
                            pricelistEntry.variantItemCode,
                        );
                        if (!variant) {
                            continue;
                        }
                        productVariant = variant;
                    }

                    if (!productVariant) {
                        continue;
                    }

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
                            include: {
                                kencoveApiPricelistItems: true,
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
                                kencoveApiPricelistItems: {
                                    connectOrCreate: {
                                        where: {
                                            id_productTemplateId_kencoveApiAppId:
                                                {
                                                    id: pricelistEntry.pricelist_item_id.toString(),
                                                    productTemplateId:
                                                        pricelist.product_template_id.toString(),
                                                    kencoveApiAppId:
                                                        this.kencoveApiApp.id,
                                                },
                                        },
                                        create: {
                                            id: pricelistEntry.pricelist_item_id.toString(),
                                            productTemplateId:
                                                pricelist.product_template_id.toString(),
                                            kencoveApiApp: {
                                                connect: {
                                                    id: this.kencoveApiApp.id,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        });
                    } else {
                        this.logger.info(
                            `Price entry for SKU ${productVariant.sku} and ` +
                                `${pricelistEntry.pricelist_name} already exists. Updating.`,
                            {
                                productVariantId: productVariant.id,
                                existingPriceEntryId: existingPriceEntry.id,
                            },
                        );
                        if (
                            existingPriceEntry.price !== pricelistEntry.price ||
                            !existingPriceEntry.kencoveApiPricelistItems ||
                            existingPriceEntry.kencoveApiPricelistItems[0]
                                ?.id !==
                                pricelistEntry.pricelist_item_id.toString()
                        ) {
                            await this.db.salesChannelPriceEntry.update({
                                where: {
                                    id: existingPriceEntry.id,
                                },
                                data: {
                                    price: pricelistEntry.price,
                                    kencoveApiPricelistItems: {
                                        connectOrCreate: {
                                            where: {
                                                id_productTemplateId_kencoveApiAppId:
                                                    {
                                                        id: pricelistEntry.pricelist_item_id.toString(),
                                                        productTemplateId:
                                                            pricelist.product_template_id.toString(),
                                                        kencoveApiAppId:
                                                            this.kencoveApiApp
                                                                .id,
                                                    },
                                            },
                                            create: {
                                                id: pricelistEntry.pricelist_item_id.toString(),
                                                productTemplateId:
                                                    pricelist.product_template_id.toString(),
                                                kencoveApiApp: {
                                                    connect: {
                                                        id: this.kencoveApiApp
                                                            .id,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            });
                        }
                    }
                }

                if (productVariant) {
                    /**
                     * we check all pricelist items for the current product variant from the kencove api
                     * and compare them with all existing sales channel price entries for the current product variant
                     * that include a kencove api pricelist item. We delete all sales channel price entries that
                     * are not in the current pricelist items anymore.
                     */
                    const existingPriceEntries =
                        await this.db.salesChannelPriceEntry.findMany({
                            where: {
                                productVariantId: productVariant.id,
                                tenantId: this.kencoveApiApp.tenantId,
                                kencoveApiPricelistItems: {
                                    some: {
                                        kencoveApiAppId: this.kencoveApiApp.id,
                                    },
                                },
                            },
                            include: {
                                kencoveApiPricelistItems: true,
                            },
                        });
                    for (const existingPriceEntry of existingPriceEntries) {
                        const found = pricelist.priceListItems.find(
                            (item) =>
                                item.pricelist_item_id.toString() ===
                                existingPriceEntry.kencoveApiPricelistItems[0]
                                    ?.id,
                        );
                        if (!found) {
                            this.logger.info(
                                `Deleting sales channel price entry for SKU ${productVariant.sku} and ` +
                                    `${existingPriceEntry.salesChannelId} as it is not in the current pricelist anymore.`,
                                {
                                    productVariantId: productVariant.id,
                                    salesChannelId:
                                        existingPriceEntry.salesChannelId,
                                    existingPriceEntryId: existingPriceEntry.id,
                                },
                            );
                            await this.db.salesChannelPriceEntry.delete({
                                where: {
                                    id: existingPriceEntry.id,
                                },
                            });
                        }
                    }
                }
            }
        }

        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
