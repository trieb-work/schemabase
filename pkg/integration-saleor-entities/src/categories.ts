// SaleorCategorySyncService is a service that handles the
// synchronisation of internal categories with Saleor categories, using the normal structure of syncToEci and syncFromEci.
// we are using our internal database models "Category" and "SaleorCategory". To keep the data in sync.
// Saleor is missing a updatedAt field for categories, so we need to fetch all categories from Saleor every time.
// To see, if our internal data is more up to date than the data coming from saleor, we can use the updatedAt field from the Category table.

import { ILogger } from "@eci/pkg/logger";
import { InstalledSaleorApp, PrismaClient } from "@eci/pkg/prisma";
import {
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
    const saleorCategories = response.categories.edges;

    /**
     * All categories from the SaleorCategory table.
     */
    const categories = await this.db.saleorCategory.findMany({
      where: {
        installedSaleorAppId: this.installedSaleorApp.id,
      },
    });
    /**
     * All categories ids that we got fresh from the API
     */
    const saleorCategoriesIds = response.categories.edges.map(
      (category) => category.node.id,
    );
    const categoriesIds = categories.map((category) => category.id);
    /**
     * Categories that are in the SaleorCategory table but not in the API response.
     */
    const categoriesToDelete = categoriesIds.filter(
      (id) => !saleorCategoriesIds.includes(id),
    );
    /**
     * Categories, that are in the SaleorCategory table and in the API response.
     * We compare, if anything has changed and update the category if necessary.
     */
    const categoriesToUpdate = categories.filter((category) =>
      saleorCategoriesIds.includes(category.id),
    );
    /**
     * Categories, that are in the API response but not in the SaleorCategory table.
     */
    const categoriesToCreate = saleorCategories.filter(
      (category) => !categoriesIds.includes(category.node.id),
    );

    this.logger.info(
      `Comparing saleor categories: (Delete: ${categoriesToDelete} / Compare: ${categoriesToUpdate} / Create: ${categoriesToCreate})`,
    );
    await Promise.all([
      this.deleteCategories(categoriesToDelete),
      this.updateCategories(categoriesToUpdate, saleorCategories),
      this.createCategories(categoriesToCreate),
    ]);
  }

  public async syncFromEci() {
    const categories = await this.db.category.findMany({
      where: {
        tenantId: this.tenantId,
      },
    });
    await Promise.all(
      categories.map((category) => this.createOrUpdateCategory(category)),
    );
  }
}
