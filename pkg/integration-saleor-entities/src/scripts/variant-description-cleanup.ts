/* eslint-disable import/no-extraneous-dependencies */
import { AssertionLogger, ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import {
    SaleorClient,
    getSaleorClientAndEntry,
    queryWithPagination,
} from "@eci/pkg/saleor";
import { chunk } from "lodash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface SaleorVariantDescriptionCleanupConfig {
    installedSaleorAppId: string;
    logger: ILogger;
    db: PrismaClient;
    saleorClient: SaleorClient;
    dryRun: boolean;
}

export class SaleorVariantDescriptionCleanup {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly saleorClient: SaleorClient;

    private readonly dryRun: boolean;

    private readonly installedSaleorAppId: string;

    // Track statistics
    private variantsProcessed = 0;

    private variantsWithDescriptionInSaleor = 0;

    private variantsWithDescriptionToClean = 0;

    private variantsCleanupFailed = 0;

    private variantsCleanupSucceeded = 0;

    constructor(config: SaleorVariantDescriptionCleanupConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.saleorClient = config.saleorClient;
        this.dryRun = config.dryRun;
        this.installedSaleorAppId = config.installedSaleorAppId;
    }

    public async cleanup(productId?: string) {
        if (productId) {
            this.logger.info(
                `Cleaning up variant descriptions for specific product: ${productId}${this.dryRun ? " (DRY RUN)" : ""}`,
            );
            try {
                const product = await this.fetchProduct(productId);
                await this.cleanupVariantDescriptions(product);
                this.logger.info(
                    `Finished cleaning up variant descriptions for product ${productId}`,
                );
            } catch (error) {
                this.logger.error(
                    `Error cleaning up product ${productId}: ${error}`,
                );
            }
        } else {
            this.logger.info(
                `Cleaning up variant descriptions for all products${this.dryRun ? " (DRY RUN)" : ""}`,
            );

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
                    await this.cleanupVariantDescriptions(product);
                }
            }
        }

        // Log final statistics
        this.logger.info("Variant description cleanup statistics:");
        this.logger.info(`Total variants processed: ${this.variantsProcessed}`);
        this.logger.info(
            `Variants with description in Saleor: ${this.variantsWithDescriptionInSaleor}`,
        );
        this.logger.info(
            `Variants with description to clean: ${this.variantsWithDescriptionToClean}`,
        );

        if (!this.dryRun) {
            this.logger.info(
                `Variants cleanup succeeded: ${this.variantsCleanupSucceeded}`,
            );
            this.logger.info(
                `Variants cleanup failed: ${this.variantsCleanupFailed}`,
            );
        } else {
            this.logger.info(`DRY RUN: No changes were made to Saleor`);
        }

        this.logger.info("Finished Saleor variant description cleanup");
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

    private async cleanupVariantDescriptions(product: any) {
        const variants = product.variants || [];
        if (variants.length === 0) {
            this.logger.info(`No variants found for product ${product.id}`);
            return;
        }

        this.logger.info(
            `Processing ${variants.length} variants for product ${product.id} (${product.name})`,
        );

        for (const variant of variants) {
            this.variantsProcessed++;
            await this.processVariant(variant, product);
        }
    }

    private async processVariant(variant: any, product: any) {
        // Find the variant_website_description attribute in Saleor
        const websiteDescAttr = variant.attributes?.find(
            (attr: any) =>
                attr.attribute.name === "variant_website_description",
        );

        if (
            !websiteDescAttr ||
            !websiteDescAttr.values ||
            websiteDescAttr.values.length === 0
        ) {
            // No variant_website_description attribute found in Saleor
            return;
        }

        this.variantsWithDescriptionInSaleor++;

        // Check if the variant exists in our database
        const dbVariant = await this.db.productVariant.findFirst({
            where: {
                saleorProductVariant: {
                    some: {
                        id: variant.id,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
            include: {
                attributes: {
                    include: {
                        attribute: true,
                    },
                },
            },
        });

        if (!dbVariant) {
            this.logger.warn(
                `Variant ${variant.id} (${variant.sku}) not found in our database. Skipping.`,
            );
            return;
        }

        // Check if the variant has the variant_website_description attribute in our database
        const hasWebsiteDescInDb = dbVariant.attributes.some(
            (attr) =>
                attr.attribute.normalizedName === "variantwebsitedescription" &&
                attr.value,
        );

        if (!hasWebsiteDescInDb) {
            this.variantsWithDescriptionToClean++;
            const variantInfo = `${variant.id} (${variant.sku})`;
            const action = this.dryRun ? "Would clean" : "Cleaning";
            this.logger.info(
                `Found variant ${variantInfo} with website description in Saleor ` +
                    `but not in our database. ${action} it up.`,
            );

            if (!this.dryRun) {
                try {
                    // Find the attribute ID for variant_website_description
                    const saleorAttributeId = websiteDescAttr.attribute.id;

                    // Update the variant in Saleor with an empty value for the attribute
                    await this.saleorClient.productVariantBulkUpdate({
                        productId: product.id,
                        variants: [
                            {
                                id: variant.id,
                                attributes: [
                                    {
                                        id: saleorAttributeId,
                                        richText:
                                            '{"time":1742475158646,"blocks":[],"version":"2.30.7"}', // Set to empty string
                                    },
                                ],
                            },
                        ],
                    });

                    this.variantsCleanupSucceeded++;
                    this.logger.info(
                        `Successfully cleaned up variant website description for variant ${variant.id} (${variant.sku})`,
                    );
                } catch (error) {
                    this.variantsCleanupFailed++;
                    if (error instanceof Error) {
                        this.logger.error(
                            `Failed to clean up variant website description for variant ${variant.id} (${variant.sku}): ${error.message}`,
                        );
                    } else {
                        this.logger.error(
                            `Failed to clean up variant website description for variant ${variant.id} (${variant.sku}): ${String(error)}`,
                        );
                    }
                }
            }
        }
    }
}

async function main() {
    // Parse command line arguments using yargs
    const argv = yargs(hideBin(process.argv))
        .option("app-id", {
            alias: "a",
            describe: "Installed Saleor App ID",
            type: "string",
            demandOption: true,
        })
        .option("product-id", {
            alias: "p",
            describe: "Specific product ID to clean up (optional)",
            type: "string",
        })
        .option("dry-run", {
            alias: "d",
            describe: "Run in dry-run mode (no changes will be made)",
            type: "boolean",
            default: false,
        })
        .help()
        .alias("help", "h").argv;

    // Extract arguments
    const installedSaleorAppId = argv["app-id"] as string;
    const productId = argv["product-id"] as string | undefined;
    const dryRun = argv["dry-run"] as boolean;

    const db = new PrismaClient();
    const { client: saleorClient } = await getSaleorClientAndEntry(
        installedSaleorAppId,
        db,
    );

    const cleanup = new SaleorVariantDescriptionCleanup({
        installedSaleorAppId,
        db,
        logger: new AssertionLogger(),
        saleorClient,
        dryRun,
    });

    try {
        await cleanup.cleanup(productId);
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
