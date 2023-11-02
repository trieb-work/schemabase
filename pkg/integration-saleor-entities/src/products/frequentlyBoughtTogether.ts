// this class checks if their are changed entries in the ProductToFrequentlyBoughtWith
// for the requested installedSaleorid and GTE date, taking only products that have a saleor Id. If there are updates,
// update the saleor product attribute "Frequently Bought Together" with the new list of products. Take the attribute id
// from the product type attribute with the name "frequentlyboughttogether" and the saleor attribute id from the attribute

import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { ProductVariantBulkUpdateInput, SaleorClient } from "@eci/pkg/saleor";

export class FrequentlyBoughtTogether {
    private readonly db: PrismaClient;

    private readonly installedSaleorAppId: string;

    private readonly logger: ILogger;

    private readonly saleorClient: SaleorClient;

    public constructor(config: {
        db: PrismaClient;
        installedSaleorAppId: string;
        tenantId: string;
        logger: ILogger;
        saleorClient: SaleorClient;
    }) {
        this.db = config.db;
        this.installedSaleorAppId = config.installedSaleorAppId;
        this.logger = config.logger;
        this.saleorClient = config.saleorClient;
    }

    /**
     * sync the product variants frequently bought together. Use the productVriantBulkUpdate API
     * @param gteDate
     * @returns
     */
    public async syncVariants(gteDate: Date) {
        const fbts = await this.db.product.findMany({
            where: {
                variants: {
                    some: {
                        saleorProductVariant: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },

                        frequentlyBoughtWith: {
                            some: {
                                updatedAt: {
                                    gte: gteDate,
                                },
                            },
                        },
                    },
                },
            },
            include: {
                productType: {
                    include: {
                        attributes: {
                            where: {
                                attribute: {
                                    normalizedName: "frequentlyboughttogether",
                                },
                            },
                            include: {
                                attribute: {
                                    include: {
                                        saleorAttributes: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorAppId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                saleorProducts: {
                    where: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                variants: {
                    include: {
                        saleorProductVariant: {
                            where: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                        frequentlyBoughtWith: {
                            include: {
                                variant: {
                                    include: {
                                        saleorProductVariant: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorAppId,
                                            },
                                        },
                                    },
                                },
                                relatedVariant: {
                                    include: {
                                        saleorProductVariant: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorAppId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (fbts.length === 0) {
            this.logger.info("No changes in FBT. Exiting.");
            return;
        }

        /**
         * We run the bulk update for each product, including all variants
         * of the product.
         */
        for (const prod of fbts) {
            /**
             * The saleor product, whose variants we are updating now
             */
            const saleorProduct = prod.saleorProducts.find(
                (sp) => sp.installedSaleorAppId === this.installedSaleorAppId,
            );

            if (!saleorProduct) {
                this.logger.error(
                    `Product ${prod.id} has no saleor product with installedSaleorAppId ${this.installedSaleorAppId}`,
                );
                continue;
            }
            const productType = prod.productType;
            if (
                !productType?.attributes[0]?.attribute?.saleorAttributes[0]?.id
            ) {
                this.logger.error(
                    `Product ${prod.id} has no attribute with name "frequentlyboughttogether"`,
                );
                continue;
            }

            /**
             * The bulk update input for the variants
             */
            const bulkUpdate: ProductVariantBulkUpdateInput[] = [];

            /**
             * The variants of the product
             */
            const variants = prod.variants;

            /**
             * Loop over all variants of the product
             */
            for (const variant of variants) {
                const saleorVariant = variant.saleorProductVariant.find(
                    (spv) =>
                        spv.installedSaleorAppId === this.installedSaleorAppId,
                );

                if (!saleorVariant) {
                    this.logger.error(
                        `Product variant ${variant.sku} - Product ${prod.id} has` +
                            `no saleor variant with installedSaleorAppId ${this.installedSaleorAppId}`,
                    );
                    continue;
                }

                /**
                 * Array of just the saleor ids of all frequentlyBoughtWith variants
                 */
                const referingVariants = variant.frequentlyBoughtWith
                    .map((fbt) => {
                        const saleorVariantInner =
                            fbt.relatedVariant.saleorProductVariant.find(
                                (spv) =>
                                    spv.installedSaleorAppId ===
                                    this.installedSaleorAppId,
                            );
                        if (!saleorVariantInner) {
                            this.logger.warn(
                                `Product ${prod.id} has no saleor product with installedSaleorAppId ${this.installedSaleorAppId}`,
                            );
                            return;
                        }
                        return saleorVariantInner.id;
                    })
                    .filter((id): id is string => id !== undefined) as string[];

                this.logger.info(
                    `Updating FBT for variant ${variant.sku} with saleor id ${saleorProduct.id} with ${referingVariants.length} variants`,
                    {
                        referingVariants,
                    },
                );

                bulkUpdate.push({
                    id: variant.saleorProductVariant[0].id,
                    attributes: [
                        {
                            id: productType.attributes[0].attribute
                                .saleorAttributes[0].id,
                            references: referingVariants,
                        },
                    ],
                });
            }

            await this.saleorClient.productVariantBulkUpdate({
                productId: saleorProduct.id,
                variants: bulkUpdate,
            });
        }
    }

    public async syncProducts(gteDate: Date) {
        const fbts = await this.db.product.findMany({
            where: {
                saleorProducts: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                frequentlyBoughtWith: {
                    some: {
                        updatedAt: {
                            gte: gteDate,
                        },
                    },
                },
            },
            include: {
                saleorProducts: {
                    where: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                productType: {
                    include: {
                        attributes: {
                            where: {
                                attribute: {
                                    normalizedName: "frequentlyboughttogether",
                                },
                            },
                            include: {
                                attribute: {
                                    include: {
                                        saleorAttributes: {
                                            where: {
                                                installedSaleorAppId:
                                                    this.installedSaleorAppId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                frequentlyBoughtWith: {
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
                        relatedProduct: {
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
                },
            },
        });

        if (fbts.length === 0) {
            this.logger.info("No changes in FBT. Exiting.");
            return;
        }

        for (const pd of fbts) {
            const saleorProduct = pd.saleorProducts.find(
                (sp) => sp.installedSaleorAppId === this.installedSaleorAppId,
            );

            if (!saleorProduct) {
                this.logger.error(
                    `Product ${pd.id} has no saleor product with installedSaleorAppId ${this.installedSaleorAppId}`,
                );
                continue;
            }
            const productType = pd.productType;
            if (
                !productType?.attributes[0]?.attribute?.saleorAttributes[0]?.id
            ) {
                this.logger.error(
                    `Product ${pd.id} has no attribute with name "frequentlyboughttogether"`,
                );
                continue;
            }

            const frequentlyBoughtTogetherArray = pd.frequentlyBoughtWith;

            /**
             * Array of just the saleor ids of all frequentlyBoughtWith products
             */
            const referingProducts = frequentlyBoughtTogetherArray
                .map((fbt) => {
                    const saleorProductInner =
                        fbt.relatedProduct.saleorProducts.find(
                            (sp) =>
                                sp.installedSaleorAppId ===
                                this.installedSaleorAppId,
                        );
                    if (!saleorProductInner) {
                        this.logger.warn(
                            `Product ${pd.id} has no saleor product with installedSaleorAppId ${this.installedSaleorAppId}`,
                        );
                        return;
                    }
                    return saleorProductInner.id;
                })
                .filter((id): id is string => id !== undefined) as string[];

            this.logger.info(
                `Updating FBT for product ${pd.id} with saleor id ${saleorProduct.id} with ${referingProducts.length} products`,
                {
                    referingProducts,
                },
            );
            await this.saleorClient.productUpdate({
                id: saleorProduct.id,
                input: {
                    attributes: [
                        {
                            id: productType.attributes[0].attribute
                                .saleorAttributes[0].id,
                            references: referingProducts,
                        },
                    ],
                },
            });
        }
    }
}
