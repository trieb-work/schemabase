import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";

/**
 * Saleor Sync Sub-class to sync product prices in different channels and
 * their general availability
 */
export class ChannelAvailability {
    private readonly db: PrismaClient;

    private readonly installedSaleorAppId: string;

    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

    public constructor(
        db: PrismaClient,
        installedSaleorAppId: string,
        logger: ILogger,
        saleorClient: SaleorClient,
    ) {
        this.db = db;
        this.installedSaleorAppId = installedSaleorAppId;
        this.logger = logger;
        this.saleorClient = saleorClient;
    }

    public async syncChannelAvailability(gteDate: Date) {
        const channelPricings = await this.db.salesChannelPriceEntry.findMany({
            where: {
                tenantId: this.installedSaleorAppId,
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
                /**
                 * We sync just the base-price for now, no volume discount prices
                 */
                minQuantity: {
                    lte: 1,
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
        );

        // we use the saleor mutations productChannelListingUpdate to make a saleor product general availability
        // at a channel.
        // The second mutation is productVariantChannelListingUpdate to set the price of a product variant at a channel
        for (const entry of channelPricings) {
            this.logger.info(
                `Syncing channel availability for product variant ${entry.productVariant.variantName}` +
                    ` at channel ${entry.salesChannel.name} with price ${entry.price}`,
            );
            const saleorProductId =
                entry.productVariant.product.saleorProducts?.[0]?.id;
            if (!saleorProductId) {
                this.logger.error(
                    `No saleor product id found for product variant ${entry.productVariant.id}`,
                );
                continue;
            }
            await this.saleorClient.productChannelListingUpdate({
                id: saleorProductId,
                input: {
                    updateChannels: [
                        {
                            availableForPurchaseAt: entry.startDate,
                            channelId: entry.salesChannel.saleorChannels[0].id,
                            visibleInListings: true,
                        },
                    ],
                },
            });
            await this.saleorClient.productVariantChannelListingUpdate({
                id: entry.productVariant.saleorProductVariant[0].id,
                input: {
                    channelId: entry.salesChannel.saleorChannels[0].id,
                    price: {
                        amount: entry.price,
                    },
                },
            });
        }
    }
}
