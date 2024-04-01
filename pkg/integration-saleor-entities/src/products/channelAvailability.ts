import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import {
    PrismaClient,
    Product,
    ProductVariant,
    SaleorChannel,
    SaleorProductVariant,
    SalesChannel,
    SalesChannelPriceEntry,
} from "@eci/pkg/prisma";
import {
    ChannelListingsFragment,
    SaleorClient,
    queryWithPagination,
} from "@eci/pkg/saleor";
import { isAfter, subHours, subYears } from "date-fns";

type EnhancedSalesChannelPriceEntry = SalesChannelPriceEntry & {
    salesChannel: SalesChannel & {
        saleorChannels: SaleorChannel[];
    };
    productVariant: ProductVariant & {
        product: Product & {
            saleorProducts: {
                id: string;
            }[];
        };
        saleorProductVariant: SaleorProductVariant[];
    };
};

/**
 * Saleor Sync Sub-class to sync product prices in different channels and
 * their general availability
 */
export class SaleorChannelAvailabilitySyncService {
    private readonly db: PrismaClient;

    private readonly installedSaleorAppId: string;

    private readonly tenantId: string;

    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

    private readonly cronState: CronStateHandler;

    public constructor(
        db: PrismaClient,
        installedSaleorAppId: string,
        logger: ILogger,
        saleorClient: SaleorClient,
        tenantId: string,
    ) {
        this.db = db;
        this.installedSaleorAppId = installedSaleorAppId;
        this.tenantId = tenantId;
        this.logger = logger;
        this.saleorClient = saleorClient;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: installedSaleorAppId,
            db: this.db,
            syncEntity: "pricelist",
        });
    }

    public async syncFromEci() {
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

        if (cronState.errorCount > 3) {
            this.logger.error(
                `Error count is higher than 3. Not running the sync. Manual intervention required.`,
            );
            await this.cronState.set({
                lastRun: now,
                lastRunStatus: "failure",
            });
            return;
        }

        await this.syncChannelAvailability(createdGte);

        await this.cronState.set({
            lastRun: now,
            lastRunStatus: "success",
            errorCount: 0,
        });
    }

    private getCurrentActiveBasePrices(
        entries: EnhancedSalesChannelPriceEntry[],
    ): EnhancedSalesChannelPriceEntry[] {
        // Filter out entries with minQuantity > 1 or with an ended endDate
        const activeEntries = entries.filter(
            (entry) =>
                entry.minQuantity <= 1 &&
                (!entry.endDate || new Date(entry.endDate) > new Date()),
        );

        // Group entries by productVariantId and salesChannelId
        const groupedEntries: Record<string, EnhancedSalesChannelPriceEntry[]> =
            {};
        activeEntries.forEach((entry) => {
            const key = `${entry.productVariantId}_${entry.salesChannelId}`;
            if (!groupedEntries[key]) {
                groupedEntries[key] = [];
            }
            groupedEntries[key].push(entry);
        });

        // For each group, find the entry with the most recent startDate
        const result: EnhancedSalesChannelPriceEntry[] = [];

        Object.values(groupedEntries).forEach((group) => {
            const latestEntry = group.reduce((latest, current) => {
                if (!latest) {
                    return current;
                }
                if (!current) {
                    return latest;
                }
                if (!latest.startDate && current.startDate) {
                    return current;
                }
                if (
                    current.startDate &&
                    latest.startDate &&
                    current.startDate > latest.startDate
                ) {
                    return current;
                }
                return latest;
            });
            result.push(latestEntry);
        });

        return result;
    }

    private async syncChannelAvailability(gteDate: Date) {
        this.logger.debug(
            `Looking for channel updates since ${gteDate} or items without channel entries set yet`,
        );
        const channelPricingsUpdated =
            await this.db.salesChannelPriceEntry.findMany({
                where: {
                    tenantId: this.tenantId,
                    updatedAt: {
                        gte: gteDate,
                    },
                    salesChannel: {
                        saleorChannels: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                    productVariant: {
                        saleorProductVariant: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
                orderBy: {
                    startDate: "desc",
                },
                include: {
                    salesChannel: {
                        include: {
                            saleorChannels: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                    productVariant: {
                        include: {
                            product: {
                                include: {
                                    saleorProducts: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
                                        },
                                    },
                                },
                            },
                            saleorProductVariant: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                },
            });
        const channelPricingsMissing =
            await this.db.salesChannelPriceEntry.findMany({
                where: {
                    id: {
                        notIn: channelPricingsUpdated.map((entry) => entry.id),
                    },
                    tenantId: this.tenantId,
                    salesChannel: {
                        saleorChannels: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                    productVariant: {
                        product: {
                            saleorProducts: {
                                some: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                            saleorChannelListings: {
                                none: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                        saleorProductVariant: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
                include: {
                    salesChannel: {
                        include: {
                            saleorChannels: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                    productVariant: {
                        include: {
                            product: {
                                include: {
                                    saleorProducts: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
                                        },
                                    },
                                },
                            },
                            saleorProductVariant: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                },
            });

        const channelPricings = [
            ...channelPricingsUpdated,
            ...channelPricingsMissing,
        ];

        if (channelPricings.length === 0) {
            this.logger.info(`No channel pricings to sync`);
            return;
        }

        this.logger.info(
            `Working on ${channelPricings.length} channel pricing entries`,
            {
                channelPricingsUpdated: channelPricingsUpdated.length,
                channelPricingsMissing: channelPricingsMissing.length,
            },
        );

        /**
         * There can be multiple entries per variant, minQuantity and channel.
         * We need to filter first for only entries, with startDate before now and
         * for the entries with the highest startDate, if we
         * have multiple entries with the same minQuantity and channel.
         */
        const basePriceEntries =
            this.getCurrentActiveBasePrices(channelPricings);

        /**
         * All base price entries are related to product variants.
         * These are the unique saleor product ids these entries are related to.
         */
        const allUniqueSaleorProductIds = [
            ...new Set(
                channelPricings.map(
                    (entry) =>
                        entry.productVariant.product.saleorProducts[0].id,
                ),
            ),
        ];

        this.logger.info(
            `Syncing channel availability for ${allUniqueSaleorProductIds.length} unique saleor products. Getting the existing channel listings first`,
        );

        const res =
            allUniqueSaleorProductIds.length > 0
                ? await queryWithPagination(({ first, after }) =>
                      this.saleorClient.channelListings({
                          first,
                          after,
                          productIds: allUniqueSaleorProductIds,
                      }),
                  )
                : {};

        const existingChannelListings = res.products?.edges.map((x) => x.node);

        for (const entry of basePriceEntries) {
            if (
                entry &&
                entry.startDate &&
                isAfter(entry.startDate, new Date())
            ) {
                this.logger.info(
                    `No base price entry currently valid for product ${entry.productVariant.product.name} ` +
                        `variant ${entry.productVariant.variantName} at channel ${entry.salesChannel.name}. Start date is in the future`,
                    {
                        startDate: entry.startDate,
                    },
                );
                continue;
            }
            this.logger.info(
                `Syncing channel availability (base price) for product ${entry.productVariant.product.name} variant ${entry.productVariant.variantName}` +
                    ` at channel ${entry.salesChannel.name} with price ${entry.price} and min Quanity ${entry.minQuantity}`,
            );
            await this.syncBaseAvailability(entry, existingChannelListings);
        }

        // Get all unique product variant ids of volume discount channel pricings.
        // we need to pull all pricing entries and update them together for these variants
        const uniqueVariantIdsWithVolumeDiscounts = [
            ...new Set(
                channelPricings
                    .filter((entry) => entry.minQuantity > 1)
                    .map((entry) => entry.productVariantId),
            ),
        ];

        for (const entry of uniqueVariantIdsWithVolumeDiscounts) {
            this.logger.info(
                `Syncing volume discount entries for product variant ${entry}`,
            );
            await this.syncVolumeDiscounts(entry, existingChannelListings);
        }
    }

    /**
     * Sync the volume discount entries. Currently, Saleor is lacking this feature
     * so we just write this information in the product variant metadata.
     * We will need to update this logic once Saleor implements volume discounts
     * @param entry
     */
    private async syncVolumeDiscounts(
        prodVariantId: string,
        existingListings?: ChannelListingsFragment[],
    ) {
        /**
         * pull all entries for quantity > 0 for this variant
         * and that are currently valid (no end date or end date after now)
         */
        const entries = await this.db.salesChannelPriceEntry.findMany({
            where: {
                tenantId: this.tenantId,
                productVariantId: prodVariantId,
                minQuantity: {
                    gt: 1,
                },
                startDate: {
                    lte: new Date(),
                },
            },
            include: {
                salesChannel: true,
                productVariant: {
                    include: {
                        product: {
                            include: {
                                saleorProducts: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorAppId,
                                    },
                                },
                            },
                        },
                        saleorProductVariant: {
                            where: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
            },
        });

        const saleorProductVariantId =
            entries[0].productVariant.saleorProductVariant[0].id;
        if (!saleorProductVariantId) {
            this.logger.info(
                `No saleor product variant found for product variant ${prodVariantId}`,
            );
            return;
        }
        const filteredEntries = entries.filter(
            (ent) => ent.endDate === null || isAfter(ent.endDate, new Date()),
        );
        if (filteredEntries.length === 0) {
            this.logger.info(
                `No volume pricing entries found for product variant ${prodVariantId} after filtering for end Date`,
            );
            return;
        }
        const saleorProductId =
            entries[0].productVariant.product.saleorProducts[0].id;

        const existingVariantMetafield = existingListings
            ?.find((l) => l.id === saleorProductId)
            ?.variants?.find((v) => v.id === saleorProductVariantId)?.metafield;

        const metadataItemValue = filteredEntries.map((entry) => ({
            channel: entry.salesChannel.name.toLowerCase(),
            price: entry.price,
            minQuantity: entry.minQuantity,
            startDate: entry.startDate,
            endDate: entry.endDate,
            channelListingId: entry.id,
        }));

        /**
         * compare the existing metadata with the new metadata
         * and only update if there are changes
         */
        if (
            existingVariantMetafield &&
            existingVariantMetafield === JSON.stringify(metadataItemValue)
        ) {
            this.logger.info(
                `Volume pricing metadata already up to date for product variant ${prodVariantId}`,
            );
            return;
        }

        this.logger.info(
            `Updating metadata with volume pricing for product ${entries[0].productVariant.product.name}, variant ` +
                `${entries[0].productVariant.variantName} with saleor product variant ${saleorProductVariantId}`,
        );

        await this.saleorClient.saleorUpdateMetadata({
            id: saleorProductVariantId,
            input: [
                {
                    key: "volumePricingEntries",
                    value: JSON.stringify(metadataItemValue),
                },
            ],
        });
    }

    /**
     * This logic is used to sync the general product availability
     * and variant prices for a product channel and minQuantity <= 1
     * we use the saleor mutations productChannelListingUpdate to make a saleor product general availability
     * at a channel. The second mutation is productVariantChannelListingUpdate to set the price of a product variant at a channel
     */
    private async syncBaseAvailability(
        entry: SalesChannelPriceEntry & {
            salesChannel: SalesChannel & {
                saleorChannels: SaleorChannel[];
            };
            productVariant: ProductVariant & {
                product: Product & {
                    saleorProducts: {
                        id: string;
                    }[];
                };
                saleorProductVariant: SaleorProductVariant[];
            };
        },
        existingListings?: ChannelListingsFragment[],
    ) {
        const saleorProductId =
            entry.productVariant.product.saleorProducts?.[0]?.id;
        if (!saleorProductId) {
            this.logger.error(
                `No saleor product id found for product variant ${entry.productVariant.id}`,
            );
            return;
        }
        const existingListing = existingListings?.find(
            (l) => l.id === saleorProductId,
        );

        /**
         * check if existing product and variant channel listing are the
         * same that we want to update. Skip update in that case
         */
        if (existingListing && existingListing.channelListings?.length) {
            const existingChannelListing = existingListing.channelListings.find(
                (c) => c.channel.id === entry.salesChannel.saleorChannels[0].id,
            );
            if (
                existingChannelListing &&
                existingChannelListing.availableForPurchaseAt ===
                    entry.startDate &&
                existingChannelListing.isAvailableForPurchase &&
                existingChannelListing.isPublished &&
                existingChannelListing.visibleInListings
            ) {
                const variant = existingListing.variants?.find(
                    (v) =>
                        v.id ===
                        entry.productVariant.saleorProductVariant[0].id,
                );
                if (variant && variant.channelListings?.length) {
                    const variantChannelListing = variant.channelListings.find(
                        (c) =>
                            c.channel.id ===
                            entry.salesChannel.saleorChannels[0].id,
                    );
                    if (
                        variantChannelListing &&
                        variantChannelListing.price?.amount === entry.price
                    ) {
                        this.logger.info(
                            `Product and variant channel listing already up to date for product and product variant ${entry.productVariant.id}`,
                        );
                        return;
                    }
                }
            }
        }

        const resp1 = await this.saleorClient.productChannelListingUpdate({
            id: saleorProductId,
            input: {
                updateChannels: [
                    {
                        availableForPurchaseAt: entry.startDate,
                        channelId: entry.salesChannel.saleorChannels[0].id,
                        visibleInListings: true,
                        isAvailableForPurchase: true,
                        isPublished: true,
                    },
                ],
            },
        });

        if (
            resp1.productChannelListingUpdate?.errors &&
            resp1.productChannelListingUpdate?.errors.length > 0
        ) {
            this.logger.error(
                `Error updating product channel availability for product variant ${
                    entry.productVariant.id
                }: ${JSON.stringify(resp1.productChannelListingUpdate.errors)}`,
            );
            return;
        }

        /**
         * Store the channel listing id in our DB, so that we know later,
         * if we have items without any channel listing set yet
         */
        const channelListingId =
            resp1.productChannelListingUpdate?.product?.channelListings?.find(
                (c) => c.channel.id === entry.salesChannel.saleorChannels[0].id,
            )?.id;
        if (channelListingId)
            await this.db.saleorChannelListing.upsert({
                where: {
                    id_installedSaleorAppId: {
                        id: channelListingId,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                create: {
                    id: channelListingId,
                    product: {
                        connect: {
                            id: entry.productVariant.productId,
                        },
                    },
                    installedSaleorApp: {
                        connect: {
                            id: this.installedSaleorAppId,
                        },
                    },
                },
                update: {},
            });

        const resp2 =
            await this.saleorClient.productVariantChannelListingUpdate({
                id: entry.productVariant.saleorProductVariant[0].id,
                input: [
                    {
                        channelId: entry.salesChannel.saleorChannels[0].id,
                        price: entry.price,
                    },
                ],
            });
        if (
            resp2.productVariantChannelListingUpdate?.errors &&
            resp2.productVariantChannelListingUpdate?.errors.length > 0
        ) {
            this.logger.error(
                `Error updating product variant channel price for product variant ${
                    entry.productVariant.id
                }: ${JSON.stringify(
                    resp2.productVariantChannelListingUpdate.errors,
                )}`,
            );
            return;
        }
    }
}
