// this class checks if their are changed entries in the ProductToFrequentlyBoughtWith
// for the requested installedSaleorid and GTE date, taking only products that have a saleor Id. If there are updates,
// update the saleor product attribute "Frequently Bought Together" with the new list of products. Take the attribute id
// from the product type attribute with the name "frequentlyboughttogether" and the saleor attribute id from the attribute

import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { SaleorClient } from "@eci/pkg/saleor";

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

    public async sync(gteDate: Date) {
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

            /**
             * Array of just the saleor ids of all frequentlyBoughtWith products
             */
            const referingProducts = pd.frequentlyBoughtWith
                .map((fbt) => {
                    const saleorProductInner = fbt.product.saleorProducts.find(
                        (sp) =>
                            sp.installedSaleorAppId ===
                            this.installedSaleorAppId,
                    );
                    if (!saleorProductInner) {
                        this.logger.error(
                            `Product ${pd.id} has no saleor product with installedSaleorAppId ${this.installedSaleorAppId}`,
                        );
                        return;
                    }
                    return saleorProductInner.id;
                })
                .filter((id): id is string => id !== undefined) as string[];

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
