import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { AlgoliaApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { Algoliasearch, BatchRequest, algoliasearch } from "algoliasearch";

interface AlgoliaCategorySyncServiceConfig {
    db: PrismaClient;
    logger: ILogger;
    algoliaApp: AlgoliaApp;
}

export class AlgoliaCategorySyncService {
    private readonly db: PrismaClient;

    private readonly logger: ILogger;

    private readonly algoliaApp: AlgoliaApp;

    private readonly algoliaClient: Algoliasearch;

    private readonly cronState: CronStateHandler;

    private readonly tenantId: string;

    constructor(config: AlgoliaCategorySyncServiceConfig) {
        this.db = config.db;
        this.logger = config.logger;
        this.algoliaApp = config.algoliaApp;
        this.tenantId = config.algoliaApp.tenantId;
        this.algoliaClient = algoliasearch(
            this.algoliaApp.applicationId,
            this.algoliaApp.apiKey,
        );
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.algoliaApp.id,
            db: this.db,
            syncEntity: "categories",
        });
    }

    public async syncFromECI(): Promise<void> {
        this.logger.info("Syncing categories from schemabase with algolia");

        const cronState = await this.cronState.get();

        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 2);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            createdGte = subHours(cronState.lastRun, 3);
            this.logger.info(`Setting GTE date to ${createdGte}. `);
        }

        const categories = await this.db.category.findMany({
            where: {
                tenantId: this.tenantId,

                OR: [
                    {
                        products: {
                            some: {
                                tenantId: this.tenantId,
                                variants: {
                                    some: {
                                        salesChannelPriceEntries: {
                                            some: {
                                                startDate: {
                                                    lte: now,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    {
                        childrenCategories: {
                            some: {
                                tenantId: this.tenantId,
                            },
                        },
                    },
                ],
            },
            include: {
                parentCategory: {
                    include: {
                        parentCategory: {
                            include: {
                                parentCategory: {
                                    include: {
                                        parentCategory: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.logger.info(`Found ${categories.length} categories to sync`);

        const index = this.algoliaApp.categoryIndexName;

        const requests: BatchRequest[] = [];
        const filterCategories: string[] = [];

        for (const category of categories) {
            /**
             * Add all parent category slugs to the category object,
             * start with level 0 and go up to level 4
             * parentCategorySlug: { level0: "", level1: "", level2: "", level3: "", level4: "" }
             * we need to flatten the parentCategory object to get the slugs.
             *
             */
            const parentCategorySlug: { [key: string]: string } = {};

            let currentCategory = category;
            let level = 0; // Start from the deepest level, assuming level0 is the deepest.
            const parentCategoryLevelFilter = 0;

            let skipCategory = false;

            // Navigate through the parent categories, from the deepest to the top.
            while (currentCategory.parentCategory && level < 5) {
                /**
                 * parentCategory level filter. Filter our everything above level X
                 * from our settings. Currently set to 0, which means we just
                 * use categories with one parentCategory.
                 */
                if (level > parentCategoryLevelFilter) {
                    skipCategory = true;
                    break;
                }

                // Set the slug for the current level, assuming each category has a slug.
                // If currentCategory is the initial category or any of its parents, this ensures we capture each slug.
                parentCategorySlug[`level${level}`] =
                    currentCategory.parentCategory.slug ?? "";

                // Move to the next parent category for the next iteration.
                currentCategory = currentCategory.parentCategory;

                // Increment the level after setting the slug for the current parentCategory.
                level++;
            }

            if (skipCategory) {
                this.logger.info(
                    `Skipping category ${category.id} - ${category.name} because it has more than one parentCategory`,
                );
                continue;
            }

            const algoliaObject = {
                objectID: category.id,
                name: category.name,
                description: category.descriptionHTML,
                slug: category.slug,
                parentCategorySlug,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            };

            requests.push({
                action: "updateObject",
                body: algoliaObject,
            });
            filterCategories.push(category.id);
        }

        this.logger.info(
            `Syncing ${requests.length} categories to algolia (after all filters)`,
        );

        const { taskID } = await this.algoliaClient.batch({
            indexName: index,
            batchWriteParams: {
                requests,
            },
        });

        // Wait for indexing to be finished
        await this.algoliaClient.waitForTask({ indexName: index, taskID });

        /**
         * get all entries to compare with our categories
         */
        const algoliaEntries = await this.algoliaClient.searchSingleIndex({
            indexName: index,
            searchParams: {
                attributesToRetrieve: ["objectID"],
                hitsPerPage: 1000,
            },
        });

        const entriesToDelete = algoliaEntries.hits.filter(
            (entry) =>
                !filterCategories.some(
                    (category) => category === entry.objectID,
                ),
        );

        if (entriesToDelete.length > 0) {
            this.logger.info(
                `Deleting ${entriesToDelete.length} categories from algolia`,
            );
            const deleteRequests: BatchRequest[] = entriesToDelete.map(
                (entry) => ({
                    action: "deleteObject",
                    body: { objectID: entry.objectID },
                }),
            );

            const { taskID: deleteTaskID } = await this.algoliaClient.batch({
                indexName: index,
                batchWriteParams: {
                    requests: deleteRequests,
                },
            });

            // Wait for indexing to be finished
            await this.algoliaClient.waitForTask({
                indexName: index,
                taskID: deleteTaskID,
            });
        }

        this.logger.info("Synced categories to algolia");

        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
}
