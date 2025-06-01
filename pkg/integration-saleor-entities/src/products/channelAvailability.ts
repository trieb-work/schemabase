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
import { endOfDay, isAfter, startOfDay, subHours, subYears } from "date-fns";

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

    /**
     * There can be multiple entries per variant, minQuantity and channel.
     * We need to filter first for only entries, with startDate before now or now and
     * for the entries with the most recent, currently active startDate, if we
     * have multiple entries with the same minQuantity and channel.
     */
    private getCurrentActiveBasePrices(
        entries: EnhancedSalesChannelPriceEntry[],
    ): EnhancedSalesChannelPriceEntry[] {
        // Filter out entries with minQuantity > 1 or with an endDate in the past. Entries need to be active.
        const activeEntries = entries
            .filter((entry) => entry.active)
            .filter(
                (entry) =>
                    entry.minQuantity <= 1 &&
                    (!entry.endDate || isAfter(entry.endDate, new Date())),
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

        // For each group, find the appropriate entry based on start date
        const result: EnhancedSalesChannelPriceEntry[] = [];
        const now = new Date();

        Object.values(groupedEntries).forEach((group) => {
            // Debug: Log all entries in this group
            if (group.length > 1) {
                this.logger.debug("Group with multiple entries:");
                group.forEach((entry) => {
                    this.logger.debug(
                        `Entry: ${entry.productVariantId}, Start: ${entry.startDate}, End: ${entry.endDate}, Price: ${entry.price}`,
                    );
                });
            }

            // Split entries into current (start date in past or today) and future entries
            const currentEntries = group.filter(
                (entry) => !entry.startDate || !isAfter(entry.startDate, now),
            );
            const futureEntries = group.filter(
                (entry) => entry.startDate && isAfter(entry.startDate, now),
            );

            // Debug: Log the split
            if (group.length > 1) {
                this.logger.debug(
                    `Current entries: ${currentEntries.length}, Future entries: ${futureEntries.length}`,
                );
            }

            let selectedEntry: EnhancedSalesChannelPriceEntry | undefined;

            // If we have currently valid entries, select the one with the most recent start date
            if (currentEntries.length > 0) {
                selectedEntry = currentEntries.reduce((latest, current) => {
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

                // Debug: Log the selected current entry
                if (group.length > 1) {
                    this.logger.debug(
                        `Selected current entry: Start: ${selectedEntry.startDate}, Price: ${selectedEntry.price}`,
                    );
                }
            }
            // If no currently valid entries exist, select the future entry with the earliest start date
            else if (futureEntries.length > 0) {
                selectedEntry = futureEntries.reduce((earliest, current) => {
                    if (!earliest) {
                        return current;
                    }
                    if (!current) {
                        return earliest;
                    }
                    if (!earliest.startDate && current.startDate) {
                        return current;
                    }
                    if (
                        current.startDate &&
                        earliest.startDate &&
                        current.startDate < earliest.startDate
                    ) {
                        return current;
                    }
                    return earliest;
                });

                // Debug: Log the selected future entry
                if (group.length > 1) {
                    this.logger.debug(
                        `Selected future entry: Start: ${selectedEntry.startDate}, Price: ${selectedEntry.price}`,
                    );
                }
            }

            if (selectedEntry) {
                result.push(selectedEntry);
            }
        });

        return result;
    }

    /**
     * take the product id and the existing channel listings and
     * disable the product in Saleor if needed
     * @param product
     */
    private async disableProductInSaleor(
        saleorProductId: string,
        channelListings: ChannelListingsFragment[] | undefined,
        schemabaseProductId: string,
    ) {
        const existingEntry = channelListings?.find(
            (l) => l.id === saleorProductId,
        );

        /**
         * In Saleor, we have the product availability at a channel level.
         * Checking all existing channels if item is not availableForpurchase and not
         * visibleInProductListings
         */
        const isAlreadyDisabled =
            existingEntry?.channelListings?.every(
                (c) => !c.isAvailableForPurchase && !c.visibleInListings,
            ) || false;

        if (isAlreadyDisabled) {
            return;
        }
        this.logger.info(
            `Disabling product in Saleor for product ${saleorProductId}`,
            {
                product: saleorProductId,
                productName: existingEntry?.name,
            },
        );
        const resp = await this.saleorClient.productChannelListingUpdate({
            id: saleorProductId,
            input: {
                updateChannels: existingEntry?.channelListings?.map((c) => ({
                    channelId: c.channel.id,
                    availableForPurchaseAt: null,
                    visibleInListings: false,
                    isAvailableForPurchase: false,
                })),
            },
        });
        if (
            resp.productChannelListingUpdate?.errors &&
            resp.productChannelListingUpdate?.errors.length > 0
        ) {
            this.logger.error(
                `Error updating product channel availability for product ${saleorProductId}: ${JSON.stringify(
                    resp.productChannelListingUpdate.errors,
                )}`,
            );
            return;
        }

        if (resp.productChannelListingUpdate?.product?.channelListings) {
            await Promise.all(
                resp.productChannelListingUpdate.product.channelListings.map(
                    async (c) => {
                        await this.db.saleorChannelListing.upsert({
                            where: {
                                id_installedSaleorAppId: {
                                    id: c.id,
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                            create: {
                                id: c.id,
                                product: {
                                    connect: {
                                        id: schemabaseProductId,
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
                    },
                ),
            );
        }
    }

    /**
     * Handle the disabling of product variants. When this is a single variant, we don't remove the
     * channel from the variant, but instead just disable the product.
     * @param variantId
     * @param channelListings
     * @returns
     */
    private async disableVariantInSaleor(
        variantId: string,
        channelListings: ChannelListingsFragment[] | undefined,
        schemabaseProductId: string,
    ) {
        const existingEntry = channelListings?.find((l) =>
            l.variants?.some((v) => v.id === variantId),
        );

        const saleorProductId = existingEntry?.id;

        const singleVariant = existingEntry?.variants?.length === 1;

        if (singleVariant && existingEntry.id) {
            return this.disableProductInSaleor(
                existingEntry.id,
                channelListings,
                schemabaseProductId,
            );
        }

        /**
         * In Saleor, we have the product availability at a channel level.
         * Checking all existing channels if item is not availableForpurchase and not
         * visibleInProductListings
         */
        const isAlreadyDisabled =
            existingEntry?.variants
                ?.find((v) => v.id === variantId)
                ?.channelListings?.every((c) => !c.channel.id) || false;

        if (isAlreadyDisabled || !saleorProductId) {
            return;
        }
        this.logger.info(
            `Disabling product variant in Saleor for product variant ${variantId}`,
        );
        const res = await this.saleorClient.productChannelListingUpdate({
            id: saleorProductId,
            input: {
                updateChannels: existingEntry?.variants
                    ?.find((v) => v.id === variantId)
                    ?.channelListings?.map((c) => ({
                        channelId: c.channel.id,
                        removeVariants: [variantId],
                    })),
            },
        });

        if (
            res.productChannelListingUpdate?.errors &&
            res.productChannelListingUpdate?.errors.length > 0
        ) {
            this.logger.error(
                `Error updating product variant channel price for product variant ${variantId}: ${JSON.stringify(
                    res.productChannelListingUpdate.errors,
                )}`,
            );
            return;
        }
    }

    private async syncChannelAvailability(gteDate: Date) {
        this.logger.debug(
            `Looking for channel updates since ${gteDate} or items without channel entries set yet or entries, whose end date is today`,
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
        const channelPricingStartDatesToday =
            await this.db.salesChannelPriceEntry.findMany({
                where: {
                    tenantId: this.tenantId,
                    startDate: {
                        gte: startOfDay(new Date()),
                        lte: endOfDay(new Date()),
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

        const channelPricingEndDatesToday =
            await this.db.salesChannelPriceEntry.findMany({
                where: {
                    tenantId: this.tenantId,
                    endDate: {
                        gte: startOfDay(new Date()),
                        lte: endOfDay(new Date()),
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
        const disabledProductsSinceLastRun = await this.db.product.findMany({
            where: {
                tenantId: this.tenantId,
                updatedAt: {
                    gte: gteDate,
                },
                active: false,
                saleorProducts: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
            include: {
                saleorProducts: {
                    where: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
        });

        const disabledVariantsSinceLastRun =
            await this.db.productVariant.findMany({
                where: {
                    tenantId: this.tenantId,
                    updatedAt: {
                        gte: gteDate,
                    },
                    active: false,
                    saleorProductVariant: {
                        some: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                },
                include: {
                    saleorProductVariant: {
                        where: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
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
                },
            });

        const channelPricingsMixed = [
            ...channelPricingsUpdated,
            ...channelPricingsMissing,
            ...channelPricingStartDatesToday,
            ...channelPricingEndDatesToday,
        ];
        /**
         * We can have multiple duplicate entries, so we create a new array, with
         * unique channelpricing id, but same data
         */
        const channelPricings = [
            ...new Map(
                channelPricingsMixed.map((entry) => [entry.id, entry]),
            ).values(),
        ];

        if (
            channelPricings.length === 0 &&
            disabledProductsSinceLastRun.length === 0 &&
            disabledVariantsSinceLastRun.length === 0 &&
            channelPricingsUpdated.length === 0 &&
            channelPricingsMissing.length === 0 &&
            channelPricingStartDatesToday.length === 0 &&
            channelPricingEndDatesToday.length === 0
        ) {
            this.logger.info(`No channel pricings to sync`);
            return;
        }

        this.logger.info(
            `Working on ${channelPricings.length} channel pricing entries`,
            {
                channelPricingsUpdated: channelPricingsUpdated.length,
                channelPricingsMissing: channelPricingsMissing.length,
                channelPricingStartDatesToday:
                    channelPricingStartDatesToday.length,
                channelPricingEndDatesToday: channelPricingEndDatesToday.length,
                disabledProductsSinceLastRun:
                    disabledProductsSinceLastRun.length,
                disabledVariantsSinceLastRun:
                    disabledVariantsSinceLastRun.length,
            },
        );

        /**
         * There can be multiple entries per variant, minQuantity and channel.
         * We need to filter first for only entries, with startDate before now or now and
         * for the entries with the most recent, currently active startDate, if we
         * have multiple entries with the same minQuantity and channel.
         */
        const basePriceEntries =
            this.getCurrentActiveBasePrices(channelPricings);

        const disabledProductIds = disabledProductsSinceLastRun.map(
            (product) => product.saleorProducts[0]?.id,
        );

        const productIdsFromDisabledVariants = disabledVariantsSinceLastRun.map(
            (variant) => variant.product.saleorProducts[0]?.id,
        );

        const channelPricingIds = channelPricings.map(
            (entry) => entry.productVariant.product.saleorProducts[0]?.id,
        );

        /**
         * All base price entries are related to product variants.
         * These are the unique saleor product ids these entries are related to.
         */
        const allUniqueSaleorProductIds = [
            ...new Set(
                disabledProductIds
                    .concat(channelPricingIds)
                    .concat(productIdsFromDisabledVariants)
                    .filter(Boolean),
            ),
        ];

        this.logger.info(
            `Syncing channel availability for ${allUniqueSaleorProductIds.length} unique saleor products. Getting the existing channel listings first`,
            {
                saleorProductIds: allUniqueSaleorProductIds,
            },
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
                        productVariantId: entry.productVariant.id,
                        sku: entry.productVariant.sku,
                    },
                );
                continue;
            }
            this.logger.info(
                `Syncing channel availability (base price) for product ${entry.productVariant.product.name} variant ${entry.productVariant.variantName}` +
                    ` at channel ${entry.salesChannel.name} with price ${entry.price} and min Quanity ${entry.minQuantity}`,
                {
                    productVariantId: entry.productVariant.id,
                    sku: entry.productVariant.sku,
                    basePrice: entry.price,
                    channel: entry.salesChannel.name,
                },
            );
            await this.syncBaseAvailability(entry, existingChannelListings);
        }
        for (const entry of disabledProductsSinceLastRun) {
            this.logger.info(
                `Disabling product in Saleor for product ${entry.name}`,
            );
            await this.disableProductInSaleor(
                entry.saleorProducts[0].id,
                existingChannelListings,
                entry.id,
            );
        }

        for (const entry of disabledVariantsSinceLastRun) {
            this.logger.info(
                `Disabling product variant in Saleor for product variant ${entry.variantName}`,
            );
            await this.disableVariantInSaleor(
                entry.saleorProductVariant[0].id,
                existingChannelListings,
                entry.productId,
            );
        }

        // Get all unique product variant ids
        const uniqueVariantIds = [
            ...new Set(channelPricings.map((entry) => entry.productVariantId)),
        ];
        /**
         * An array of unique product variant ids
         * [{ productVariantId: string, saleorProductVariantId: string, saleorProductId: string }]
         */
        const uniqueVariantIdsWithSaleorIds = uniqueVariantIds.map((id) => ({
            productVariantId: id,
            saleorProductVariantId: channelPricings.find(
                (p) => p.productVariantId === id,
            )?.productVariant.saleorProductVariant[0]?.id,
            saleorProductId: channelPricings.find(
                (p) => p.productVariantId === id,
            )?.productVariant.product.saleorProducts[0]?.id,
            sku: channelPricings.find((p) => p.productVariantId === id)
                ?.productVariant.sku,
        }));

        for (const entry of uniqueVariantIdsWithSaleorIds) {
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
        entry: {
            productVariantId: string;
            saleorProductVariantId: string | undefined;
            saleorProductId: string | undefined;
            sku: string | undefined;
        },
        existingListings?: ChannelListingsFragment[],
    ) {
        /**
         * pull all entries for quantity > 0 for this variant
         * and that are currently valid (no end date or end date after now).
         * We also filter for active entries
         */
        const entries = await this.db.salesChannelPriceEntry.findMany({
            where: {
                tenantId: this.tenantId,
                productVariantId: entry.productVariantId,
                minQuantity: {
                    gt: 1,
                },
                startDate: {
                    lte: new Date(),
                },
                active: true,
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

        if (!entry.saleorProductVariantId) {
            this.logger.info(
                `No saleor product variant found for product variant ${entry.productVariantId}`,
            );
            return;
        }
        const filteredEntries = entries.filter(
            (ent) => ent.endDate === null || isAfter(ent.endDate, new Date()),
        );

        const saleorProductId = entry.saleorProductId;

        const existingVariantMetafield = existingListings
            ?.find((l) => l.id === saleorProductId)
            ?.variants?.find(
                (v) => v.id === entry.saleorProductVariantId,
            )?.metafield;

        const metadataItemValue = filteredEntries.map((e) => ({
            channel: e.salesChannel.name.toLowerCase(),
            price: e.price,
            minQuantity: e.minQuantity,
            startDate: e.startDate,
            endDate: e.endDate,
            channelListingId: e.id,
        }));

        /**
         * compare the existing metadata with the new metadata
         * and skip update if there are no changes
         */
        if (
            (existingVariantMetafield &&
                existingVariantMetafield ===
                    JSON.stringify(metadataItemValue)) ||
            (!existingVariantMetafield && metadataItemValue.length === 0)
        ) {
            this.logger.debug(
                `Volume pricing metadata already up to date for product variant ${entry.productVariantId}`,
                {
                    productVariantId: entry.productVariantId,
                    sku: entry.sku,
                },
            );
            return;
        }

        if (metadataItemValue.length > 0) {
            this.logger.info(
                `Updating metadata with volume pricing for ` +
                    `product variant ${entry.productVariantId} ` +
                    `with saleor product variant ${entry.saleorProductVariantId}`,
                {
                    productVariantId: entry.productVariantId,
                    saleorProductVariantId: entry.saleorProductVariantId,
                    metadataItemValue,
                    sku: entry.sku,
                },
            );

            await this.saleorClient.saleorUpdateMetadata({
                id: entry.saleorProductVariantId,
                input: [
                    {
                        key: "volumePricingEntries",
                        value: JSON.stringify(metadataItemValue),
                    },
                ],
            });
        }
        if (metadataItemValue.length === 0) {
            this.logger.info(
                `Removing metadata with volume pricing for ` +
                    `product variant ${entry.productVariantId} ` +
                    `with saleor product variant ${entry.saleorProductVariantId}`,
                {
                    productVariantId: entry.productVariantId,
                    saleorProductVariantId: entry.saleorProductVariantId,
                    sku: entry.sku,
                },
            );
            await this.saleorClient.saleorDeleteMetadata({
                id: entry.saleorProductVariantId,
                keys: ["volumePricingEntries"],
            });
        }
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
                            {
                                sku: entry.productVariant.sku,
                                productVariantId: entry.productVariant.id,
                                basePrice: entry.price,
                            },
                        );
                        /**
                         * If we don't have a channel listing id stored in our DB yet,
                         * we store it now
                         */
                        const saleorProductChannelListingId =
                            existingChannelListing.id;
                        await this.db.saleorChannelListing.upsert({
                            where: {
                                id_installedSaleorAppId: {
                                    id: saleorProductChannelListingId,
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                            create: {
                                id: saleorProductChannelListingId,
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

                        return;
                    }
                }
            }
        }

        const productIsActive = entry.productVariant.product.active;

        const resp1 = await this.saleorClient.productChannelListingUpdate({
            id: saleorProductId,
            input: {
                updateChannels: [
                    {
                        availableForPurchaseAt: entry.startDate,
                        channelId: entry.salesChannel.saleorChannels[0].id,
                        visibleInListings: productIsActive,
                        isAvailableForPurchase: productIsActive,
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
