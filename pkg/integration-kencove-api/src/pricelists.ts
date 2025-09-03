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
import { subDays, subYears } from "date-fns";
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

    private shippingStatusAttributeVariant: Attribute | undefined = undefined;

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
     * We model that as actual product and variant attribute. Will switch to variant only at some point. We use
     * a separate attribute for the variant shipping status: "Variant Shipping Status".
     * @param priceListItem
     */
    private async setShippingAttributes(
        priceListItem: KencoveApiPricelistItem,
        productId: string,
        variantId: string,
    ) {
        const shippingAttributeProduct =
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
            this.shippingStatusAttribute = shippingAttributeProduct;
        }

        const shippingAttributeVariant =
            this.shippingStatusAttributeVariant ||
            (await this.db.attribute.upsert({
                where: {
                    normalizedName_tenantId: {
                        normalizedName: "variantshippingstatus",
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
                    name: "Variant Shipping Status",
                    normalizedName: "variantshippingstatus",
                    type: "MULTISELECT",
                },
                update: {},
            }));
        if (!this.shippingStatusAttributeVariant) {
            this.shippingStatusAttributeVariant = shippingAttributeVariant;
        }

        /**
         * Is there already an entry for attribute Shipping Status and the current product, we are working on
         */
        const attrValue = await this.db.attributeValueProduct.findUnique({
            where: {
                productId_attributeId_normalizedName_tenantId: {
                    productId,
                    attributeId: shippingAttributeProduct.id,
                    normalizedName: "shippingstatus",
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
        });
        const attrValueVariant = await this.db.attributeValueVariant.findUnique(
            {
                where: {
                    productVariantId_attributeId_normalizedName_tenantId: {
                        productVariantId: variantId,
                        attributeId: shippingAttributeVariant.id,
                        normalizedName: "variantshippingstatus",
                        tenantId: this.kencoveApiApp.tenantId,
                    },
                },
            },
        );
        if (!attrValueVariant) {
            await this.db.attributeValueVariant.create({
                data: {
                    id: id.id("attributeValue"),
                    tenant: {
                        connect: {
                            id: this.kencoveApiApp.tenantId,
                        },
                    },
                    attribute: {
                        connect: {
                            id: shippingAttributeVariant.id,
                        },
                    },
                    productVariant: {
                        connect: {
                            id: variantId,
                        },
                    },
                    normalizedName: "variantshippingstatus",
                    value: priceListItem.freeship_qualified
                        ? "FREE Shipping"
                        : "Shipping Fees Apply",
                },
            });
        } else {
            // only update the entry, if it has changed
            if (
                attrValueVariant.value !==
                (priceListItem.freeship_qualified
                    ? "FREE Shipping"
                    : "Shipping Fees Apply")
            ) {
                await this.db.attributeValueVariant.update({
                    where: {
                        productVariantId_attributeId_normalizedName_tenantId: {
                            productVariantId: variantId,
                            attributeId: shippingAttributeVariant.id,
                            normalizedName: "variantshippingstatus",
                            tenantId: this.kencoveApiApp.tenantId,
                        },
                    },
                    data: {
                        value: priceListItem.freeship_qualified
                            ? "FREE Shipping"
                            : "Shipping Fees Apply",
                    },
                });
            }
        }
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
                            id: shippingAttributeProduct.id,
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
                            attributeId: shippingAttributeProduct.id,
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
            // for security purposes, we sync 1 day more than the last run. We got issues otherwise
            createdGte = subDays(cronState.lastRun, 1);
            this.logger.info(
                `Setting GTE date to ${gteDataTesting || createdGte}.`,
            );
        }
        if (gteDataTesting) {
            createdGte = gteDataTesting;
        }

        const client = KencoveApiClient.getInstance(
            this.kencoveApiApp,
            this.logger,
        );
        const pricelistsYield = client.getPricelistStream(
            createdGte,
            productTemplateId,
        );

        for await (const pricelists of pricelistsYield) {
            this.logger.info(
                `Processing ${pricelists.length} pricelist entries from Kencove API`,
            );
            for (const pricelist of pricelists) {
                let realVariantEntry = false;
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
                    // the pricelist entries for multiple variants look a bit different. Also, we can't use directly the pricelist_item_id, but instead
                    // need to build a joint id by using product_template_id + product_id
                    this.logger.info(
                        `Processing pricelist for different variants`,
                        {
                            productTemplateId: pricelist.product_template_id,
                        },
                    );
                    realVariantEntry = true;
                }
                this.logger.debug(
                    `Working on ${pricelist.priceListItems.length} entries for ${pricelist.product_template_id}`,
                    {
                        productTemplateId: pricelist.product_template_id,
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

                    /**
                     * The unique kencove identifier of this pricelist entry. We need to use our own identifier for "real variant" entries
                     * , as we get wrong data from the api for these cases
                     */
                    const pricelistEntryId = realVariantEntry
                        ? `${pricelist.product_template_id}-${productVariant.id}`
                        : pricelistEntry.pricelist_item_id.toString();

                    /**
                     * the existing pricelist entry for the current product variant and sales channel
                     * so that we can check, if we actually need to update
                     */
                    const existingPriceEntry =
                        await this.db.kencoveApiPricelistItem.findUnique({
                            where: {
                                id_productTemplateId_kencoveApiAppId: {
                                    id: pricelistEntryId,
                                    productTemplateId:
                                        pricelist.product_template_id.toString(),
                                    kencoveApiAppId: this.kencoveApiApp.id,
                                },
                            },
                            include: {
                                salesChannelPriceEntry: true,
                            },
                        });

                    /**
                     * Pricelist entries can be inactive, if they are not valid anymore.
                     * We disable them in our database and continue
                     */
                    if (!pricelistEntry.active && existingPriceEntry) {
                        this.logger.info(
                            `Pricelist entry for SKU ${productVariant.sku} and ` +
                                `${pricelistEntry.pricelist_name} is inactive. Disabling in our database.`,
                            {
                                productVariantId: productVariant.id,
                                pricelistEntryId:
                                    pricelistEntry.pricelist_item_id,
                            },
                        );
                        await this.db.salesChannelPriceEntry.update({
                            where: {
                                id: existingPriceEntry.salesChannelPriceEntry
                                    ?.id,
                            },
                            data: {
                                active: false,
                            },
                        });
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
                            productVariant.id,
                        );
                    }

                    if (!existingPriceEntry) {
                        /**
                         * Existing salesPriceEntry
                         */
                        const existingSalesChannelPriceEntry =
                            await this.db.salesChannelPriceEntry.findFirst({
                                where: {
                                    salesChannelId: salesChannel.id,
                                    productVariantId: productVariant.id,
                                    tenantId: this.kencoveApiApp.tenantId,
                                    minQuantity: pricelistEntry.min_quantity,
                                    /**
                                     * Typescript makes weird things here, so we need to cast it to any, as these dates are
                                     * actually optional
                                     */
                                    startDate: startDate ?? (undefined as any),
                                    endDate: endDate ?? (undefined as any),
                                },
                            });
                        this.logger.info(
                            `Creating new price entry for SKU ${productVariant.sku} and ` +
                                `${pricelistEntry.pricelist_name}.`,
                            {
                                productVariantId: productVariant.id,
                                salesChannelId: salesChannel.id,
                                pricelistEntryId:
                                    pricelistEntry.pricelist_item_id,
                            },
                        );
                        await this.db.kencoveApiPricelistItem.create({
                            data: {
                                id: pricelistEntryId,
                                productTemplateId:
                                    pricelist.product_template_id.toString(),
                                kencoveApiApp: {
                                    connect: {
                                        id: this.kencoveApiApp.id,
                                    },
                                },
                                salesChannelPriceEntry: {
                                    connect: existingSalesChannelPriceEntry?.id
                                        ? {
                                              id: existingSalesChannelPriceEntry.id,
                                          }
                                        : undefined,
                                    create: !existingSalesChannelPriceEntry?.id
                                        ? {
                                              id: id.id(
                                                  "salesChannelPriceEntry",
                                              ),
                                              tenant: {
                                                  connect: {
                                                      id: this.kencoveApiApp
                                                          .tenantId,
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
                                              minQuantity:
                                                  pricelistEntry.min_quantity,
                                          }
                                        : undefined,
                                },
                            },
                        });
                    } else {
                        /**
                         * We check if any entries of the pricelist item have changed and update in this case
                         */
                        if (
                            existingPriceEntry.salesChannelPriceEntry?.price !==
                                pricelistEntry.price ||
                            existingPriceEntry.salesChannelPriceEntry
                                ?.minQuantity !== pricelistEntry.min_quantity ||
                            existingPriceEntry.salesChannelPriceEntry?.startDate?.getTime() !==
                                startDate?.getTime() ||
                            existingPriceEntry.salesChannelPriceEntry?.endDate?.getTime() !==
                                endDate?.getTime() ||
                            existingPriceEntry.salesChannelPriceEntry
                                .productVariantId !== productVariant.id ||
                            existingPriceEntry.salesChannelPriceEntry
                                .salesChannelId !== salesChannel.id
                        ) {
                            this.logger.info(
                                `Price entry for SKU ${productVariant.sku} and ` +
                                    `${pricelistEntry.pricelist_name} already exists. Updating.`,
                                {
                                    productVariantId: productVariant.id,
                                    existingPriceEntryId:
                                        existingPriceEntry
                                            .salesChannelPriceEntry?.id,
                                    changedEntity: {
                                        price:
                                            existingPriceEntry
                                                .salesChannelPriceEntry
                                                ?.price !==
                                            pricelistEntry.price,
                                        minQuantity:
                                            existingPriceEntry
                                                .salesChannelPriceEntry
                                                ?.minQuantity !==
                                            pricelistEntry.min_quantity,
                                        startDate:
                                            existingPriceEntry.salesChannelPriceEntry?.startDate?.getTime() !==
                                            startDate?.getTime(),
                                        endDate:
                                            existingPriceEntry.salesChannelPriceEntry?.endDate?.getTime() !==
                                            endDate?.getTime(),
                                        productVariantId:
                                            existingPriceEntry
                                                .salesChannelPriceEntry
                                                ?.productVariantId !==
                                            productVariant.id,
                                        salesChannel:
                                            existingPriceEntry
                                                .salesChannelPriceEntry
                                                ?.salesChannelId !==
                                            salesChannel.id,
                                    },
                                },
                            );

                            await this.db.kencoveApiPricelistItem.update({
                                where: {
                                    id_productTemplateId_kencoveApiAppId: {
                                        id: pricelistEntryId,
                                        productTemplateId:
                                            pricelist.product_template_id.toString(),
                                        kencoveApiAppId: this.kencoveApiApp.id,
                                    },
                                },
                                data: {
                                    salesChannelPriceEntry: {
                                        update: {
                                            price: pricelistEntry.price,
                                            minQuantity:
                                                pricelistEntry.min_quantity,
                                            startDate,
                                            endDate,
                                            productVariant: {
                                                connect: {
                                                    id: productVariant.id,
                                                },
                                            },
                                            salesChannel: {
                                                connect: {
                                                    id: salesChannel.id,
                                                },
                                            },
                                        },
                                    },
                                },
                            });
                        }
                    }
                }

                /**
                 * The kencove api always returns all pricelist entries for a product variant, if one of them got updated.
                 * Like this, we can cleanup our DB and remove all pricelist entries that are not in the current pricelist
                 * anymore (got deleted in Odoo, not archived)
                 */
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
                    for (const existingPriceEntryToCheck of existingPriceEntries) {
                        const found = pricelist.priceListItems.find(
                            (item) =>
                                item.pricelist_item_id.toString() ===
                                existingPriceEntryToCheck
                                    .kencoveApiPricelistItems[0]?.id,
                        );
                        if (!found) {
                            this.logger.info(
                                `Deleting sales channel price entry for SKU ${productVariant.sku} and ` +
                                    `${existingPriceEntryToCheck.salesChannelId} as it is not in the current pricelist anymore.`,
                                {
                                    productVariantId: productVariant.id,
                                    salesChannelId:
                                        existingPriceEntryToCheck.salesChannelId,
                                    existingPriceEntryId:
                                        existingPriceEntryToCheck.id,
                                },
                            );
                            await this.db.salesChannelPriceEntry.delete({
                                where: {
                                    id: existingPriceEntryToCheck.id,
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
