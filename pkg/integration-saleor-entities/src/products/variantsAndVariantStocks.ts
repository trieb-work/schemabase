/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient } from "@eci/pkg/prisma";
import { queryWithPagination, SaleorClient } from "@eci/pkg/saleor";

export class VariantAndVariantStocks {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    private readonly saleorClient: SaleorClient;

    private readonly installedSaleorAppId: string;

    constructor({
        logger,
        db,
        saleorClient,
        installedSaleorAppId,
    }: {
        logger: ILogger;
        db: PrismaClient;
        saleorClient: SaleorClient;
        installedSaleorAppId: string;
    }) {
        this.logger = logger;
        this.db = db;
        this.saleorClient = saleorClient;
        this.installedSaleorAppId = installedSaleorAppId;
    }

    /**
     * Aggregate the customer ratings of all variants together and sets the
     * aggregated data as metadata in saleor
     * @param productSet
     */
    private async setAggregatedProductRating(productSet: {
        eciProductId: string;
        saleorProductId: string;
    }) {
        this.logger.info(
            `Updating average aggregated product rating for ${JSON.stringify(
                productSet,
            )}.`,
        );
        const productRatings = await this.db.productVariant.aggregate({
            where: {
                productId: productSet.eciProductId,
                active: true,
            },
            _sum: {
                ratingCount: true,
            },
            _avg: {
                averageRating: true,
            },
        });

        if (
            !productRatings._avg.averageRating ||
            !productRatings._sum.ratingCount
        ) {
            this.logger.info(
                `No aggregated product ratings found for ${JSON.stringify(
                    productSet,
                )}.`,
            );
            return;
        }

        // to make use of shop facet filters, we create a metadata item with name "customerRatings_facet"
        const facetValue = [];
        for (let i = 1; i <= productRatings._avg.averageRating; i++) {
            facetValue.push(`${i}-and-above`);
        }

        const metadataNew = [
            {
                key: "customerRatings_facet",
                value: JSON.stringify(facetValue),
            },
            {
                key: "customerRatings_averageRating",
                value: productRatings._avg.averageRating.toString(),
            },
            {
                key: "customerRatings_ratingCount",
                value: productRatings._sum.ratingCount.toString(),
            },
        ];
        this.logger.debug(
            `Sending this metadata: ${JSON.stringify(metadataNew)}`,
        );
        await this.saleorClient.saleorUpdateMetadata({
            id: productSet.saleorProductId,
            input: metadataNew,
        });
    }

    /**
     * Gets saleor product variant with their stock and
     * metadata. Deletes a product variant in our db, if it does not exist in saleor
     * any more
     */
    private async getSaleorProductVariants(variantIds: string[]) {
        // Get the current commited stock and the metadata of this product variant from saleor.
        //     // We need fresh data here, as the commited stock can change all the time.
        const response = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorProductVariantsBasicData({
                first,
                after,
                ids: variantIds,
            }),
        );
        const variants = response.productVariants;
        if (!variants) {
            this.logger.warn(
                `No product variants returned from saleor for ids ${variantIds}! Cant update stocks.\
              Deleting variants in internal DB`,
            );
            if (variantIds.length > 0)
                await this.db.saleorProductVariant.deleteMany({
                    where: {
                        id: {
                            in: variantIds,
                        },
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                });
            return null;
        }
        /**
         * check for the IDs of the variants, that we have in our DB, but not in saleor and delete them in our DB
         */
        const variantIdsInSaleor = variants.edges.map((v) => v.node.id);
        const variantIdsToDelete = variantIds.filter(
            (v) => !variantIdsInSaleor.includes(v),
        );
        if (variantIdsToDelete.length > 0) {
            this.logger.info(
                `Deleting ${variantIdsToDelete.length} variants in internal DB, that do not exist in saleor any more`,
            );
            await this.db.saleorProductVariant.deleteMany({
                where: {
                    id: {
                        in: variantIdsToDelete,
                    },
                    installedSaleorAppId: this.installedSaleorAppId,
                },
            });
        }

        /**
         * Rewriting the resulting data, returning edges.map((e) => node)
         * and making in every node the stock non nullable in the retruning type
         */
        const variantsWithStock = variants.edges.map((e) => ({
            ...e.node,
            stocks: e.node.stocks ?? [],
        }));

        return variantsWithStock;
    }

    /**
     * Syncs only stock information to Saleor
     * @param createdGte Date to look for stock changes since
     */
    public async syncStocks(createdGte: Date) {
        this.logger.info(
            `Looking for saleor product variants with stock changes since ${createdGte}`,
        );
        /**
         * get all saleor productVariants where related stockEntries have been updated since last run
         */
        const productVariantsWithStockChanges =
            await this.db.productVariant.findMany({
                where: {
                    saleorProductVariant: {
                        some: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                    stockEntries: {
                        some: {
                            updatedAt: {
                                gte: createdGte,
                            },
                        },
                    },
                },
                include: {
                    saleorProductVariant: {
                        where: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                    stockEntries: {
                        include: {
                            warehouse: {
                                include: {
                                    saleorWarehouse: {
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

        this.logger.info(
            `Found ${productVariantsWithStockChanges.length} product variants with stock changes since the last run`,
            {
                productVariantsWithStockChanges:
                    productVariantsWithStockChanges.map((x) => x.sku),
            },
        );

        if (productVariantsWithStockChanges.length === 0) {
            return;
        }

        /**
         * All warehouses with saleor id and internal ECI id
         */
        const warehouses = await this.db.saleorWarehouse.findMany({
            where: {
                installedSaleorAppId: this.installedSaleorAppId,
            },
            select: {
                id: true,
                warehouseId: true,
                warehouse: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        /**
         * All unique Saleor product variant ids from the productVariantsWithStockChanges
         */
        const saleorProductVariantIds = [
            ...new Set(
                productVariantsWithStockChanges.map(
                    (x) => x.saleorProductVariant[0].id,
                ),
            ),
        ];

        const saleorProductVariantsFromSaleor =
            (await this.getSaleorProductVariants(saleorProductVariantIds)) ||
            [];

        // Collect all stock updates for bulk operation
        const stockUpdates: Array<{
            variantId: string;
            warehouseId: string;
            quantity: number;
        }> = [];

        for (const schemabaseVariant of productVariantsWithStockChanges) {
            const saleorVariant = saleorProductVariantsFromSaleor.find(
                (x) => x.id === schemabaseVariant.saleorProductVariant[0].id,
            );
            if (!saleorVariant) {
                this.logger.warn(
                    `Saleor product variant with id ${schemabaseVariant.saleorProductVariant[0].id} not found in saleor. Skipping`,
                );
                continue;
            }

            // loop over all stock entries that we have and bring them to saleor
            for (const stockEntry of schemabaseVariant.stockEntries) {
                // Check, if we have a saleor warehouse for this stock entry.
                // If not continue.
                const saleorWarehouse = warehouses.find(
                    (sw) => sw.warehouseId === stockEntry.warehouseId,
                );
                const saleorWarehouseId = saleorWarehouse?.id;
                /**
                 * Just update the stock for warehouses, that we have configured in Saleor
                 */
                if (!saleorWarehouseId) {
                    this.logger.warn(
                        `No saleor warehouse found for warehouse ${stockEntry.warehouseId}. Skipping`,
                    );
                    continue;
                }
                /**
                 * The stock information of the current product variant in the current warehouse
                 */
                const saleorStockEntry = saleorVariant.stocks.find(
                    (x) => x?.warehouse.id === saleorWarehouseId,
                );
                const currentlyAllocated =
                    saleorStockEntry?.quantityAllocated || 0;

                /**
                 * to get the "real" available stock, we have to add the currently allocated stock from saleor
                 */
                const totalQuantity =
                    stockEntry.actualAvailableForSaleStock + currentlyAllocated;

                // only add to bulk update if the stock has changed
                if (saleorStockEntry?.quantity !== totalQuantity) {
                    stockUpdates.push({
                        variantId: saleorVariant.id,
                        warehouseId: saleorWarehouseId,
                        quantity: totalQuantity,
                    });
                    this.logger.debug(
                        `Preparing stock update for ${schemabaseVariant.sku} - id ${saleorVariant.id}`,
                        {
                            stockBefore: saleorStockEntry?.quantity,
                            stockAfter: totalQuantity,
                            sku: schemabaseVariant.sku,
                            warehouseName: saleorWarehouse?.warehouse.name,
                        },
                    );
                }
            }

            // we can have cases, where a variant has stock and stock allocations for a warehouse, but we no longer
            // have stock in that warehouse internally. We have to level the stock in saleor with the allocated stock to
            // basically zero it out
            for (const stockEntry of saleorVariant.stocks) {
                const saleorWarehouseId = stockEntry.warehouse.id;
                const saleorWarehousesInSchemabase =
                    schemabaseVariant.stockEntries.map(
                        (x) => x.warehouse.saleorWarehouse[0].id,
                    );
                if (
                    !saleorWarehousesInSchemabase.includes(saleorWarehouseId) &&
                    stockEntry.quantityAllocated > 0 &&
                    !stockEntry.warehouse.name.toLowerCase().includes("virtual")
                ) {
                    this.logger.info(
                        `Found stock in warehouse ${stockEntry.warehouse.name} that is no longer in schemabase. Leveling it to ${stockEntry.quantityAllocated}`,
                    );
                    stockUpdates.push({
                        variantId: saleorVariant.id,
                        warehouseId: saleorWarehouseId,
                        quantity: stockEntry.quantityAllocated,
                    });
                }
            }
        }

        // Perform bulk stock update if there are any updates
        if (stockUpdates.length > 0) {
            this.logger.info(
                `Performing bulk stock update for ${stockUpdates.length} stock entries`,
            );

            try {
                const result = await this.saleorClient.bulkStockUpdate({
                    stocks: stockUpdates,
                });

                if (
                    result.stockBulkUpdate?.errors &&
                    result.stockBulkUpdate.errors.length > 0
                ) {
                    this.logger.error(
                        `Bulk stock update completed with errors:`,
                        {
                            errors: result.stockBulkUpdate.errors,
                        },
                    );
                } else {
                    this.logger.info(
                        `Successfully completed bulk stock update for ${stockUpdates.length} entries`,
                    );
                }
            } catch (error) {
                this.logger.error(`Failed to perform bulk stock update:`, {
                    error:
                        error instanceof Error ? error.message : String(error),
                    stockUpdatesCount: stockUpdates.length,
                });
                throw error;
            }
        } else {
            this.logger.info("No stock updates needed");
        }
    }

    /**
     * Syncs both variant information and stock information to Saleor
     * @param createdGte Date to look for changes since
     */
    public async syncVariantsAndVariantStocks(createdGte: Date) {
        this.logger.info(
            `Looking for saleor product variants with changes since ${createdGte}`,
        );
        // First, handle stock updates
        await this.syncStocks(createdGte);
        // Then, handle variant metadata and name updates
        const variantWithUpdates = await this.db.productVariant.findMany({
            where: {
                saleorProductVariant: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                updatedAt: {
                    gte: createdGte,
                },
            },
            include: {
                saleorProductVariant: {
                    where: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
        });

        this.logger.info(
            `Found ${variantWithUpdates.length} product variants with updates since the last run`,
            {
                variantWithUpdates: variantWithUpdates.map((x) => x.sku),
            },
        );

        if (variantWithUpdates.length === 0) {
            return;
        }

        /**
         * A set of products, whose reviews have changed. We need this to update the average rating of the product.
         * Stores the internal ECI product id and the saleor product id.
         */
        const productsWithReviewsChanged = new Set<{
            eciProductId: string;
            saleorProductId: string;
        }>();

        /**
         * All unique Saleor product variant ids from variantWithUpdates
         */
        const saleorProductVariantIds = [
            ...new Set(
                variantWithUpdates.map((x) => x.saleorProductVariant[0].id),
            ),
        ];

        const saleorProductVariantsFromSaleor =
            (await this.getSaleorProductVariants(saleorProductVariantIds)) ||
            [];
        // Process variant updates (name, metadata, ratings)

        for (const schemabaseVariant of variantWithUpdates) {
            const variant = saleorProductVariantsFromSaleor.find(
                (x) => x.id === schemabaseVariant.saleorProductVariant[0].id,
            );

            if (!variant) return;

            // We parse the current product ratings from the metadata. We create a object productRating with averageRating and ratingCount.
            // The data is located in the saleor metadata in the fields customerRatings_averageRating  and customerRatings_ratingCount
            /**
             * The parsed customer rating from Saleor
             */
            const productRatingFromSaleor = {
                averageRating: 0,
                ratingCount: 0,
            };

            const averageRating = variant.metadata.find(
                (x) => x.key === "customerRatings_averageRating",
            )?.value;
            productRatingFromSaleor.averageRating = parseFloat(
                averageRating || "0",
            );

            const ratingCount = variant.metadata.find(
                (x) => x.key === "customerRatings_ratingCount",
            )?.value;
            productRatingFromSaleor.ratingCount = parseInt(ratingCount || "0");

            /**
             * check, if user ratings did change and update them in saleor
             */
            if (
                schemabaseVariant.averageRating &&
                schemabaseVariant.ratingCount &&
                productRatingFromSaleor.averageRating !==
                    schemabaseVariant.averageRating
            ) {
                this.logger.info(
                    `Updating average rating for ${variant.id} / ${schemabaseVariant.sku} to ${schemabaseVariant.averageRating}. Old rating was ${productRatingFromSaleor?.averageRating}`,
                );

                // adding the product to the set of products with changed reviews, so that we update the
                // product metadata as well
                productsWithReviewsChanged.add({
                    eciProductId: schemabaseVariant.productId,
                    saleorProductId: variant.product.id,
                });

                // to make use of shop facet filters, we create a metadata item with name "customerRatings_facet" and value like this:
                // [ "1+", "2+" ] showing if a product variant has a rating of 2 or more stars. This can be used to filter all products, that have "minimum 2 stars".
                // When a product has 5 stars, the value will be [ "1+", "2+", "3+", "4+", "5+" ].
                const facetValue = [];
                for (let i = 1; i <= schemabaseVariant.averageRating; i++) {
                    facetValue.push(`${i}-and-above`);
                }

                const metadataNew = [
                    {
                        key: "customerRatings_facet",
                        value: JSON.stringify(facetValue),
                    },
                    {
                        key: "customerRatings_averageRating",
                        value: schemabaseVariant.averageRating.toString(),
                    },
                    {
                        key: "customerRatings_ratingCount",
                        value: schemabaseVariant.ratingCount.toString(),
                    },
                ];
                await this.saleorClient.saleorUpdateMetadata({
                    id: variant.id,
                    input: metadataNew,
                });
            }

            /**
             * check, if the variant name has changed and update it in saleor
             */
            if (variant.name !== schemabaseVariant.variantName) {
                this.logger.info(
                    `Updating name for ${variant.id} / ${schemabaseVariant.sku} to ${schemabaseVariant.variantName}. Old name was ${variant.name}`,
                );
                await this.saleorClient.productVariantBulkUpdate({
                    productId: variant.product.id,
                    variants: [
                        {
                            id: variant.id,
                            name: schemabaseVariant.variantName,
                        },
                    ],
                });
            }
        }

        // calculate the average product rating and the sum of ratings using the customer rating from all related
        // and active product variants of the current product. Just do it, if one of the reviews has changed.
        for (const productSet of productsWithReviewsChanged) {
            await this.setAggregatedProductRating(productSet);
        }
    }
}
