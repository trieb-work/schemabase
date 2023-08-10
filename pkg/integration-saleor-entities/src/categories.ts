// SaleorCategorySyncService is a service that handles the
// synchronisation of internal categories with Saleor categories, using the normal
// structure of syncToEci and syncFromEci.
// we are using our internal database models "Category" and "SaleorCategory".
// To keep the data in sync. Saleor is missing a updatedAt field for categories,
// so we need to fetch all categories from Saleor every time. To see, if our internal
// data is more up to date than the data coming from saleor, we can use the updatedAt
// field from the Category table.

import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { normalizeStrings } from "@eci/pkg/normalization";
import {
  Category,
  InstalledSaleorApp,
  PrismaClient,
  SaleorCategory,
} from "@eci/pkg/prisma";
import {
  CategoryValuesFragment,
  SaleorCronCategoriesQuery,
  queryWithPagination,
} from "@eci/pkg/saleor";

interface SaleorCategorySyncServiceConfig {
  saleorClient: {
    saleorCronCategories: (variables: {
      first: number;
      after: string;
    }) => Promise<SaleorCronCategoriesQuery>;
  };
  installedSaleorApp: InstalledSaleorApp;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

interface SaleorCategoryWithCategory extends SaleorCategory {
  category: Category;
}

export class SaleorCategorySyncService {
  private saleorClient: {
    saleorCronCategories: (variables: {
      first: number;
      after: string;
    }) => Promise<SaleorCronCategoriesQuery>;
  };

  private installedSaleorApp: InstalledSaleorApp;
  private tenantId: string;
  private db: PrismaClient;
  private logger: ILogger;

  constructor(config: SaleorCategorySyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.installedSaleorApp = config.installedSaleorApp;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.logger = config.logger;
  }

  public async syncToEci() {
    /**
     * All categories from Saleor. We always fetch all categories,
     * as there are normally less than 100 and Saleor does not offer
     * us a way to filter by updated_at.
     */
    const response = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronCategories({
        first,
        after,
      }),
    );
    if (!response.categories || response?.categories?.edges.length === 0) {
      return;
    }

    /**
     * All categories coming fresh from the API
     */
    const saleorCategories = response.categories.edges.map((c) => c.node);

    /**
     * All categories from the SaleorCategory table.
     */
    const categories = await this.db.saleorCategory.findMany({
      where: {
        installedSaleorAppId: this.installedSaleorApp.id,
      },
      include: {
        category: true,
      },
    });

    /**
     * All categories ids that we got fresh from the API
     */
    const saleorCategoriesIds = response.categories.edges.map(
      (category) => category.node.id,
    );
    /**
     * Just the IDs of our internal existing SaleorCategories
     */
    const categoriesIds = categories.map((category) => category.id);
    /**
     * Categories that are in the SaleorCategory table but not in the API response.
     */
    const categoriesToDelete = categories.filter(
      (c) => !saleorCategoriesIds.includes(c.id),
    );
    /**
     * Categories, that are in the SaleorCategory table and in the API response.
     * We compare, if anything has changed and update the category if necessary.
     */
    const categoriesToUpdate: SaleorCategoryWithCategory[] = categories.filter(
      (category) => saleorCategoriesIds.includes(category.id),
    );
    /**
     * Categories, that are in the API response but not in the SaleorCategory table.
     */
    const categoriesToCreate = saleorCategories.filter(
      (category) => !categoriesIds.includes(category.id),
    );

    this.logger.info(
      // eslint-disable-next-line max-len
      `Comparing saleor categories: (Delete: ${categoriesToDelete.length} / Compare: ${categoriesToUpdate.length} / Create: ${categoriesToCreate.length})`,
    );
    await Promise.all([
      this.deleteCategories(categoriesToDelete),
      this.updateCategories(categoriesToUpdate, saleorCategories),
      this.createCategories(categoriesToCreate),
    ]);
  }

  /**
   * Compare all fields of the saleor category with our internal category and update only,
   * if something has changed
   * @param categoriesToUpdate our internal categories that need to be compared with 
      the data from saleorCategories and updated if necessary
   * @param saleorCategories 
   */
  private async updateCategories(
    categoriesToUpdate: SaleorCategoryWithCategory[],
    saleorCategories: CategoryValuesFragment[],
  ) {
    if (categoriesToUpdate.length === 0) {
      return;
    }
    this.logger.info(
      `Updating categories: ${categoriesToUpdate.map((c) => c.id)}`,
    );

    for (const category of categoriesToUpdate) {
      const saleorCategory = saleorCategories.find((c) => c.id === category.id);
      if (!saleorCategory) {
        continue;
      }

      const normalizedName = normalizeStrings.categoryNames(
        saleorCategory.name,
      );

      /**
       * if we have a parent category, we try to find it in the database
       * in the SaleorCategory table.
       */
      const parentCategory = saleorCategory.parent
        ? await this.db.saleorCategory.findUnique({
            where: {
              id_installedSaleorAppId: {
                id: saleorCategory.parent.id,
                installedSaleorAppId: this.installedSaleorApp.id,
              },
            },
          })
        : undefined;

      // compare all fields with each other and update only if something has changed
      if (
        (parentCategory &&
          category.category.parentCategoryId !== parentCategory.categoryId) ||
        category.category.normalizedName !== normalizedName ||
        category.category.slug !== saleorCategory.slug
      ) {
        this.logger.info(
          `Internal fiels differ with the saleor category: ${category.category.name}. Update the category`,
        );
        await this.db.saleorCategory.update({
          where: {
            id_installedSaleorAppId: {
              id: category.id,
              installedSaleorAppId: this.installedSaleorApp.id,
            },
          },
          data: {
            category: {
              update: {
                name: saleorCategory.name,
                normalizedName,
                slug: saleorCategory.slug,
                parentCategory: parentCategory
                  ? {
                      connect: {
                        id: parentCategory.categoryId,
                      },
                    }
                  : undefined,
              },
            },
          },
        });
      }
    }
  }

  private async createCategories(categoriesToCreate: CategoryValuesFragment[]) {
    if (categoriesToCreate.length === 0) {
      return;
    }
    this.logger.info(
      `Creating categories: ${categoriesToCreate.map((c) => c.name)}`,
    );

    for (const category of categoriesToCreate) {
      const normalizedName = normalizeStrings.categoryNames(category.name);

      // if the parent category is not null, we try to find it in our internal SaleorCategory table
      // to get our internal category id
      const parentCategory = category.parent
        ? await this.db.saleorCategory.findUnique({
            where: {
              id_installedSaleorAppId: {
                id: category.parent.id,
                installedSaleorAppId: this.installedSaleorApp.id,
              },
            },
          })
        : null;

      const subCategoryIds = category?.children
        ? category?.children.edges.map((c) => c.node.id)
        : [];

      /**
       * the sub categories of the category we want to create, looked up in our
       * DB with internal ids
       */
      const internalsubCategories = await this.db.saleorCategory.findMany({
        where: {
          id: {
            in: subCategoryIds,
          },
        },
      });

      await this.db.saleorCategory.create({
        data: {
          id: category.id,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorApp.id,
            },
          },

          category: {
            connectOrCreate: {
              where: {
                normalizedName_tenantId: {
                  normalizedName,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("category"),
                name: category.name,
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
                active: true,
                normalizedName,
                slug: category.slug,
                childrenCategories: {
                  connect: internalsubCategories.map((c) => ({
                    id: c.categoryId,
                  })),
                },
                parentCategory: parentCategory
                  ? {
                      connect: {
                        id: parentCategory.categoryId,
                      },
                    }
                  : undefined,
              },
            },
          },
        },
      });
    }
  }

  /**
   * Delete the saleor category and mark our internal category as inactive
   * @param categoriesToDelete
   * @returns
   */
  private async deleteCategories(categoriesToDelete: SaleorCategory[]) {
    if (categoriesToDelete.length === 0) {
      return;
    }
    this.logger.info(`Deleting categories: ${categoriesToDelete}`);
    await this.db.saleorCategory.deleteMany({
      where: {
        id: {
          in: categoriesToDelete.map((c) => c.id),
        },
      },
    });
    await this.db.category.updateMany({
      where: {
        id: {
          in: categoriesToDelete.map((c) => c.categoryId),
        },
      },
      data: {
        active: false,
      },
    });
  }

  /**
   * sync from ECI: use our internal updatedAt
   */
}
