import { AssertionLogger, ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
    SaleorClient,
    getSaleorClientAndEntry,
    queryWithPagination,
} from "@eci/pkg/saleor";
// eslint-disable-next-line import/no-extraneous-dependencies
import { chunk } from "lodash";
import { ImageHasher } from "@eci/pkg/data-enrichtment/src/image-utils/image-hash";

interface SaleorMediaCleanupConfig {
    installedSaleorAppId: string;
    logger: ILogger;
    db: PrismaClient;
    saleorClient: SaleorClient;
}

export class SaleorMediaCleanup {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly saleorClient: SaleorClient;

    constructor(config: SaleorMediaCleanupConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.saleorClient = config.saleorClient;
    }

    public async cleanup() {
        this.logger.info("Starting Saleor media cleanup");

        const response = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorEntitySyncProducts({
                first,
                after,
                channel: null,
            }),
        );

        if (!response?.products?.edges) {
            this.logger.warn("No products found in response");
            return;
        }

        // The response will be an array of edges, each containing a node with the product data
        const allProducts = response.products.edges.map((edge) => edge.node);
        this.logger.info(`Found ${allProducts.length} products in total`);

        // Process products in chunks to avoid memory issues
        const chunks = chunk(allProducts, 50);
        for (const [index, productsChunk] of chunks.entries()) {
            this.logger.info(`Processing chunk ${index + 1}/${chunks.length}`);

            for (const product of productsChunk) {
                const productMedia = product.media || [];
                if (productMedia.length === 0) continue;

                // Check for deleted media in our DB
                // for (const media of productMedia) {
                //     const schemabaseId = media.schemabaseMediaId;
                //     if (!schemabaseId) continue;

                //     const dbMedia = await this.db.media.findUnique({
                //         where: { id: schemabaseId },
                //         include: { saleorMedia: true },
                //     });

                //     if (dbMedia?.deleted) {
                //         this.logger.info(
                //             `Found deleted media ${schemabaseId} in Saleor, cleaning up. Product: ${product.id}, URL: ${media.url}`,
                //         );
                //         try {
                //             await this.saleorClient.productMediaDelete({
                //                 id: media.id,
                //             });
                //         } catch (error) {
                //             if (error instanceof Error) {
                //                 this.logger.error(
                //                     `Failed to delete media ${media.id}: ${error.message}`,
                //                 );
                //             } else {
                //                 this.logger.error(
                //                     `Failed to delete media ${media.id}: ${String(error)}`,
                //                 );
                //             }
                //         }
                //     }
                // }

                await this.cleanupDuplicateMedia(product);
            }
        }

        this.logger.info("Finished Saleor media cleanup");
        await this.db.$disconnect();
    }

    private async cleanupDuplicateMedia(product: any) {
        const productMedia = product.media;
        if (productMedia.length === 0) return;

        // Get all variant media IDs and map them to their variants
        const variantMediaMap = new Map<string, Set<string>>(); // variant ID -> media IDs
        if (product.variants) {
            for (const variant of product.variants) {
                if (variant.media) {
                    const mediaIds = new Set<string>();
                    variant.media.forEach((media: any) => {
                        mediaIds.add(media.id);
                    });
                    variantMediaMap.set(variant.id, mediaIds);
                }
            }
        }

        // Function to get variant IDs for a media
        const getVariantIdsForMedia = (mediaId: string): string[] => {
            return (
                Array.from(variantMediaMap.entries())
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, mediaIds]) => mediaIds.has(mediaId))
                    .map(([variantId]) => variantId)
            );
        };

        // Check for duplicates using image hash comparison
        const mediaWithHashes: {
            id: string;
            url: string;
            hash: string;
            isVariantMedia: boolean;
            variantIds: string[];
        }[] = [];

        for (const media of productMedia) {
            if (!media.url) continue;

            try {
                const hash = await ImageHasher.generateImageHash(media.url);
                const variantIds = getVariantIdsForMedia(media.id);
                mediaWithHashes.push({
                    id: media.id,
                    url: media.url,
                    hash,
                    isVariantMedia: variantIds.length > 0,
                    variantIds,
                });
            } catch (error) {
                this.logger.error(
                    `Failed to hash media ${media.id}: ${error}, Media URL: ${media.url}, Product: ${product.id}`,
                );
            }
        }

        // Group media by hash
        const mediaByHash = new Map<
            string,
            (typeof mediaWithHashes)[number][]
        >();

        for (const media of mediaWithHashes) {
            const group = mediaByHash.get(media.hash) || [];
            group.push(media);
            mediaByHash.set(media.hash, group);
        }

        // Process each group of duplicates
        for (const [hash, mediaGroup] of mediaByHash.entries()) {
            if (mediaGroup.length <= 1) continue;

            this.logger.info(
                `Found ${mediaGroup.length} duplicates for hash ${hash}. Product: ${product.id}, URL: ${mediaGroup[0].url}`,
            );

            // Group variant media by their variant combinations
            const variantMediaGroups = new Map<
                string,
                (typeof mediaWithHashes)[number][]
            >();
            const nonVariantMedia = mediaGroup.filter(
                (media) => !media.isVariantMedia,
            );

            // Group variant media by their variant combination key
            mediaGroup
                .filter((media) => media.isVariantMedia)
                .forEach((media) => {
                    const variantKey = media.variantIds.sort().join(",");
                    const group = variantMediaGroups.get(variantKey) || [];
                    group.push(media);
                    variantMediaGroups.set(variantKey, group);
                });

            // Process each variant media group
            for (const [
                variantKey,
                variantGroup,
            ] of variantMediaGroups.entries()) {
                if (variantGroup.length > 1) {
                    // Keep the first one, delete the rest
                    const [keep, ...duplicates] = variantGroup;

                    this.logger.info(
                        `Keeping variant media ${keep.id} (variants: ${variantKey})`,
                    );

                    for (const duplicate of duplicates) {
                        this.logger.info(
                            `Deleting duplicate variant media ${duplicate.id} (variants: ${variantKey})`,
                        );
                        try {
                            await this.saleorClient.productMediaDelete({
                                id: duplicate.id,
                            });
                        } catch (error) {
                            if (error instanceof Error) {
                                this.logger.error(
                                    `Failed to delete duplicate variant media ${duplicate.id}: ${error.message}`,
                                );
                            } else {
                                this.logger.error(
                                    `Failed to delete duplicate variant media ${duplicate.id}: ${String(error)}`,
                                );
                            }
                        }
                    }
                }
            }

            // Process non-variant media
            if (nonVariantMedia.length > 0) {
                // Keep one media if no variant media exists for this hash
                const mediaToKeep = nonVariantMedia[0];

                // Delete all other non-variant media
                for (const media of nonVariantMedia) {
                    if (media.id === mediaToKeep.id) continue;

                    this.logger.info(
                        `Deleting duplicate product media ${media.id}`,
                    );

                    try {
                        await this.saleorClient.productMediaDelete({
                            id: media.id,
                        });
                    } catch (error) {
                        if (error instanceof Error) {
                            this.logger.error(
                                `Failed to delete duplicate media ${media.id}: ${error.message}`,
                            );
                        } else {
                            this.logger.error(
                                `Failed to delete duplicate media ${media.id}: ${String(error)}`,
                            );
                        }
                    }
                }
            }
        }
    }
}

async function main() {
    // Get installedSaleorAppId from command line arguments
    const installedSaleorAppId = process.argv[2];
    if (!installedSaleorAppId) {
        console.error("Please provide installedSaleorAppId as argument");
        process.exit(1);
    }

    const db = new PrismaClient();
    const { client: saleorClient } = await getSaleorClientAndEntry(
        installedSaleorAppId,
        db,
    );

    const cleanup = new SaleorMediaCleanup({
        installedSaleorAppId,
        db,
        logger: new AssertionLogger(),
        saleorClient,
    });

    await cleanup.cleanup();
}

main().catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
});
