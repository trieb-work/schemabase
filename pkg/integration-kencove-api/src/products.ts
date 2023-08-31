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
import { KencoveApiAttributeInProduct, KencoveApiProduct } from "./types";
import { htmlDecode, kenAttributeToEciAttribute } from "./helper";
import async from "async";

interface KencoveApiAppProductSyncServiceConfig {
  logger: ILogger;
  db: PrismaClient;
  kencoveApiApp: KencoveApiApp;
}

interface SeparatedAttributes {
  productAttributes: KencoveApiAttributeInProduct[];
  productAttributesUnique: KencoveApiAttributeInProduct[];
  variantAttributes: KencoveApiAttributeInProduct[];
  variantAttributesUnique: KencoveApiAttributeInProduct[];
  variantSelectionAttributes: KencoveApiAttributeInProduct[];
  variantSelectionAttributesUnique: KencoveApiAttributeInProduct[];
}

export class KencoveApiAppProductSyncService {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  public readonly kencoveApiApp: KencoveApiApp;

  private readonly cronState: CronStateHandler;

  /**
   * kencoveApiAttribute Ids as key, value -> isForVariant: boolean and schemabase
   * internal attributeId
   */
  private kenToEciAttribute: Map<
    string,
    { isForVariant: boolean; attributeId: string }
  > = new Map();

  /**
   * When we overwrite the website_ref_desc attribute, we
   * store in this map, which attribute we use as a replacement
   * We use the variant.id as key and the attribute id (ken attribute id) as value
   */
  private kenVariantSelectionAttributeOverwrite: Map<string, number> =
    new Map();

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
   * (for example "color" or "size")
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
    const kenAttribute = await this.db.kencoveApiAttribute.upsert({
      where: {
        id_kencoveApiAppId: {
          id: attribute.attribute_id.toString(),
          kencoveApiAppId: this.kencoveApiApp.id,
        },
      },
      create: {
        id: attribute.attribute_id.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        kencoveApiApp: {
          connect: {
            id: this.kencoveApiApp.id,
          },
        },
        attribute: {
          connectOrCreate: {
            where: {
              normalizedName_tenantId: {
                normalizedName: normalizeStrings.attributeNames(attribute.name),
                tenantId: this.kencoveApiApp.tenantId,
              },
            },
            create: {
              id: id.id("attribute"),
              name: attribute.name,
              normalizedName: normalizeStrings.attributeNames(attribute.name),
              type: kenAttributeToEciAttribute(attribute.display_type),
              tenant: {
                connect: {
                  id: this.kencoveApiApp.tenantId,
                },
              },
            },
          },
        },
      },
      update: {},
    });

    this.kenToEciAttribute.set(kenAttribute.id, {
      attributeId: kenAttribute.attributeId,
      isForVariant,
    });

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
   * Clean the attributes, remove empty null or undefined values. HTML decode the attribute value
   * @param attributes
   * @returns
   */
  private cleanAttributes(
    attributes: KencoveApiAttributeInProduct[],
  ): KencoveApiAttributeInProduct[] {
    return attributes
      .filter(
        (attribute) =>
          attribute.value !== undefined &&
          attribute.value !== null &&
          attribute.value !== "",
      )
      .map((attribute) => ({
        ...attribute,
        value: htmlDecode(attribute.value),
      }));
  }

  private uniqueAttributes(
    attributes: KencoveApiAttributeInProduct[],
  ): KencoveApiAttributeInProduct[] {
    const uniqueAttributes: KencoveApiAttributeInProduct[] = [];

    attributes.forEach((attribute) => {
      if (!uniqueAttributes.some((ua) => ua.name === attribute.name)) {
        uniqueAttributes.push(attribute);
      }
    });

    return uniqueAttributes;
  }

  /**
   * The Kencove API is returning all attributes as variant attribtues, even if they are not.
   * We group all attributes by name and value. Attributes, that have the same name and value for
   * ALL variants are considered as product attributes and not variant attributes.
   * We set them as product attributes.
   * Only attributes, whose value is the same for ALL variants of the product can be considered
   * product attributes.
   * We also filter all attributes with value null or undefined or empty string out.
   * We return an array of attributes for product attributes and
   * an array of attributes for variant attributes.
   */
  private attributeMatch(productData: KencoveApiProduct): SeparatedAttributes {
    const allVariants = productData.variants;
    /**
     * Attributes in the "selectorValues", that have the same name and value for
     * all variants
     */
    let commonSelectorValues: KencoveApiAttributeInProduct[] = [];
    let commonAttributeValues: KencoveApiAttributeInProduct[] = [];
    const variantSelectionAttributes: KencoveApiAttributeInProduct[] = [];

    if (allVariants.length === 1) {
      return {
        productAttributes: this.cleanAttributes(allVariants[0].attributeValues),
        productAttributesUnique: this.cleanAttributes(
          this.uniqueAttributes(allVariants[0].attributeValues),
        ),
        variantAttributes: [],
        variantAttributesUnique: [],
        variantSelectionAttributes: this.cleanAttributes(
          allVariants[0].selectorValues,
        ),
        variantSelectionAttributesUnique: this.cleanAttributes(
          this.uniqueAttributes(allVariants[0].selectorValues),
        ),
      };
    }

    allVariants.forEach((variant) => {
      variant.selectorValues.forEach((selectorValue) => {
        if (
          allVariants.every((v) =>
            v.selectorValues.some(
              (sv) =>
                sv.name === selectorValue.name &&
                sv.value === selectorValue.value,
            ),
          )
        ) {
          commonSelectorValues.push(selectorValue);
        }
      });

      variant.attributeValues.forEach((attributeValue) => {
        if (
          allVariants.every((v) =>
            v.attributeValues.some(
              (av) =>
                av.name === attributeValue.name &&
                av.value === attributeValue.value,
            ),
          )
        ) {
          commonAttributeValues.push(attributeValue);
        }
      });
    });

    commonSelectorValues = this.cleanAttributes(commonSelectorValues);
    commonAttributeValues = this.cleanAttributes(commonAttributeValues);

    const productAttributes = [
      ...commonSelectorValues,
      ...commonAttributeValues,
    ];

    allVariants.forEach((variant) => {
      variant.selectorValues.forEach((selectorValue) => {
        if (selectorValue.name === "website_ref_desc") {
          const correspondingAttributeValue = variant.attributeValues.find(
            (av) => av.value?.includes(selectorValue.value),
          );
          if (correspondingAttributeValue) {
            this.logger.debug(
              `Found a matching attribute. Replacing website_ref_desc with ${JSON.stringify(
                correspondingAttributeValue,
              )}`,
            );
            if (
              !variantSelectionAttributes.some(
                (vsa) =>
                  vsa.attribute_id === correspondingAttributeValue.attribute_id,
              )
            ) {
              variantSelectionAttributes.push(correspondingAttributeValue);
              this.kenVariantSelectionAttributeOverwrite.set(
                variant.id,
                correspondingAttributeValue.attribute_id,
              );
            }
          } else {
            if (
              /**
               * make sure, that we don't push variant selection attributes also as attributes
               */
              !variantSelectionAttributes.some(
                (vsa) => vsa.attribute_id === selectorValue.attribute_id,
              )
            ) {
              variantSelectionAttributes.push(selectorValue);
            }
          }
        }
      });
    });

    const variantAttributes = this.cleanAttributes(
      allVariants.flatMap((variant) =>
        variant.attributeValues.filter(
          (av) =>
            !productAttributes.some((pa) => pa.name === av.name) &&
            !variantSelectionAttributes.some(
              (vsa) => vsa.attribute_id === av.attribute_id,
            ),
        ),
      ),
    );

    return {
      productAttributesUnique: this.uniqueAttributes(productAttributes),
      productAttributes,
      variantAttributes,
      variantAttributesUnique: this.cleanAttributes(
        this.uniqueAttributes(variantAttributes),
      ),
      variantSelectionAttributesUnique: this.cleanAttributes(
        this.uniqueAttributes(variantSelectionAttributes),
      ),
      variantSelectionAttributes: this.cleanAttributes(
        variantSelectionAttributes,
      ),
    };
  }

  /**
   * Set the attribute value for a product or a variant
   * needs the attribute id, the product id or variant id and the value, to be set
   */
  private async setAttributeValue(
    attribute: KencoveApiAttributeInProduct,
    productId: string,
    variantId: string,
  ) {
    const matchedAttribute = this.kenToEciAttribute.get(
      attribute.attribute_id.toString(),
    );
    if (!matchedAttribute) {
      this.logger.error(
        `Could not find attribute id for kencove attribute ${attribute.name}`,
      );
      return;
    }
    const attributeValue = htmlDecode(attribute.value);
    this.logger.debug(
      `Setting attribute ${attribute.name}, value ${attributeValue}`,
    );
    const attributeId = matchedAttribute.attributeId;
    const normalizedName = normalizeStrings.attributeValueNames(
      attribute.value,
    );
    await this.db.attributeValue.upsert({
      where: {
        normalizedName_attributeId_tenantId: {
          normalizedName,
          attributeId,
          tenantId: this.kencoveApiApp.tenantId,
        },
      },
      create: {
        id: id.id("attributeValue"),
        attribute: {
          connect: {
            id: attributeId,
          },
        },
        normalizedName,
        tenant: {
          connect: {
            id: this.kencoveApiApp.tenantId,
          },
        },
        value: attributeValue,
        product: matchedAttribute.isForVariant
          ? undefined
          : { connect: { id: productId } },
        productVariant: matchedAttribute.isForVariant
          ? { connect: { id: variantId } }
          : undefined,
      },
      update: {},
    });
  }

  /**
   * We don't get clean data from the API, so we have to match
   * variant attributes manually. We sync the product type and which
   * attributes can be set for that product type, and afterwards we sync the
   * values for the attributes for each variant.
   */
  private async syncProductTypeAndAttributes(product: KencoveApiProduct) {
    const normalizedName = normalizeStrings.productTypeNames(
      product.productType.name,
    );
    const isVariant = product.variants.length > 1;

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

    const {
      variantAttributesUnique,
      variantSelectionAttributesUnique,
      productAttributesUnique,
    } = this.attributeMatch(product);

    /**
     * Manually adding two product attributes: Accessory Items and Alternative Items.
     * They get values from the API in a different way, so we have to add them manually, so
     * move them to Saleor in a standard manner
     */
    productAttributesUnique.push({
      name: "Accessory Items",
      value: "",
      attribute_id: 333331,
      display_type: "multiselect",
      attribute_model: "custom",
    });
    productAttributesUnique.push({
      name: "Alternative Items",
      value: "",
      attribute_id: 333330,
      display_type: "multiselect",
      attribute_model: "custom",
    });

    this.logger.debug(
      "Product Attributes: " + JSON.stringify(productAttributesUnique, null, 2),
    );
    this.logger.debug(
      "Variant Attributes: " + JSON.stringify(variantAttributesUnique, null, 2),
    );
    this.logger.debug(
      "Variant Selection Attributes: " +
        JSON.stringify(variantSelectionAttributesUnique, null, 2),
    );

    this.logger.debug(
      // eslint-disable-next-line max-len
      `Got ${variantAttributesUnique.length} variant attributes, ${variantSelectionAttributesUnique.length} ` +
        `variant selection attributes and ${productAttributesUnique.length} product attributes.`,
    );

    if (
      isVariant &&
      variantSelectionAttributesUnique[0]?.name === "website_ref_desc"
    ) {
      // this.logger.info(
      //   `Product type ${product.productType.name} is a legacy product type. `,
      // );
      // TODO: we could write this attribute to a different one here
    }
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
      this.logger.info(`Updating product type "${product.productType.name}".`);
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

    /**
     * Setting the variant Selection attributes for the product type
     */
    for (const attribute of variantSelectionAttributesUnique) {
      await this.setProductTypeAttribute(attribute, kenProdType, true, true);
    }

    /**
     * Setting the product attributes for the product type
     */
    for (const attribute of productAttributesUnique) {
      await this.setProductTypeAttribute(attribute, kenProdType, false, false);
    }

    /**
     * Setting the variant attributes for the product type
     */
    for (const attribute of variantAttributesUnique) {
      await this.setProductTypeAttribute(attribute, kenProdType, true, false);
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
              kencoveApiProductVariant: true,
              product: true,
            },
          },
        },
      });

    /**
     * First sync the product types and attributes
     */
    await async.eachLimit(products, 5, async (product) => {
      this.logger.info(
        `Syncing product type "${product.productType.name}" of product "${product.name}"`,
      );
      await this.syncProductTypeAndAttributes(product);
    });

    /**
     * just kencove Api product variants enhanced with all data from their parent product
     */
    const enhancedProductVariants = products
      .map((p) =>
        p.variants.map((v) => ({
          ...v,
          productId: p.id,
          productName: htmlDecode(p.name),
          countryOfOrigin: p.countryOfOrigin,
          categoryId: p?.categoryId?.toString(),
          productType: p.productType,
          productDescription: p?.website_description,
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
      const kenProductType = await this.db.kencoveApiProductType.findUnique({
        where: {
          id_kencoveApiAppId: {
            id: productVariant.productType.id,
            kencoveApiAppId: this.kencoveApiApp.id,
          },
        },
      });
      if (!kenProductType) {
        this.logger.error(
          `Could not find product type ${productVariant.productType.name}. ` +
            "This should not happen, as we created the product type in the previous step.",
        );
        continue;
      }

      if (
        !existingProductVariant ||
        existingProductVariant.updatedAt < updatedAt
      ) {
        this.logger.info(
          `Syncing product variant ${productVariant.id} of product ${productVariant.productName}`,
        );

        const countryOfOrigin = productVariant.countryOfOrigin
          ? countryCodeMatch(productVariant.countryOfOrigin)
          : undefined;

        const category = existingCategories.find(
          (c) => c.id === productVariant.categoryId,
        )?.categoryId;

        const upsertedVariant = await this.db.kencoveApiProductVariant.upsert({
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
                        descriptionHTML: productVariant.productDescription,
                        productType: {
                          connect: {
                            id: kenProductType.productTypeId,
                          },
                        },
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
                product: {
                  update: {
                    descriptionHTML: productVariant.productDescription,
                    productType: {
                      connect: {
                        id: kenProductType.productTypeId,
                      },
                    },
                  },
                },
              },
            },
          },
          include: {
            productVariant: true,
          },
        });

        /**
         * Set the non-variant selection values for the variant
         */
        const promise = this.cleanAttributes(
          productVariant.attributeValues,
        ).forEach(async (attributeValues) => {
          this.logger.debug(
            `Setting attribute ${attributeValues.name}: value ${attributeValues.value}`,
          );
          this.setAttributeValue(
            attributeValues,
            upsertedVariant.productVariant.productId,
            upsertedVariant.productVariantId,
          );
        });

        /**
         * Set the variant selection attributes. We need to take into account, that we
         * might have replaced the website_ref_desc attribute with a different attribute
         * We look that up in the kenVariantSelectionAttributeOverwrite map
         */
        const variantSelectionAttributes = this.cleanAttributes(
          productVariant.selectorValues,
        );
        for (const attribute of variantSelectionAttributes) {
          const attributeId = this.kenVariantSelectionAttributeOverwrite.get(
            productVariant.id,
          );
          if (attributeId) {
            this.setAttributeValue(
              {
                ...attribute,
                attribute_id: attributeId,
              },
              upsertedVariant.productVariant.productId,
              upsertedVariant.productVariantId,
            );
          } else {
            this.setAttributeValue(
              attribute,
              upsertedVariant.productVariant.productId,
              upsertedVariant.productVariantId,
            );
          }
        }

        /**
         * set the variant selection values for the variant.
         * We need to take into account, that we might have replaced the
         * website_ref_desc attribute with a different attribute
         */

        await Promise.all([promise]);
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
      const apiProductCategory = existingCategories.find(
        (c) => c.id === product.categoryId,
      )?.categoryId;
      if (existingProduct.categoryId !== apiProductCategory) {
        this.logger.info(
          `Updating category for product ${product.productName} ` +
            `from ${existingProduct.categoryId} to ${apiProductCategory}`,
        );
        await this.db.product.update({
          where: {
            id: existingProduct.id,
          },
          data: {
            category: apiProductCategory
              ? { connect: { id: apiProductCategory } }
              : undefined,
          },
        });
      }
    }
  }
}
