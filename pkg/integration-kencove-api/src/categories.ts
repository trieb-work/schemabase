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

  public async syncToECI() {
    /**
     * When this is the first run, or the last run did not complete,
     * we mark this, so that we don't skip any category.
     */
    let isFirstRun = false;
    const cronState = await this.cronState.get();
    const now = new Date();
    let createdGte: Date;
    if (!cronState.lastRun) {
      isFirstRun = true;
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

    const client = new KencoveApiClient(this.kencoveApiApp);

    const kenApiCategories = await client.getCategories(createdGte);

    this.logger.info(
      `Received ${kenApiCategories.length} categories from the api.`,
    );

    const existingCategories = await this.db.kencoveApiCategory.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
        id: {
          in: kenApiCategories.map((c) => c.cateorgyId?.toString()),
        },
      },
    });

    /**
     * We skip categories that are configured in the app settings.
     */
    const categoriesToSkip =
      this.kencoveApiApp.skipCategories?.split(",") ?? [];

    // remove categories that are configured to be skipped
    const categoriesToSync = kenApiCategories.filter(
      (c) => !categoriesToSkip.includes(c.cateorgyId.toString()),
    );

    let skipCronStateUpdate = false;

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

      const existingCategory = existingCategories.find(
        (c) => c.id === category.cateorgyId.toString(),
      );

      // if the updatedAt timestamp in our db is the same as the one from kencove,
      // we skip this category. If the category doesn't exist, we create it.
      if (
        existingCategory &&
        existingCategory.updatedAt.getTime() === updatedAt.getTime() &&
        !isFirstRun
      ) {
        this.logger.info(
          `Category ${category.cateorgyId} hasn't changed. Skipping.`,
        );
        continue;
      }

      console.debug(`Working on category ${JSON.stringify(category)}.`);

      // for the parent and all children categories of this category, we need to get our
      // corresponding internal ids to be able to connect them to together.
      // We do this by merging together all the category ids and then
      // querying our db for all categories with those ids.
      const lookupKencoveIds = [];
      if (category.childrenCategoryIds) {
        lookupKencoveIds.push(...category.childrenCategoryIds);
      }
      if (category.parentCategoryId)
        lookupKencoveIds.push(category.parentCategoryId.toString());

      // we have to filter out the categoriesToSkip here as well
      const filteredLookupKencoveIds = lookupKencoveIds.filter(
        (c) => !categoriesToSkip.includes(c),
      );
      const categoriesToConnect = await this.db.kencoveApiCategory.findMany({
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
        .filter((c) => c.id !== category.parentCategoryId.toString())
        .map((c) => ({ id: c.categoryId }));

      // when we can't find all internal categories we need to connect,
      // we mark this run as partial and skip the cron state update, so that the
      // next run is a full run again.
      if (categoriesToConnect.length !== filteredLookupKencoveIds.length) {
        this.logger.warn(
          // eslint-disable-next-line max-len
          `Could not find all categories to connect. Skipping cron state update, so that the next run will be a full run again.`,
        );
        skipCronStateUpdate = true;
      }

      /**
       * The parent category of the current category with our internal Id.
       */
      const parentCategoryId = categoriesToConnect.find(
        (c) => c.id === category.parentCategoryId.toString(),
      )?.categoryId;

      this.logger.debug("Updating/creating category in schemabase.", {
        childrenCategories,
        parentCategoryId,
      });
      if (existingCategory) {
        this.logger.info(`Updating category ${category.cateorgyId}.`);
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
              update: {
                name: category.categoryName,
                slug: category.categorySlug,
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
              },
            },
          },
        });
      }

      if (!existingCategory) {
        this.logger.info(`Creating category ${category.cateorgyId}.`);
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
                  normalizedName_tenantId: {
                    normalizedName,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("category"),
                  name: category.categoryName,
                  slug: category.categorySlug,
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
                },
              },
            },
          },
        });
      }

      // we update the last run timestamp to now
      if (!skipCronStateUpdate)
        await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
  }
}