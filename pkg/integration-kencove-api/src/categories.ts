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

    const client = new KencoveApiClient(this.kencoveApiApp);
    const categories = await client.getCategories(createdGte);

    this.logger.info(`Received ${categories.length} categories from Kencove.`);

    const existingCategories = await this.db.kencoveApiCategory.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
        id: {
          in: categories.map((c) => c.cateorgyId.toString()),
        },
      },
    });

    for (const category of categories) {
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
        existingCategory.updatedAt.getTime() === updatedAt.getTime()
      ) {
        this.logger.info(
          `Category ${category.cateorgyId} hasn't changed. Skipping.`,
        );
        continue;
      }

      // for the parent and all children categories of this category, we need to get our
      // corresponding internal ids
      // to be able to connect them to together. We do this by merging together all
      // the category ids and then
      // querying our db for all categories with those ids.
      const lookupKencoveIds = [category.parentCategoryId.toString()];
      if (category.childrenCategoryIds) {
        lookupKencoveIds.push(...category.childrenCategoryIds);
      }
      const categoriesToConnect = await this.db.kencoveApiCategory.findMany({
        where: {
          kencoveApiAppId: this.kencoveApiApp.id,
          id: {
            in: lookupKencoveIds,
          },
        },
      });

      /**
       * An array of just the children categories with our internal Ids.
       */
      const childrenCategories = categoriesToConnect
        .filter((c) => c.id !== category.parentCategoryId.toString())
        .map((c) => ({ id: c.categoryId }));

      /**
       * The parent category of the current category with our internal Id.
       */
      const parentCategoryId = categoriesToConnect.find(
        (c) => c.id === category.parentCategoryId.toString(),
      )?.categoryId;

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
      await this.cronState.set({ lastRun: now, lastRunStatus: "success" });
    }
  }
}
