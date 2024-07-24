/* eslint-disable @typescript-eslint/no-shadow */
// the categories function - same as addresses or products, but for categories
//

import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { normalizeStrings } from "@eci/pkg/normalization";
import { id } from "@eci/pkg/ids";

interface KencoveApiAppCategorySyncServiceConfig {
    logger: ILogger;
    db: PrismaClient;
    kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppCategorySyncService {
    private readonly logger: ILogger;

    private readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    private readonly cronState: CronStateHandler;

    public constructor(config: KencoveApiAppCategorySyncServiceConfig) {
        this.logger = config.logger;
        this.db = config.db;
        this.kencoveApiApp = config.kencoveApiApp;
        this.cronState = new CronStateHandler({
            tenantId: this.kencoveApiApp.tenantId,
            appId: this.kencoveApiApp.id,
            db: this.db,
            syncEntity: "categories",
        });
    }

    /**
     * Take an array of KencoveApiProduct Ids and returns an array
     * of internal productIds to connect to. Fail, if not all ids can be
     * resolved. We return undefined in that case
     * @param kencoveIds
     * @returns
     */
    // private async getProductIds(kencoveIds: string[]) {
    //     const products = await this.db.kencoveApiProductVariant.findMany({
    //         where: {
    //             kencoveApiAppId: this.kencoveApiApp.id,
    //             productId: {
    //                 in: kencoveIds,
    //             },
    //         },
    //         include: {
    //             productVariant: true,
    //         },
    //     });

    //     // When we can't resolve all products, we throw an error.
    //     if (products.length !== kencoveIds.length) {
    //         const missingIds = kencoveIds.filter(
    //             (id) => !products.find((p) => p.productId === id),
    //         );
    //         this.logger.warn(
    //             `Could not find all products to connect to category. Missing ids: ${missingIds.join(
    //                 ", ",
    //             )}`,
    //         );
    //         return undefined;
    //     }

    //     return products.map((p) => p.productVariant.productId);
    // }

    public async syncToECI() {
        const cronState = await this.cronState.get();
        const now = new Date();
        let createdGte: Date;
        if (!cronState.lastRun) {
            createdGte = subYears(now, 1);
            this.logger.info(
                // eslint-disable-next-line max-len
                `This seems to be our first sync run. Syncing data from: ${createdGte}`,
            );
        } else {
            // for security purposes, we sync one hour more than the last run
            createdGte = subHours(cronState.lastRun, 1);
            this.logger.info(`Setting GTE date to ${createdGte}.`);
        }

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);

        const categoriesYield = client.getCategoriesStream(createdGte);

        let skipCronStateUpdate = false;

        for await (const kenApiCategories of categoriesYield) {
            this.logger.info(
                `Received ${kenApiCategories.length} categories from the api.`,
            );

            const existingCategories =
                await this.db.kencoveApiCategory.findMany({
                    where: {
                        kencoveApiAppId: this.kencoveApiApp.id,
                        id: {
                            in: kenApiCategories.map((c) =>
                                c.cateorgyId?.toString(),
                            ),
                        },
                    },
                });

            /**
             * We skip categories that are configured in the app settings.
             */
            const categoriesToSkip =
                this.kencoveApiApp.skipCategories?.split(",") ?? [];

            // remove categories that are configured to be skipped and categories without a slug
            const categoriesToSync = kenApiCategories.filter(
                (c) => !categoriesToSkip.includes(c.cateorgyId.toString()),
            );

            for (const category of categoriesToSync) {
                const createdAt = new Date(category.createdAt);
                const updatedAt = new Date(category.updatedAt);

                /**
                 * We use the normalized name to search internally, if we already have a matching category.
                 * Later, we do not need this identifier any longer, as we connected a KencoveApiCategory
                 * to a schemabase category
                 */
                const normalizedName = normalizeStrings.categoryNames(
                    category.categoryName,
                );

                if (!category.categorySlug) {
                    this.logger.warn(
                        `Category ${category.categoryName} has no slug. Skipping.`,
                    );
                    continue;
                }

                const media = category.images || [];

                /**
                 * Existing KencoveApiCategory from our DB
                 */
                const existingCategory = existingCategories.find(
                    (c) => c.id === category.cateorgyId.toString(),
                );

                this.logger.debug(
                    `Working on category ${category.categoryName}`,
                    {
                        kencoveApiCategoryId: category.cateorgyId,
                        slug: category.categorySlug,
                    },
                );

                // for the parent and all children categories of this category, we need to get our
                // corresponding internal ids to be able to connect them to together.
                // We do this by merging together all the category ids and then
                // querying our db for all categories with those ids.
                const lookupKencoveIds: string[] = [];
                if (category.childrenCategoryIds) {
                    lookupKencoveIds.push(
                        ...category.childrenCategoryIds.toString(),
                    );
                }
                /**
                 * The kencoveApi categoryid of the parent category. Is null,
                 * if no parent or the parent is in the categoriesToSkip list.
                 */
                const kencoveParentCategoryId =
                    category.parentCategoryId &&
                    !categoriesToSkip.includes(
                        category.parentCategoryId.toString(),
                    )
                        ? category.parentCategoryId?.toString()
                        : null;
                if (kencoveParentCategoryId)
                    lookupKencoveIds.push(kencoveParentCategoryId.toString());

                // we have to filter out the categoriesToSkip here as well
                const filteredLookupKencoveIds = lookupKencoveIds.filter(
                    (c) => !categoriesToSkip.includes(c),
                );
                /**
                 * All Kencove Api categories that we need to connect to this category.
                 * We search in our internal DB for parent and children category ids
                 */
                const categoriesToConnect =
                    await this.db.kencoveApiCategory.findMany({
                        where: {
                            kencoveApiAppId: this.kencoveApiApp.id,
                            id: {
                                in: filteredLookupKencoveIds,
                            },
                        },
                    });

                /**
                 * An array of just the children categories with our internal Ids.
                 */
                const childrenCategories = categoriesToConnect
                    .filter(
                        (c) => c.id !== category.parentCategoryId?.toString(),
                    )
                    .map((c) => ({ id: c.categoryId }));

                // when we can't find all internal categories we need to connect,
                // we mark this run as partial and skip the cron state update, so that the
                // next run is a full run again.
                if (
                    categoriesToConnect.length !==
                    filteredLookupKencoveIds.length
                ) {
                    this.logger.warn(
                        // eslint-disable-next-line max-len
                        `Could not find all categories to connect. Skipping cron state update, so that the next run will be a full run again.`,
                        {
                            notFoundIds: filteredLookupKencoveIds.filter(
                                (id) =>
                                    !categoriesToConnect.find(
                                        (c) => c.id === id,
                                    ),
                            ),
                        },
                    );
                    skipCronStateUpdate = true;
                }

                /**
                 * The parent category of the current category with our internal Id.
                 * So when this category has a parent, that we already synced, this Id
                 * is set here. INTERNAL SCHEMABASE ID.
                 */
                let parentCategoryId = kencoveParentCategoryId
                    ? categoriesToConnect.find(
                          (c) => c.id === kencoveParentCategoryId,
                      )?.categoryId
                    : null;

                if (
                    parentCategoryId &&
                    parentCategoryId === existingCategory?.categoryId
                ) {
                    this.logger.debug(
                        `Category ${category.categoryName} is its own parent. Skipping the connect of the parent category.`,
                    );
                    parentCategoryId = undefined;
                }

                /**
                 * Items have product Ids as well, so
                 * we don't connect items here anymore.
                 */
                // const relatedProducts = await this.getProductIds(
                //     category.productIds || [],
                // );

                this.logger.debug(
                    `Updating/creating category ${category.categoryName} - ${category.categorySlug} in schemabase.`,
                    {
                        childrenCategories,
                        parentCategoryId,
                        existingCategoryId: existingCategory?.categoryId,
                    },
                );
                if (existingCategory) {
                    this.logger.info(
                        `Updating category ${category.cateorgyId}.`,
                    );
                    await this.db.kencoveApiCategory.update({
                        where: {
                            id_kencoveApiAppId: {
                                id: existingCategory.id,
                                kencoveApiAppId: this.kencoveApiApp.id,
                            },
                        },
                        data: {
                            updatedAt,
                            category: {
                                connectOrCreate: {
                                    where: {
                                        slug_tenantId: {
                                            slug: category.categorySlug,
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("category"),
                                        normalizedName,
                                        name: category.categoryName,
                                        slug: category.categorySlug,
                                        active: true,
                                        parentCategory: parentCategoryId
                                            ? {
                                                  connect: {
                                                      id: parentCategoryId,
                                                  },
                                              }
                                            : undefined,
                                        childrenCategories: {
                                            connect: childrenCategories,
                                        },
                                        descriptionHTML:
                                            category.websiteDescription,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                    },
                                },
                                update: {
                                    name: category.categoryName,
                                    slug: category.categorySlug,
                                    active: true,
                                    parentCategory: parentCategoryId
                                        ? {
                                              connect: {
                                                  id: parentCategoryId,
                                              },
                                          }
                                        : parentCategoryId === null
                                          ? {
                                                disconnect: true,
                                            }
                                          : undefined,
                                    childrenCategories: {
                                        connect: childrenCategories,
                                    },
                                    descriptionHTML:
                                        category.websiteDescription,
                                    media: {
                                        connectOrCreate: media?.map((m) => ({
                                            where: {
                                                url_tenantId: {
                                                    url: m.url,
                                                    tenantId:
                                                        this.kencoveApiApp
                                                            .tenantId,
                                                },
                                            },
                                            create: {
                                                id: id.id("media"),
                                                url: m.url,
                                                type:
                                                    m.tag === "banner"
                                                        ? "BANNER"
                                                        : undefined,
                                                tenant: {
                                                    connect: {
                                                        id: this.kencoveApiApp
                                                            .tenantId,
                                                    },
                                                },
                                            },
                                        })),
                                    },
                                },
                            },
                        },
                    });
                }

                if (!existingCategory) {
                    this.logger.info(
                        `Creating category ${category.cateorgyId}.`,
                        {
                            normalizedName,
                        },
                    );
                    await this.db.kencoveApiCategory.create({
                        data: {
                            id: category.cateorgyId.toString(),
                            kencoveApiApp: {
                                connect: {
                                    id: this.kencoveApiApp.id,
                                },
                            },
                            createdAt,
                            updatedAt,
                            category: {
                                connectOrCreate: {
                                    where: {
                                        slug_tenantId: {
                                            slug: category.categorySlug,
                                            tenantId:
                                                this.kencoveApiApp.tenantId,
                                        },
                                    },
                                    create: {
                                        id: id.id("category"),
                                        name: category.categoryName,
                                        slug: category.categorySlug,
                                        active: true,
                                        parentCategory: parentCategoryId
                                            ? {
                                                  connect: {
                                                      id: parentCategoryId,
                                                  },
                                              }
                                            : undefined,
                                        childrenCategories: {
                                            connect: childrenCategories,
                                        },
                                        normalizedName,
                                        tenant: {
                                            connect: {
                                                id: this.kencoveApiApp.tenantId,
                                            },
                                        },
                                        descriptionHTML:
                                            category.websiteDescription,
                                        media: {
                                            connectOrCreate: media?.map(
                                                (m) => ({
                                                    where: {
                                                        url_tenantId: {
                                                            url: m.url,
                                                            tenantId:
                                                                this
                                                                    .kencoveApiApp
                                                                    .tenantId,
                                                        },
                                                    },
                                                    create: {
                                                        id: id.id("media"),
                                                        url: m.url,
                                                        type:
                                                            m.tag === "banner"
                                                                ? "BANNER"
                                                                : undefined,
                                                        tenant: {
                                                            connect: {
                                                                id: this
                                                                    .kencoveApiApp
                                                                    .tenantId,
                                                            },
                                                        },
                                                    },
                                                }),
                                            ),
                                        },
                                    },
                                },
                            },
                        },
                    });
                }
            }
        }

        // we update the last run timestamp to now
        if (!skipCronStateUpdate)
            await this.cronState.set({
                lastRun: now,
                lastRunStatus: "success",
            });
    }
}
