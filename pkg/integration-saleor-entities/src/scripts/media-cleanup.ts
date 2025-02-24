import { AssertionLogger, ILogger } from "@eci/pkg/logger";
import { PrismaClient, Media } from "@eci/pkg/prisma";
import {
    SaleorClient,
    getSaleorClientAndEntry,
    queryWithPagination,
} from "@eci/pkg/saleor";
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

                // Check for duplicates using image hash comparison
                const mediaWithHashes: {
                    id: string;
                    url: string;
                    hash?: string;
                }[] = [];

                for (const media of productMedia) {
                    try {
                        const hash = await ImageHasher.generateImageHash(
                            media.url,
                        );
                        mediaWithHashes.push({
                            id: media.id,
                            url: media.url,
                            hash,
                        });
                    } catch (error) {
                        this.logger.error(
                            `Failed to hash media ${media.id}: ${error}, Media URL: ${media.url}, Product: ${product.id}`,
                        );
                    }
                }

                // Group media by hash to find duplicates
                const hashMap = new Map<
                    string,
                    (typeof mediaWithHashes)[0][]
                >();
                for (const media of mediaWithHashes) {
                    if (!media.hash) continue;
                    const existing = hashMap.get(media.hash) || [];
                    existing.push(media);
                    hashMap.set(media.hash, existing);
                }

                // Delete duplicates
                for (const [hash, mediaGroup] of hashMap.entries()) {
                    if (mediaGroup.length <= 1) continue;

                    this.logger.info(
                        `Found ${mediaGroup.length} duplicates for hash ${hash}. Product: ${product.id}, URL: ${mediaGroup[0].url}`,
                    );

                    // Keep the first one, delete the rest
                    const [keep, ...duplicates] = mediaGroup;
                    for (const duplicate of duplicates) {
                        try {
                            await this.saleorClient.productMediaDelete({
                                id: duplicate.id,
                            });
                            this.logger.info(
                                `Deleted duplicate media ${duplicate.id}`,
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

        this.logger.info("Finished Saleor media cleanup");
        await this.db.$disconnect();
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
