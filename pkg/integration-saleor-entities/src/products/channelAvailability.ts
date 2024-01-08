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
import { SaleorClient } from "@eci/pkg/saleor";
import { isAfter, isBefore } from "date-fns";

/**
 * Saleor Sync Sub-class to sync product prices in different channels and
 * their general availability
 */
export class ChannelAvailability {
    private readonly db: PrismaClient;

    private readonly installedSaleorAppId: string;

    private readonly tenantId: string;

    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

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
    }

    public async syncChannelAvailability(gteDate: Date) {
        this.logger.debug(`Looking for channel updates since ${gteDate}`);
        const channelPricings = await this.db.salesChannelPriceEntry.findMany({
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
            include: {
                salesChannel: {
                    include: {
                        saleorChannels: {
                            where: {
                                installedSaleorAppId: this.installedSaleorAppId,
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
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
            },
        });

        if (channelPricings.length === 0) {
            this.logger.info(`No channel pricings to sync`);
            return;
        }

        this.logger.info(
            `Working on ${channelPricings.length} channel pricing entries`,
            {
                channelPricings: channelPricings.map((entry) => ({
                    variantName: entry.productVariant.variantName,
                    channelName: entry.salesChannel.name,
                    minQuantity: entry.minQuantity,
                    price: entry.price,
                })),
            },
        );

        const basePriceEntries = channelPricings.filter(
            (entry) => entry.minQuantity <= 1,
        );

        for (const entry of basePriceEntries) {
            this.logger.info(
                `Syncing channel availability for product variant ${entry.productVariant.variantName}` +
                    ` at channel ${entry.salesChannel.name} with price ${entry.price} and min Quanity ${entry.minQuantity}`,
            );
            if (entry && isBefore(entry.startDate, new Date())) continue;

            await this.syncBaseAvailability(entry);
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
            await this.syncVolumeDiscounts(entry);
        }
    }

    /**
     * Sync the volume discount entries. Currently, Saleor is lacking this feature
     * so we just write this information in the product variant metadata.
     * We will need to update this logic once Saleor implements volume discounts
     * @param entry
     */
    private async syncVolumeDiscounts(prodVariantId: string) {
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

        const metadataItemValue = filteredEntries.map((entry) => ({
            channel: entry.salesChannel.name.toLowerCase(),
            price: entry.price,
            minQuantity: entry.minQuantity,
            startDate: entry.startDate,
            endDate: entry.endDate,
            channelListingId: entry.id,
        }));

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
    ) {
        const saleorProductId =
            entry.productVariant.product.saleorProducts?.[0]?.id;
        if (!saleorProductId) {
            this.logger.error(
                `No saleor product id found for product variant ${entry.productVariant.id}`,
            );
            return;
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
