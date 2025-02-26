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

    private variantMediaMap = new Map<string, Set<string>>();

    constructor(config: SaleorMediaCleanupConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.saleorClient = config.saleorClient;
    }

    public async cleanup() {
        const productId = process.argv[3];

        if (productId) {
            this.logger.info(
                `Cleaning up media for specific product: ${productId}`,
            );
            try {
                const product = await this.fetchProduct(productId);
                await this.cleanupDuplicateMedia(product);
                this.logger.info(
                    `Finished cleaning up media for product ${productId}`,
                );
            } catch (error) {
                this.logger.error(
                    `Error cleaning up product ${productId}: ${error}`,
                );
            }
        } else {
            this.logger.info("Cleaning up media for all products");

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
            const allProducts = response.products.edges.map(
                (edge) => edge.node,
            );
            this.logger.info(`Found ${allProducts.length} products in total`);

            // Process products in chunks to avoid memory issues
            const chunks = chunk(allProducts, 50);
            for (const [index, productsChunk] of chunks.entries()) {
                this.logger.info(
                    `Processing chunk ${index + 1}/${chunks.length}`,
                );

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
        }

        this.logger.info("Finished Saleor media cleanup");
        await this.db.$disconnect();
    }

    private async fetchProduct(productId: string) {
        const response = await this.saleorClient.saleorEntitySyncProducts({
            first: 1,
            ids: [productId],
            channel: null,
        });

        if (!response?.products?.edges.length) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        return response.products.edges[0].node;
    }

    private async cleanupDuplicateMedia(product: any) {
        const productMedia = product.media;
        if (productMedia.length === 0) {
            this.logger.info(`No media found for product ${product.id}`);
            return;
        }

        this.logger.info(
            `Processing ${productMedia.length} media items for product ${product.id}`,
        );

        // Reset and populate variant media map for this product
        this.variantMediaMap.clear();
        let hasVariantSpecificMedia = false;

        // Check if product has more than one variant
        const variants = product.variants || [];
        const hasSingleVariant = variants.length === 1;

        if (hasSingleVariant) {
            this.logger.info(
                `Product has only one variant, treating as product without variant-specific media`,
            );
            hasVariantSpecificMedia = false;
        } else if (variants.length > 1) {
            // Only check for variant-specific media if product has multiple variants
            for (const variant of variants) {
                if (variant.media && variant.media.length > 0) {
                    this.logger.info(
                        `Found variant ${variant.id} with ${variant.media.length} media items`,
                    );
                    const mediaIds = new Set<string>();
                    variant.media.forEach((media: any) => {
                        mediaIds.add(media.id);
                        hasVariantSpecificMedia = true;
                    });
                    this.variantMediaMap.set(variant.id, mediaIds);
                }
            }
        }

        this.logger.info(
            `Product has ${variants.length} variants and ${hasVariantSpecificMedia ? "has" : "does not have"} variant-specific media`,
        );

        // Check for duplicates using image hash comparison
        const mediaWithHashes: {
            id: string;
            url: string;
            hash: string;
            isVariantMedia: boolean;
            variantIds: string[];
        }[] = [];

        for (const media of productMedia) {
            if (!media.url) {
                this.logger.warn(`Media ${media.id} has no URL, skipping`);
                continue;
            }

            try {
                const hash = await ImageHasher.generateImageHash(media.url);
                const variantIds = this.getVariantIdsForMedia(media.id);
                mediaWithHashes.push({
                    id: media.id,
                    url: media.url,
                    hash,
                    isVariantMedia: variantIds.length > 0,
                    variantIds,
                });
                this.logger.info(
                    `Generated hash for media ${media.id}: ${hash} (${media.url})`,
                );
            } catch (error) {
                this.logger.error(
                    `Failed to hash media ${media.id}: ${error}, Media URL: ${media.url}, Product: ${product.id}`,
                );
            }
        }

        this.logger.info(
            `Successfully hashed ${mediaWithHashes.length} media items`,
        );

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

        // Log the groups we found
        for (const [hash, group] of mediaByHash.entries()) {
            this.logger.info(`Hash group ${hash}: ${group.length} items`, {
                mediaIds: group.map((m) => m.id).join(", "),
                urls: group.map((m) => m.url).join(", "),
            });
        }

        // Process each group of duplicates
        for (const [hash, mediaGroup] of mediaByHash.entries()) {
            if (mediaGroup.length <= 1) {
                this.logger.info(`No duplicates found for hash ${hash}`);
                continue;
            }

            this.logger.info(
                `Found ${mediaGroup.length} duplicates for hash ${hash}. Product: ${product.id}, URL: ${mediaGroup[0].url}`,
            );

            if (hasVariantSpecificMedia) {
                // Handle variant-specific media cleanup
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
            } else {
                // Simple case: No variant-specific media, treat all as product media
                // Keep the first one, delete all duplicates
                const [keep, ...duplicates] = mediaGroup;

                this.logger.info(
                    `Product has no variant-specific media. Keeping media ${keep.id} (${keep.url})`,
                );

                for (const duplicate of duplicates) {
                    this.logger.info(
                        `Deleting duplicate product media ${duplicate.id} (${duplicate.url})`,
                    );

                    try {
                        await this.saleorClient.productMediaDelete({
                            id: duplicate.id,
                        });
                        this.logger.info(
                            `Successfully deleted media ${duplicate.id}`,
                        );
                    } catch (error) {
                        if (error instanceof Error) {
                            this.logger.error(
                                `Failed to delete duplicate media ${duplicate.id}: ${error.message}`,
                            );
                        } else {
                            this.logger.error(
                                `Failed to delete duplicate media ${duplicate.id}: ${String(error)}`,
                            );
                        }
                    }
                }
            }
        }
    }

    private getVariantIdsForMedia(mediaId: string): string[] {
        return Array.from(this.variantMediaMap.entries())
            .filter(([_, mediaIds]: [string, Set<string>]) =>
                mediaIds.has(mediaId),
            )
            .map(([variantId]: [string, Set<string>]) => variantId);
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

    try {
        await cleanup.cleanup();
        process.exit(0);
    } catch (error) {
        console.error("Error running cleanup:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
