// The KencoveApiAppProductSyncService is responsible for syncing products from
// the Kencove API App to the ECI. We receive all Product data from the API and
// have to break it up in the following process:
// 1. Take all products and the product type and group attributes in variant,
// selection and product attributes. Sync the productType and the "ProductTypeAttribute"
// table. Try to guess the different types of attributes and set them accordingly.
// 2. Sync the product variants and corresponding products. Use the "website_ref_desc"
// attribute as variant name, if it exists.
// 3. Sync the attribute values for the product variants and products. Make use
// of the ProductTypeAttribute table to know, which attribute is set as which type.
import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import {
  Attribute,
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
          attribute.value !== "" &&
          attribute.value !== " ",
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

    /**
     * If we only have one variant, we don't have variant attributes.
     * Furthermore, we removew the "website_ref_desc" attribute if set, as this
     * is just used to distinguish variants from each other
     */
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
        ).filter((vsa) => vsa.name !== "website_ref_desc"),
        variantSelectionAttributesUnique: this.cleanAttributes(
          this.uniqueAttributes(allVariants[0].selectorValues),
        ).filter((vsa) => vsa.name !== "website_ref_desc"),
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

    /**
     * We filter out website_ref_desc. We never want to use this as
     * an attribute, but only as variant name.
     */
    return {
      productAttributesUnique: this.uniqueAttributes(productAttributes),
      productAttributes,
      variantAttributes,
      variantAttributesUnique: this.cleanAttributes(
        this.uniqueAttributes(variantAttributes),
      ),
      variantSelectionAttributesUnique: this.cleanAttributes(
        this.uniqueAttributes(variantSelectionAttributes),
      ).filter((vsa) => vsa.name !== "website_ref_desc"),
      variantSelectionAttributes: this.cleanAttributes(
        variantSelectionAttributes,
      ).filter((vsa) => vsa.name !== "website_ref_desc"),
    };
  }

  /**
   * Set the attribute value for a product or a variant
   * needs the attribute id, the product id or variant id and the value, to be set
   * @param attribute Our internal attribute
   * @param attributeValue Can be a string, a concatenated string,
   * a reference to a product or variant.
   */
  private async setAttributeValue({
    attribute,
    attributeValue,
    productId,
    variantId,
    isForVariant,
  }: {
    attribute: Attribute;
    attributeValue: string;
    productId?: string;
    variantId?: string;
    isForVariant: boolean;
  }) {
    const attributeValueDecoded = htmlDecode(attributeValue);
    const normalizedName = normalizeStrings.attributeValueNames(attributeValue);
    this.logger.debug(
      `Setting attribute ${attribute.name}, value ${attributeValueDecoded}`,
    );

    if (isForVariant) {
      if (!variantId) throw new Error("VariantId is undefined");
      await this.db.attributeValueVariant.upsert({
        where: {
          productVariantId_attributeId_normalizedName_tenantId: {
            normalizedName,
            attributeId: attribute.id,
            productVariantId: variantId,
            tenantId: this.kencoveApiApp.tenantId,
          },
        },
        create: {
          id: id.id("attributeValue"),
          attribute: {
            connect: {
              id: attribute.id,
            },
          },
          normalizedName,
          tenant: {
            connect: {
              id: this.kencoveApiApp.tenantId,
            },
          },
          value: attributeValueDecoded,
          productVariant: {
            connect: {
              id: variantId,
            },
          },
        },
        update: {},
      });
    } else {
      if (!productId) throw new Error("ProductId is undefined");
      await this.db.attributeValueProduct.upsert({
        where: {
          productId_attributeId_normalizedName_tenantId: {
            normalizedName,
            attributeId: attribute.id,
            productId,
            tenantId: this.kencoveApiApp.tenantId,
          },
        },
        create: {
          id: id.id("attributeValue"),
          attribute: {
            connect: {
              id: attribute.id,
            },
          },
          normalizedName,
          tenant: {
            connect: {
              id: this.kencoveApiApp.tenantId,
            },
          },
          value: attributeValueDecoded,
          product: {
            connect: {
              id: productId,
            },
          },
        },
        update: {},
      });
    }
  }

  /**
   * We don't get clean data from the API, so we have to match
   * variant attributes manually. We sync the product type and which
   * attributes can be set for that product type, and afterwards we sync the
   * values for the attributes for each variant.
   */
  private async syncProductTypeAndAttributes(products: KencoveApiProduct[]) {
    const uniqueProductTypes = products
      .map((p) => p.productType)
      .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

    this.logger.info(
      `Found ${uniqueProductTypes.length} unique product types.`,
    );

    /**
     * All product types, that are already in the DB.
     */
    const existingProductTypes = await this.db.kencoveApiProductType.findMany({
      where: {
        kencoveApiAppId: this.kencoveApiApp.id,
        id: {
          in: uniqueProductTypes.map((pt) => pt.id),
        },
      },
      include: {
        productType: true,
      },
    });

    const kenProdTypes: KencoveApiProductType[] = [];

    /**
     * Create or update all unique product types in the DB
     */
    for (const productType of uniqueProductTypes) {
      const normalizedName = normalizeStrings.productTypeNames(
        productType.name,
      );
      /**
       * Look through all products where this prod type is used
       * and check if there are variants. If there are more than 1 variants,
       * we set the product type to isVariant = true
       */
      const isVariant = products.some(
        (p) => p.productType.id === productType.id && p.variants.length > 1,
      );
      const existingProductType = existingProductTypes.find(
        (pt) => pt.id === productType.id,
      );
      if (!existingProductType) {
        this.logger.info(`Creating product type ${productType.name}.`);
        const kenProdType = await this.db.kencoveApiProductType.create({
          data: {
            id: productType.id,
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
                  name: productType.name,
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
        kenProdTypes.push(kenProdType);
      } else {
        this.logger.info(`Updating product type "${productType.name}".`);
        let changeVariant: boolean | undefined;
        if (existingProductType.productType.isVariant === false && isVariant) {
          this.logger.info(
            `Product type ${productType.name} gets switched to a type with variants.`,
          );
          changeVariant = true;
        }
        const kenProdType = await this.db.kencoveApiProductType.update({
          where: {
            id_kencoveApiAppId: {
              id: productType.id,
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
                  name: productType.name,
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
        kenProdTypes.push(kenProdType);
      }
    }

    /**
     * loop over all products to set the attributes for each product type
     */
    for (const product of products) {
      const {
        variantAttributesUnique,
        variantSelectionAttributesUnique,
        productAttributesUnique,
      } = this.attributeMatch(product);

      const kenProdType = kenProdTypes.find(
        (pt) => pt.id === product.productType.id,
      );
      if (!kenProdType)
        throw new Error(
          `Product type ${product.productType.name} not found in DB`,
        );
      /**
       * Manually adding two product attributes: Accessory Items and Alternative Items.
       * They get values from the API in a different way, so we have to add them manually, so
       * move them to Saleor in a standard manner
       */
      productAttributesUnique.push({
        name: "Accessory Items",
        value: "",
        attribute_id: 333331,
        display_type: "reference",
        attribute_model: "custom",
      });
      productAttributesUnique.push({
        name: "Alternative Items",
        value: "",
        attribute_id: 333330,
        display_type: "reference",
        attribute_model: "custom",
      });

      this.logger.debug(
        "Product Attributes: " +
          JSON.stringify(productAttributesUnique, null, 2),
      );
      this.logger.debug(
        "Variant Attributes: " +
          JSON.stringify(variantAttributesUnique, null, 2),
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

      /**
       * Setting the variant Selection attributes for the product type
       */
      for (const attribute of variantSelectionAttributesUnique) {
        this.logger.debug(
          `Setting attribute ${attribute.name} as variant selection attribute`,
        );
        await this.setProductTypeAttribute(attribute, kenProdType, true, true);
      }

      /**
       * Setting the product attributes for the product type
       */
      for (const attribute of productAttributesUnique) {
        await this.setProductTypeAttribute(
          attribute,
          kenProdType,
          false,
          false,
        );
      }

      /**
       * Setting the variant attributes for the product type
       */
      for (const attribute of variantAttributesUnique) {
        await this.setProductTypeAttribute(attribute, kenProdType, true, false);
      }
    }
  }

  /**
   * Set the accessory and alternative items for a product
   * as product attributes
   * @param productId Internal schemabase productId
   * @param accessorySKUs The SKUs of the accessory items related to this item
   * @param alternativeSKUs The SKUs of the alternative items related to this item
   */
  private async setAccessoryAndAlternativeItems(
    productId: string,
    accessorySKUs: string[] | undefined,
    alternativeSKUs: string[] | undefined,
  ) {
    if (accessorySKUs) {
      const accessoryItems = await this.db.productVariant.findMany({
        where: {
          sku: {
            in: accessorySKUs,
          },
          tenantId: this.kencoveApiApp.tenantId,
        },
      });
      const accessoryItemAttribute =
        await this.db.kencoveApiAttribute.findUnique({
          where: {
            id_kencoveApiAppId: {
              id: "333331",
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          include: {
            attribute: true,
          },
        });
      if (!accessoryItemAttribute)
        throw new Error("Accessory Item Attribute not found in DB");
      for (const accessoryItem of accessoryItems) {
        await this.setAttributeValue({
          attribute: accessoryItemAttribute.attribute,
          attributeValue: accessoryItem.productId,
          productId,
          isForVariant: false,
        });
      }
    }
    if (alternativeSKUs) {
      const alternativeItems = await this.db.productVariant.findMany({
        where: {
          sku: {
            in: alternativeSKUs,
          },
          tenantId: this.kencoveApiApp.tenantId,
        },
      });
      const alternativeItemAttribute =
        await this.db.kencoveApiAttribute.findUnique({
          where: {
            id_kencoveApiAppId: {
              id: "333330",
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          include: {
            attribute: true,
          },
        });
      if (!alternativeItemAttribute)
        throw new Error("Alternative Item Attribute not found in DB");
      for (const alternativeItem of alternativeItems) {
        await this.setAttributeValue({
          attribute: alternativeItemAttribute.attribute,
          attributeValue: alternativeItem.productId,
          productId,
          isForVariant: false,
        });
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
              kencoveApiProductVariant: true,
              product: true,
            },
          },
        },
      });

    /**
     * First sync the product types and related attributes.
     * Not the attribute values.
     * TODO: refactor, so that we first "build" all product
     * types and their related attributes and then sync alltogether
     * and not product by product. We have for example 1000 products
     * but just 25 product types
     */
    await this.syncProductTypeAndAttributes(products);

    /**
     * just kencove Api product variants enhanced with all data from their parent product
     */
    const enhancedProducts = products.map((p) => {
      return {
        productType: p.productType,
        accessories: p.accessories,
        alternatives: p.alternatives,
        description: p?.website_description,
        countryOfOrigin: p.countryOfOrigin,
        productId: p.id,
        productName: htmlDecode(p.name),
        categoryId: p?.categoryId?.toString(),
        variants: p.variants.map((v) => ({
          ...v,
          productId: p.id,
          productName: htmlDecode(p.name),
          countryOfOrigin: p.countryOfOrigin,
        })),
      };
    });

    /**
     * First loop is looping over all products and inner loop is looping
     * over all variants of the product
     */
    for (const product of enhancedProducts) {
      const normalizedProductName = normalizeStrings.productNames(
        product.productName,
      );
      const kenProdTypeWithProductType =
        await this.db.kencoveApiProductType.findUnique({
          where: {
            id_kencoveApiAppId: {
              id: product.productType.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          include: {
            productType: {
              include: {
                attributes: {
                  include: {
                    attribute: {
                      include: {
                        kencoveApiAttributes: {
                          where: {
                            kencoveApiAppId: this.kencoveApiApp.id,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });
      if (!kenProdTypeWithProductType) {
        this.logger.error(
          `Could not find product type ${product.productType.name}. ` +
            "This should not happen, as we created the product type in the previous step.",
        );
        continue;
      }

      const countryOfOrigin = product.countryOfOrigin
        ? countryCodeMatch(product.countryOfOrigin)
        : undefined;

      const category = existingCategories.find(
        (c) => c.id === product.categoryId,
      )?.categoryId;

      /**
       * The internal product id of the product.
       * As we are upserting variants, we can set
       * this first after the variant sync
       */
      let internalProductId: string = "";
      for (const variant of product.variants) {
        const updatedAt = new Date(variant.updatedAt);
        const createdAt = new Date(variant.createdAt);
        // const existingProductVariant = existingProductVariants.find(
        //   (p) => p.id === variant.id,
        // );

        this.logger.info(
          `Syncing product variant ${variant.id} of product ${product.productName}`,
        );

        /**
         * The product variant name. This value is often not clean coming from the API, so we
         * set the value from the API just as fallback. When we have website_ref_desc attribute
         * and we did not replace it with a different attribute, we use the value of the
         * attribute as variant name
         */
        let variantName = variant.name;
        if (
          !this.kenVariantSelectionAttributeOverwrite.get(variant.id) &&
          variant.selectorValues?.[0]?.name === "website_ref_desc"
        ) {
          const variantSelectionAttribute = this.cleanAttributes(
            variant.selectorValues,
          )[0];

          if (variantSelectionAttribute) {
            this.logger.debug(
              `Using attribute ${variantSelectionAttribute.value} as variant name`,
            );
            variantName = variantSelectionAttribute.value;
          }
        }

        /**
         * Upsert the product variant. Return the upserted variant from our DB
         */
        const upsertedVariant = await this.db.kencoveApiProductVariant.upsert({
          where: {
            id_kencoveApiAppId: {
              id: variant.id,
              kencoveApiAppId: this.kencoveApiApp.id,
            },
          },
          create: {
            id: variant.id,
            kencoveApiApp: {
              connect: {
                id: this.kencoveApiApp.id,
              },
            },
            createdAt,
            updatedAt,
            productId: product.productId,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: variant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: variant.sku,
                  weight: variant.weight,
                  variantName,
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
                        name: product.productName,
                        normalizedName: normalizedProductName,
                        descriptionHTML: product.description,
                        productType: {
                          connect: {
                            id: kenProdTypeWithProductType.productTypeId,
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
            productId: product.productId,
            productVariant: {
              connectOrCreate: {
                where: {
                  sku_tenantId: {
                    sku: variant.sku,
                    tenantId: this.kencoveApiApp.tenantId,
                  },
                },
                create: {
                  id: id.id("variant"),
                  sku: variant.sku,
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
                        name: variant.productName,
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
                weight: variant.weight,
                variantName,
                product: {
                  update: {
                    descriptionHTML: product.description,
                    productType: {
                      connect: {
                        id: kenProdTypeWithProductType.productTypeId,
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
        internalProductId = upsertedVariant.productVariant.productId;

        /// set the attribute values. We need to check the product type
        /// to see, if an attribute is used as product, or variant
        /// attribute create a value entry accordingly.
        const allAttributes = [
          ...variant.attributeValues,
          ...variant.selectorValues,
        ];
        for (const attribute of this.cleanAttributes(allAttributes)) {
          if (attribute.name === "website_ref_desc") {
            continue;
          }
          const matchedAttr =
            kenProdTypeWithProductType.productType.attributes.find((a) => {
              if (a.attribute.kencoveApiAttributes.length === 0) {
                return false;
              }
              const kenAttribute = a.attribute.kencoveApiAttributes[0];
              if (kenAttribute.id === attribute.attribute_id.toString()) {
                this.logger.debug(
                  `Found attribute ${attribute.name} in product ` +
                    `type ${kenProdTypeWithProductType.productType.name}`,
                );
                return true;
              }
              return false;
            });
          if (!matchedAttr) {
            this.logger.debug(
              `Could not find attribute ${attribute.name} in product ` +
                `type ${kenProdTypeWithProductType.productType.name}`,
            );
            continue;
          }
          /**
           * We get values for dropdown / multiselect attributes from the API
           * as array of string in the values "["value1", "value2"]". We need to
           * create independent attribute values for each value and call "setAttributeValue"
           * for each of them. We test, if we have an array.
           */
          if (attribute.value.match(/^\[.*\]$/)) {
            this.logger.debug(
              `Found array of values for attribute ${attribute.name}`,
            );
            const values = JSON.parse(attribute.value);
            for (const value of values) {
              await this.setAttributeValue({
                productId: upsertedVariant.productVariant.productId,
                variantId: upsertedVariant.productVariantId,
                attribute: matchedAttr.attribute,
                attributeValue: value,
                isForVariant: matchedAttr?.isForVariant ?? false,
              });
            }
          } else {
            await this.setAttributeValue({
              productId: upsertedVariant.productVariant.productId,
              variantId: upsertedVariant.productVariantId,
              attribute: matchedAttr.attribute,
              attributeValue: attribute.value,
              isForVariant: matchedAttr?.isForVariant ?? false,
            });
          }
        }
      }

      /**
       * Set the accessory and alternative items for the product
       * as product attributes
       */
      await this.setAccessoryAndAlternativeItems(
        internalProductId,
        product.accessories?.map((a) => a.itemCode),
        product.alternatives?.map((a) => a.itemCode),
      );
    }

    /**
     * Update internal products, if values did change. As we can't rely on data coming from the
     * API, we do more sanitisation and checks here.
     */
    for (const product of enhancedProducts) {
      const existingProduct = existingProductVariants.find(
        (p) => p.productVariant.sku === product.variants[0].sku,
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
