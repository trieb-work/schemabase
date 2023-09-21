// class taking a tenant, db, logger and includes a method "addFBTProducts"
// takes all products and enriches one by one using our existing function frequentlyBoughtTogether.

import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import { FBT } from "./frequently-bought-with";

interface FrequentlyBoughtTogetherServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    tenantId: string;
}

export class FrequentlyBoughtTogetherService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly tenantId: string;

    public constructor(config: FrequentlyBoughtTogetherServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.tenantId = config.tenantId;
    }

    public async addFBTProducts() {
        const products = await this.db.product.findMany({
            where: {
                tenantId: this.tenantId,
            },
            include: {
                variants: {
                    include: {
                        attributes: true,
                    },
                },
            },
        });

        for (const product of products) {
            const fbt = new FBT({
                db: this.db,
                tenantId: [product.tenantId],
                logger: this.logger,
            });
            const fbtProducts = await fbt.getProductsBoughtTogether(product.id);
            if (fbtProducts.length === 0) {
                continue;
            }
            this.logger.info(
                `Found ${fbtProducts.length} frequently bought together products for product ${product.name}`,
                {
                    fbtProducts: fbtProducts.map((p) => p.name),
                },
            );
            // We have the table ProductToFrequentlyBoughtWith storing all entries
            // of frequently bought together products. Sync this table, so that it fits exactly
            // the entries from fbtProducts. Only make database write or delete when needed
            // to avoid unnecessary database load
            const fbtProductsIds = fbtProducts.map((p) => p.id);
            const existingFbtProducts =
                await this.db.productToFrequentlyBoughtWith.findMany({
                    where: {
                        productId: product.id,
                    },
                    include: {
                        relatedProduct: true,
                    },
                });
            const existingFbtProductsIds = existingFbtProducts.map(
                (p) => p.relatedProductId,
            );
            const newFbtProductsIds = fbtProductsIds.filter(
                (id) => !existingFbtProductsIds.includes(id),
            );
            const deletedFbtProductsIds = existingFbtProductsIds.filter(
                (id) => !fbtProductsIds.includes(id),
            );
            // add new entries
            for (const id of newFbtProductsIds) {
                await this.db.productToFrequentlyBoughtWith.create({
                    data: {
                        product: {
                            connect: {
                                id: product.id,
                            },
                        },
                        relatedProduct: {
                            connect: {
                                id,
                            },
                        },
                    },
                });
            }
            // delete old entries
            for (const id of deletedFbtProductsIds) {
                await this.db.productToFrequentlyBoughtWith.delete({
                    where: {
                        productId_relatedProductId: {
                            productId: product.id,
                            relatedProductId: id,
                        },
                    },
                });
            }
        }
    }
}
