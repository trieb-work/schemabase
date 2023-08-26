// The KencoveApiAppProductSyncService is responsible for syncing products from
// the Kencove API App to the ECI
import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import {
  KencoveApiApp,
  KencoveApiProductType,
  PrismaClient,
} from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "./client";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { countryCodeMatch } from "@eci/pkg/miscHelper/countryCodeMatch";
import { KencoveApiProduct } from "./types";
import { htmlDecode } from "./helper";

interface KencoveApiAppProductSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

export class KencoveApiAppProductSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  public constructor(config: KencoveApiAppProductSyncServiceConfig) {
    this.logger = config.logger;
    this.db = config.db;
    this.kencoveApiApp = config.kencoveApiApp;
    this.cronState = new CronStateHandler({
      tenantId: this.kencoveApiApp.tenantId,
      appId: this.kencoveApiApp.id,
      db: this.db,
      syncEntity: "items",
    });
  }

  /**
   * Set the relation between product type and attribute
   * in the ProductTypeAttribute table
   * @param attribute
   * @param kenProdTyp
   * @param isForVariant - is this attribute for a variant or a product
   * @param isVariantSelection - is this attribute a variant selection attribute
   */
  private async setProductTypeAttribute(
    attribute: {
      name: string;
      value: string;
      attribute_id: number;
      display_type: string;
    },
    kenProdType: KencoveApiProductType,
    isForVariant: boolean,
    isVariantSelection: boolean,
  ) {
    const kenAttribute = await this.db.kencoveApiAttribute.findUnique({
      where: {
        id_kencoveApiAppId: {
          id: attribute.attribute_id.toString(),
          kencoveApiAppId: this.kencoveApiApp.id,
        },
      },
    });
    if (!kenAttribute) {
      this.logger.warn(`Could not find attribute ${attribute.attribute_id}`);
      return;
    }
    await this.db.productTypeAttribute.upsert({
      where: {
        productTypeId_attributeId: {
          productTypeId: kenProdType.productTypeId,
          attributeId: kenAttribute.attributeId,
        },
      },
      create: {
        id: id.id("productType"),
        productType: {
          connect: {
            id: kenProdType.productTypeId,
          },
        },
        isVariantSelection,
        isForVariant,
        attribute: {
          connect: {
            id: kenAttribute.attributeId,
          },
        },
      },
      update: {
        isVariantSelection,
        isForVariant,
        attribute: {
          connect: {
            id: kenAttribute.attributeId,
          },
        },
      },
    });
  }

  /**
   * We don't get clean data from the API, so we have to match
   * variant attributes manually.
   */
  private async syncProductTypeAndAttributes(product: KencoveApiProduct) {
    const normalizedName = normalizeStrings.productTypeNames(
      product.productType.name,
    );
    const isVariant = product.variants.length > 0;
    const existingProductType = await this.db.kencoveApiProductType.findUnique({
      where: {
        id_kencoveApiAppId: {
          id: product.productType.id,
          kencoveApiAppId: this.kencoveApiApp.id,
        },
      },
      include: {
        productType: true,
      },
    });
    /**
     * Regular attributes are on the variant level at attributeValues
     * Variant selection attributes are on the variant level at selectorValues.
     * All attributes should be already synced in the DB at the "attribute" and
     * kencoveApiAttribute table, so we can connect them here.
     */
    const variantAttributes = product.variants
      .map((v) => v.attributeValues)
      .flat();

    let variantSelectionAttributes = product.variants
      .map((v) => v.selectorValues)
      .flat();
    if (
      isVariant &&
      variantSelectionAttributes.length === 1 &&
      variantSelectionAttributes[0].name === "website_ref_desc"
    ) {
      this.logger.info(
        `Product type ${product.productType.name} is a legacy product type. `,
      );
      const attributeValue = htmlDecode(variantSelectionAttributes[0].value);
      variantSelectionAttributes = [
        {
          name: "Edition",
          value: attributeValue,
          display_type: "text",
          attribute_id: variantSelectionAttributes[0].attribute_id,
        },
      ];
      let kenProdType: KencoveApiProductType;
      if (!existingProductType) {
        this.logger.info(`Creating product type ${product.productType.name}.`);
        kenProdType = await this.db.kencoveApiProductType.create({
          data: {
            id: product.productType.id,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
            productType: {
              connectOrCreate: {
                where: {
                  normalizedName_tenantId: {
                    normalizedName,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("productType"),
                  name: product.productType.name,
                  normalizedName,
                  isVariant,
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
      } else {
        this.logger.info(`Updating product type ${product.productType.name}.`);
        let changeVariant: boolean | undefined;
        if (existingProductType.productType.isVariant === false && isVariant) {
          this.logger.info(
            `Product type ${product.productType.name} gets switched to a type with variants.`,
          );
          changeVariant = true;
        }
        kenProdType = await this.db.kencoveApiProductType.update({
          where: {
            id_kencoveApiAppId: {
              id: product.productType.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          data: {
            productType: {
              connectOrCreate: {
                where: {
                  normalizedName_tenantId: {
                    normalizedName,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("productType"),
                  name: product.productType.name,
                  normalizedName,
                  isVariant,
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                },
              },
              update: {
                isVariant: changeVariant,
              },
            },
          },
        });
      }

      for (const attribute of variantSelectionAttributes) {
        await this.setProductTypeAttribute(attribute, kenProdType, true, true);
      }
      for (const attribute of variantAttributes) {
        await this.setProductTypeAttribute(attribute, kenProdType, false, true);
      }
    }
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
    const products = await client.getProducts(createdGte);
    this.logger.info(`Found ${products.length} products to sync`);
    if (products.length === 0) {
      this.logger.info("No products to sync. Exiting.");
      await this.cronState.set({ lastRun: new Date() });
      return;
    }

    const categoryIds = products.map((p) => p?.categoryId?.toString());
    const existingCategories = await this.db.kencoveApiCategory.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
        id: {
          in: categoryIds,
        },
      },
    });

    /// all product variant ids in one variable using products as start point
    const productVariantIds = products
      .map((p) => p.variants.map((v) => v.id))
      .flat();

    const existingProductVariants =
      await this.db.kencoveApiProductVariant.findMany({
        where: {
          kencoveApiAppId: this.kencoveApiApp.id,
          id: {
            in: productVariantIds,
          },
        },
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      });

    /**
     * First sync the product types and attributes
     */
    for (const product of products) {
      await this.syncProductTypeAndAttributes(product);
    }

    /**
     * just kencove Api product variants enhanced with all data from their parent product
     */
    const enhancedProductVariants = products
      .map((p) =>
        p.variants.map((v) => ({
          ...v,
          productId: p.id,
          productName: p.name,
          countryOfOrigin: p.countryOfOrigin,
          categoryId: p?.categoryId?.toString(),
        })),
      )
      .flat();

    for (const productVariant of enhancedProductVariants) {
      const updatedAt = new Date(productVariant.updatedAt);
      const createdAt = new Date(productVariant.createdAt);
      const existingProductVariant = existingProductVariants.find(
        (p) => p.id === productVariant.id,
      );
      const normalizedProductName = normalizeStrings.productNames(
        productVariant.productName,
      );

      if (
        !existingProductVariant ||
        existingProductVariant.updatedAt < updatedAt
      ) {
        this.logger.info(
          `Syncing product variant ${productVariant.id} of product ${productVariant.productName}`,
        );

        const countryOfOrigin = countryCodeMatch(
          productVariant.countryOfOrigin,
        );

        const category = existingCategories.find(
          (c) => c.id === productVariant.categoryId,
        )?.categoryId;

        await this.db.kencoveApiProductVariant.upsert({
          where: {
            id_kencoveApiAppId: {
              id: productVariant.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          create: {
            id: productVariant.id,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
            createdAt,
            updatedAt,
            productId: productVariant.productId,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: productVariant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: productVariant.sku,
                  weight: productVariant.weight,
                  variantName: productVariant.name,
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                  product: {
                    connectOrCreate: {
                      where: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedProductName,
                          tenantId: this.kencoveApiApp.tenantId,
                        },
                      },
                      create: {
                        id: id.id("product"),
                        name: productVariant.productName,
                        normalizedName: normalizedProductName,
                        category: category
                          ? { connect: { id: category } }
                          : undefined,
                        tenant: {
                          connect: {
                            id: this.kencoveApiApp.tenantId,
                          },
                        },
                        countryOfOrigin,
                      },
                    },
                  },
                },
              },
            },
          },
          update: {
            updatedAt,
            productId: productVariant.productId,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: productVariant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: productVariant.sku,
                  tenant: {
                    connect: {
                      id: this.kencoveApiApp.tenantId,
                    },
                  },
                  product: {
                    connectOrCreate: {
                      where: {
                        normalizedName_tenantId: {
                          normalizedName: normalizedProductName,
                          tenantId: this.kencoveApiApp.tenantId,
                        },
                      },
                      create: {
                        id: id.id("product"),
                        name: productVariant.productName,
                        normalizedName: normalizedProductName,
                        countryOfOrigin,
                        category: category
                          ? { connect: { id: category } }
                          : undefined,
                        tenant: {
                          connect: {
                            id: this.kencoveApiApp.tenantId,
                          },
                        },
                      },
                    },
                  },
                },
              },
              update: {
                weight: productVariant.weight,
                variantName: productVariant.name,
              },
            },
          },
        });
      }
    }

    /**
     * Update internal products, if values did change. As we can't rely on data coming from the
     * API, we do more sanitisation and checks here.
     */
    for (const product of enhancedProductVariants) {
      const existingProduct = existingProductVariants.find(
        (p) => p.productVariant.sku === product.sku,
      )?.productVariant.product;
      if (!existingProduct) {
        continue;
      }
      if (existingProduct.categoryId !== product.categoryId) {
        await this.db.product.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            category: product.categoryId
              ? { connect: { id: product.categoryId } }
              : undefined,
          },
        });
      }
    }
  }
}
