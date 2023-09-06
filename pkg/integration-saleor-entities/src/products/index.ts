/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
  ProductAttributeVariantSelectionMutation,
  ProductAttributeVariantSelectionMutationVariables,
  ProductCreateMutation,
  ProductCreateMutationVariables,
  ProductTypeCreateMutation,
  ProductTypeCreateMutationVariables,
  ProductTypeFragment,
  ProductTypeUpdateMutation,
  ProductTypeUpdateMutationVariables,
  ProductVariantBulkCreateInput,
  ProductVariantBulkCreateMutation,
  ProductVariantBulkCreateMutationVariables,
  ProductVariantStockEntryUpdateMutation,
  queryWithPagination,
  SaleorEntitySyncProductsQuery,
  SaleorProductVariantBasicDataQuery,
  SaleorUpdateMetadataMutation,
  StockInput,
  VariantFragment,
} from "@eci/pkg/saleor";
import { PrismaClient, Prisma } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { subHours, subYears } from "date-fns";
import { editorJsHelper } from "../editorjs";

interface SaleorProductSyncServiceConfig {
  saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
      updatedAtGte?: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantBasicData: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantBasicDataQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
    saleorUpdateMetadata: (variables: {
      id: string;
      input: {
        key: string;
        value: string;
        __typename?: "MetadataItem" | undefined;
      }[];
    }) => Promise<SaleorUpdateMetadataMutation>;
    productCreate: (
      variables: ProductCreateMutationVariables,
    ) => Promise<ProductCreateMutation>;
    productTypeCreate: (
      variables: ProductTypeCreateMutationVariables,
    ) => Promise<ProductTypeCreateMutation>;
    productAttributeVariantSelection: (
      variables: ProductAttributeVariantSelectionMutationVariables,
    ) => Promise<ProductAttributeVariantSelectionMutation>;
    productVariantBulkCreate: (
      variables: ProductVariantBulkCreateMutationVariables,
    ) => Promise<ProductVariantBulkCreateMutation>;
    productTypeUpdate: (
      variables: ProductTypeUpdateMutationVariables,
    ) => Promise<ProductTypeUpdateMutation>;
  };
  channelSlug?: string;
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
}

export class SaleorProductSyncService {
  public readonly saleorClient: {
    saleorEntitySyncProducts: (variables: {
      first: number;
      channel?: string;
      after: string;
      updatedAtGte?: string;
    }) => Promise<SaleorEntitySyncProductsQuery>;
    saleorProductVariantBasicData: (variables: {
      id: string;
    }) => Promise<SaleorProductVariantBasicDataQuery>;
    productVariantStockEntryUpdate: (variables: {
      variantId: string;
      stocks: StockInput[];
    }) => Promise<ProductVariantStockEntryUpdateMutation>;
    saleorUpdateMetadata: (variables: {
      id: string;
      input: {
        key: string;
        value: string;
        __typename?: "MetadataItem" | undefined;
      }[];
    }) => Promise<SaleorUpdateMetadataMutation>;
    productCreate: (
      variables: ProductCreateMutationVariables,
    ) => Promise<ProductCreateMutation>;
    productTypeCreate: (
      variables: ProductTypeCreateMutationVariables,
    ) => Promise<ProductTypeCreateMutation>;
    productAttributeVariantSelection: (
      variables: ProductAttributeVariantSelectionMutationVariables,
    ) => Promise<ProductAttributeVariantSelectionMutation>;
    productVariantBulkCreate: (
      variables: ProductVariantBulkCreateMutationVariables,
    ) => Promise<ProductVariantBulkCreateMutation>;
    productTypeUpdate: (
      variables: ProductTypeUpdateMutationVariables,
    ) => Promise<ProductTypeUpdateMutation>;
  };

  public readonly channelSlug?: string;

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  public constructor(config: SaleorProductSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "items",
    });
  }

  /**
   * Try to extract the default warehouse name from stocks of a variant.
   */
  private getDefaultWarehouse(variant: VariantFragment) {
    try {
      if (!variant?.stocks || variant.stocks.length === 0) {
        throw new Error(
          `Product Variant has no stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`,
        );
      }
      if (variant?.stocks?.length > 1) {
        throw new Error(
          `Product Variant has multiple stocks (warehouses) assigned, therefore we can not determine the default warehouse. Aborting sync.`,
        );
      }
      if (!variant.stocks?.[0]?.warehouse?.name) {
        throw new Error(
          `First Warehouse of Product Variant (the default warehouse) has no name set. Aborting sync.`,
        );
      }
      const normalizedDefaultWarehouseName = normalizeStrings.warehouseNames(
        variant.stocks?.[0]?.warehouse.name,
      );
      return normalizedDefaultWarehouseName;
    } catch (error: any) {
      this.logger.warn(
        `Error determining the default warehouse: ${error.message}`,
      );
      return undefined;
    }
  }

  /**
   * Take the information we get from saleor and synchronise our internal product type model
   * accordingly
   */
  private async syncProductType(productType: ProductTypeFragment) {
    const normalizedProductTypeName = normalizeStrings.productTypeNames(
      productType.name,
    );
    await this.db.saleorProductType.upsert({
      where: {
        id_installedSaleorAppId: {
          id: productType.id,
          installedSaleorAppId: this.installedSaleorAppId,
        },
      },
      create: {
        id: productType.id,
        installedSaleorApp: {
          connect: {
            id: this.installedSaleorAppId,
          },
        },
        productType: {
          connectOrCreate: {
            where: {
              normalizedName_tenantId: {
                normalizedName: normalizedProductTypeName,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("productType"),
              name: productType.name,
              normalizedName: normalizedProductTypeName,
              isVariant: productType.hasVariants,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
            },
          },
        },
      },
      update: {
        productType: {
          connectOrCreate: {
            where: {
              normalizedName_tenantId: {
                normalizedName: normalizedProductTypeName,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("productType"),
              name: productType.name,
              normalizedName: normalizedProductTypeName,
              isVariant: productType.hasVariants,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Manually set variant attributes as variant selection attributes.
   * Saleor supports ['dropdown', 'boolean', 'swatch', 'numeric'] for
   * that only.
   */
  private async setProductTypeVariantSelectionAttributes(
    variantSelectionAttributes: string[],
    saleorProdTypeId: string,
  ) {
    for (const selectionAttribute of variantSelectionAttributes) {
      const resp = await this.saleorClient.productAttributeVariantSelection({
        attributeId: selectionAttribute,
        productTypeId: saleorProdTypeId,
      });
      if (
        resp.productAttributeAssignmentUpdate?.errors &&
        resp?.productAttributeAssignmentUpdate?.errors?.length > 0
      ) {
        this.logger.error(
          `Error setting variant selection attribute ${selectionAttribute} for saleor product type ${saleorProdTypeId}: ${JSON.stringify(
            resp.productAttributeAssignmentUpdate.errors,
          )}`,
        );
      }
    }
  }

  /**
   * Fetches all product types, without saleor ID set, that we create now
   * and all product types, that changed since the last run and update these
   * in Saleor
   * @param gteDate
   * @returns
   */
  private async createOrUpdateProductTypeinSaleor(gteDate: Date) {
    const productTypesToCreateOrUpdate = await this.db.productType.findMany({
      where: {
        OR: [
          {
            saleorProductTypes: {
              none: {
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          },
          {
            updatedAt: {
              gte: gteDate,
            },
          },
        ],
      },
      include: {
        attributes: {
          include: {
            attribute: {
              include: {
                saleorAttributes: {
                  where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
        },
        saleorProductTypes: {
          where: {
            installedSaleorAppId: this.installedSaleorAppId,
          },
        },
      },
    });
    if (productTypesToCreateOrUpdate.length > 0) {
      this.logger.info(
        `Found ${productTypesToCreateOrUpdate.length} product types to create or update in Saleor`,
        {
          productTypesToCreate: productTypesToCreateOrUpdate.map((x) => x.name),
        },
      );
      for (const prodType of productTypesToCreateOrUpdate) {
        /**
         * When this prod type does already exist in saleor, we have
         * this saleor id set
         */
        const existingProdTypeId = prodType.saleorProductTypes?.[0]?.id;
        const productAttributes = prodType.attributes
          .filter((a) => !a.isForVariant)
          .filter((a) => a.attribute.saleorAttributes.length > 0)
          .map((a) => a.attribute.saleorAttributes[0].id);
        const variantAttributes = prodType.attributes
          .filter((a) => a.isForVariant)
          .filter((a) => a.attribute.saleorAttributes.length > 0)
          .map((a) => a.attribute.saleorAttributes[0].id);
        const variantSelectionAttributes = prodType.attributes
          .filter((a) => a.isVariantSelection)
          .filter((a) => a.attribute.saleorAttributes.length > 0)
          // Saleor only supports certain attribute types for variant selection.
          .filter((a) =>
            ["dropdown", "boolean", "swatch", "numeric"].includes(
              a.attribute.type.toString().toLowerCase(),
            ),
          )
          .map((a) => a.attribute.saleorAttributes[0].id);

        this.logger.info(
          `Creating product type ${prodType.name} in Saleor now.`,
        );
        if (!existingProdTypeId) {
          const productTypeCreateResponse =
            await this.saleorClient.productTypeCreate({
              input: {
                name: prodType.name,
                hasVariants: prodType.isVariant,
                productAttributes,
                variantAttributes,
              },
            });
          if (
            productTypeCreateResponse?.productTypeCreate?.errors &&
            productTypeCreateResponse?.productTypeCreate?.errors?.length > 0
          ) {
            this.logger.error(
              `Error creating product type ${
                prodType.name
              } in Saleor: ${JSON.stringify(
                productTypeCreateResponse.productTypeCreate.errors,
              )}`,
            );
            return;
          }
          if (!productTypeCreateResponse?.productTypeCreate?.productType?.id) {
            this.logger.error(
              `Error creating product type ${prodType.name} in Saleor: No product type id returned`,
            );
            return;
          }
          const saleorProdTypeId =
            productTypeCreateResponse.productTypeCreate.productType.id;
          await this.db.saleorProductType.create({
            data: {
              id: saleorProdTypeId,
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
              productType: {
                connect: {
                  id: prodType.id,
                },
              },
            },
          });
          await this.setProductTypeVariantSelectionAttributes(
            variantSelectionAttributes,
            saleorProdTypeId,
          );
          this.logger.info(
            `Successfully created product type ${prodType.name} in Saleor`,
          );
        } else {
          const productTypeUpdateResponse =
            await this.saleorClient.productTypeUpdate({
              id: existingProdTypeId,
              input: {
                name: prodType.name,
                hasVariants: prodType.isVariant,
                productAttributes,
                variantAttributes,
              },
            });
          if (
            productTypeUpdateResponse?.productTypeUpdate?.errors &&
            productTypeUpdateResponse?.productTypeUpdate?.errors?.length > 0
          ) {
            this.logger.error(
              `Error updating product type ${
                prodType.name
              } in Saleor: ${JSON.stringify(
                productTypeUpdateResponse.productTypeUpdate.errors,
              )}`,
            );
            return;
          }
          await this.setProductTypeVariantSelectionAttributes(
            variantSelectionAttributes,
            existingProdTypeId,
          );
          this.logger.info(
            `Successfully updated product type ${prodType.name} in Saleor`,
          );
        }
      }
    } else {
      this.logger.info(`No product types to create or update in Saleor`);
    }
  }

  /**
   * Find and create all products, that are not yet created in Saleor
   */
  private async createProductinSaleor() {
    const productsToCreate = await this.db.productVariant.findMany({
      where: {
        AND: [
          {
            saleorProductVariant: {
              none: {
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          },
          {
            product: {
              productType: {
                saleorProductTypes: {
                  some: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        product: {
          include: {
            saleorProducts: {
              where: {
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
            attributes: {
              include: {
                attribute: {
                  include: {
                    saleorAttributes: {
                      where: {
                        installedSaleorAppId: this.installedSaleorAppId,
                      },
                    },
                  },
                },
              },
            },
            productType: {
              include: {
                attributes: true,
                saleorProductTypes: {
                  where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
            category: {
              include: {
                saleorCategories: {
                  where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
            variants: {
              include: {
                attributes: {
                  include: {
                    attribute: {
                      include: {
                        saleorAttributes: {
                          where: {
                            installedSaleorAppId: this.installedSaleorAppId,
                          },
                        },
                      },
                    },
                  },
                },
                saleorProductVariant: {
                  where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (productsToCreate.length > 0) {
      this.logger.info(
        `Found ${
          productsToCreate.length
        } products to create in Saleor: ${productsToCreate.map((p) => p.sku)}`,
      );
      for (const product of productsToCreate) {
        const productType = product.product.productType;
        if (!productType) {
          this.logger.warn(
            `Product ${product.sku} has no product type. Skipping`,
          );
          continue;
        }
        if (!productType.saleorProductTypes?.[0]?.id) {
          this.logger.warn(
            `Product ${product.sku} has no product type in Saleor. Skipping`,
          );
          continue;
        }
        /**
         * The description as editorjs json
         */
        const description = product.product.descriptionHTML
          ? JSON.stringify(
              await editorJsHelper.HTMLToEditorJS(
                product.product.descriptionHTML,
              ),
            )
          : undefined;

        const saleorCategoryId =
          product.product.category?.saleorCategories?.[0]?.id;
        if (!saleorCategoryId) {
          this.logger.warn(`Product ${product.sku} has no category. Skipping`);
          continue;
        }
        const attributes = product.product.attributes
          .filter((a) => a.attribute.saleorAttributes.length > 0)
          .map((a) => {
            /**
             * Multiselect attributes are stored as array in our DB
             */
            if (a.attribute.type === "MULTISELECT") {
              this.logger.debug(a.value);
              return {
                id: a.attribute.saleorAttributes[0].id,
                values: a.value as unknown as string[],
              };
            }
            return {
              id: a.attribute.saleorAttributes[0].id,
              values: [a.value],
            };
          });
        let saleorProductId = product.product.saleorProducts?.[0]?.id;
        if (!saleorProductId) {
          this.logger.info(`Creating product ${product.sku} in Saleor`, {
            attributes,
          });

          const productCreateResponse = await this.saleorClient.productCreate({
            input: {
              attributes,
              category: saleorCategoryId,
              chargeTaxes: true,
              collections: [],
              description,
              name: product.product.name,
              weight: product.weight ?? undefined,
              productType: productType.saleorProductTypes[0].id,
            },
          });
          if (
            (productCreateResponse.productCreate?.errors &&
              productCreateResponse.productCreate?.errors.length > 0) ||
            !productCreateResponse.productCreate?.product?.id
          ) {
            this.logger.error(
              `Error creating product ${
                product.sku
              } in Saleor: ${JSON.stringify(
                productCreateResponse?.productCreate?.errors,
              )}`,
            );
            continue;
          }
          const createdProduct = productCreateResponse.productCreate.product;
          saleorProductId = createdProduct.id;
          this.logger.info(
            `Successfully created product ${product.sku} in Saleor`,
          );
          await this.db.saleorProduct.create({
            data: {
              id: createdProduct.id,
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
              product: {
                connect: {
                  id: product.product.id,
                },
              },
              updatedAt: product.updatedAt,
            },
          });
        }
        // Bulk create the product variants
        const variantsToCreate = product.product.variants.filter(
          (v) => v.saleorProductVariant.length === 0,
        );
        if (variantsToCreate.length > 0) {
          this.logger.info(
            `Found ${variantsToCreate.length} variants to create for product ${product.sku} in Saleor`,
          );
          const variantsToCreateInput:
            | ProductVariantBulkCreateInput
            | ProductVariantBulkCreateInput[] = variantsToCreate.map((v) => ({
            attributes: v.attributes
              .filter((a) => a.attribute.saleorAttributes.length > 0)
              .map((a) => ({
                id: a.attribute.saleorAttributes[0].id,
                values: [a.value],
              })),
            sku: v.sku,
            name: v.variantName,
            trackInventory: true,
          }));
          const productVariantBulkCreateResponse =
            await this.saleorClient.productVariantBulkCreate({
              variants: variantsToCreateInput,
              productId: saleorProductId,
            });
          if (
            productVariantBulkCreateResponse.productVariantBulkCreate?.errors &&
            productVariantBulkCreateResponse.productVariantBulkCreate?.errors
              .length > 0
          ) {
            this.logger.error(
              `Error creating variants for product ${
                product.sku
              } in Saleor: ${JSON.stringify(
                productVariantBulkCreateResponse.productVariantBulkCreate
                  .errors,
              )}`,
            );
            continue;
          }
          this.logger.info(
            `Successfully created ${variantsToCreate.length} variants for product ${product.sku} in Saleor`,
          );
          // Store the created variants in our DB
          for (const variant of variantsToCreate) {
            const createdVariant =
              productVariantBulkCreateResponse.productVariantBulkCreate?.productVariants?.find(
                (v) => v.sku === variant.sku,
              )?.id;
            if (!createdVariant) {
              this.logger.error(
                `Error creating variant ${variant.sku} for product ${product.sku} in Saleor: No variant id returned`,
              );
              continue;
            }
            await this.db.saleorProductVariant.create({
              data: {
                id: createdVariant,
                installedSaleorApp: {
                  connect: {
                    id: this.installedSaleorAppId,
                  },
                },
                productId: saleorProductId,
                updatedAt: new Date(),
                productVariant: {
                  connect: {
                    sku_tenantId: {
                      sku: variant.sku,
                      tenantId: this.tenantId,
                    },
                  },
                },
              },
            });
          }
        }
      }
    } else {
      this.logger.info(`No products to create in Saleor`);
    }
  }

  public async syncToECI(): Promise<void> {
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
    const response = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorEntitySyncProducts({
        first,
        after,
        channel: this.channelSlug,
        updatedAtGte: createdGte.toISOString(),
      }),
    );

    const products = response.products?.edges.map((x) => x.node);

    if (!products) {
      this.logger.info("No products returned from saleor! Aborting sync");
      return;
    }

    this.logger.info(`Syncing ${products.length} products`);

    for (const product of products) {
      if (!product.variants) {
        this.logger.warn(
          // eslint-disable-next-line max-len
          `No variants returned for product ${product.id} There should be minimum one variant per product.`,
        );
        continue;
      }

      /**
       * The category corresponding to this product. Our internal category
       * id is stored in the "categoryId" variable
       */
      const category = product.category
        ? await this.db.saleorCategory.findUnique({
            where: {
              id_installedSaleorAppId: {
                id: product.category.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          })
        : undefined;

      const normalizedProductName = normalizeStrings.productNames(product.name);

      /**
       * Sync the product type
       */
      await this.syncProductType(product.productType);

      for (const variant of product.variants) {
        const defaultLogFields = {
          variantId: variant?.id,
          variantSku: variant?.sku,
          variantName: variant?.name,
          productId: product.id,
          productName: product.name,
        };
        try {
          if (!variant) {
            throw new Error("Variant empty");
          }
          if (!variant?.sku) {
            throw new Error(
              `Product Variant ${variant?.id} has no SKU! Aborting sync`,
            );
          }

          /**
           * if set, this is the default warehouse name
           */
          const normalizedDefaultWarehouseName =
            this.getDefaultWarehouse(variant);

          /**
           * The product variants EAN-13 number. Stored as metadata field in Saleor
           */
          const ean = variant.metadata.find(
            (meta) => meta?.key === "EAN",
          )?.value;

          const resp = await this.db.saleorProductVariant.upsert({
            where: {
              id_installedSaleorAppId: {
                id: variant.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
            create: {
              id: variant!.id,
              productId: product.id,
              updatedAt: product.updatedAt,
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
              productVariant: {
                connectOrCreate: {
                  where: {
                    sku_tenantId: {
                      sku: variant.sku,
                      tenantId: this.tenantId,
                    },
                  },
                  create: {
                    id: id.id("variant"),
                    defaultWarehouse: normalizedDefaultWarehouseName
                      ? {
                          connect: {
                            normalizedName_tenantId: {
                              normalizedName: normalizedDefaultWarehouseName,
                              tenantId: this.tenantId,
                            },
                          },
                        }
                      : undefined,
                    sku: variant.sku,
                    variantName: variant.name,
                    ean,
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                    product: {
                      connectOrCreate: {
                        where: {
                          normalizedName_tenantId: {
                            normalizedName: normalizedProductName,
                            tenantId: this.tenantId,
                          },
                        },
                        create: {
                          id: id.id("product"),
                          category: category
                            ? {
                                connect: {
                                  id: category.id,
                                },
                              }
                            : undefined,
                          tenant: {
                            connect: {
                              id: this.tenantId,
                            },
                          },
                          name: product.name,
                          normalizedName: normalizedProductName,
                        },
                      },
                    },
                  },
                },
              },
            },
            update: {
              updatedAt: product.updatedAt,
              productId: product.id,
              productVariant: {
                connectOrCreate: {
                  where: {
                    sku_tenantId: {
                      sku: variant.sku,
                      tenantId: this.tenantId,
                    },
                  },
                  create: {
                    // TODO: does it make sense to set stock entries here as well
                    id: id.id("variant"),
                    defaultWarehouse: normalizedDefaultWarehouseName
                      ? {
                          connect: {
                            normalizedName_tenantId: {
                              normalizedName: normalizedDefaultWarehouseName,
                              tenantId: this.tenantId,
                            },
                          },
                        }
                      : undefined,
                    sku: variant.sku,
                    variantName: variant.name,
                    ean,
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                    product: {
                      connectOrCreate: {
                        where: {
                          normalizedName_tenantId: {
                            normalizedName: normalizedProductName,
                            tenantId: this.tenantId,
                          },
                        },
                        create: {
                          id: id.id("product"),
                          tenant: {
                            connect: {
                              id: this.tenantId,
                            },
                          },
                          category: category
                            ? {
                                connect: {
                                  id: category.id,
                                },
                              }
                            : undefined,
                          name: product.name,
                          normalizedName: normalizedProductName,
                        },
                      },
                    },
                  },
                },
                update: {
                  variantName: variant.name,
                  sku: variant.sku,
                  product: {
                    update: {
                      category: category
                        ? {
                            connect: {
                              id: category.id,
                            },
                          }
                        : undefined,
                    },
                  },
                  // TODO: does it make sense to update stock entries here as well
                  defaultWarehouse: normalizedDefaultWarehouseName
                    ? {
                        connect: {
                          normalizedName_tenantId: {
                            normalizedName: normalizedDefaultWarehouseName,
                            tenantId: this.tenantId,
                          },
                        },
                      }
                    : undefined,
                  ean,
                },
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
          await this.db.saleorProduct.upsert({
            where: {
              id_installedSaleorAppId: {
                id: product.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
            create: {
              id: product.id,
              updatedAt: product.updatedAt,
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
              product: {
                connect: {
                  id: resp.productVariant.product.id,
                },
              },
            },
            update: {
              updatedAt: product.updatedAt,
            },
          });
          this.logger.debug("Successfully synced", defaultLogFields);
        } catch (err) {
          if (err instanceof Warning) {
            this.logger.warn(err.message, {
              ...defaultLogFields,
              stack: err.stack,
            });
          } else if (err instanceof Error) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
              if (
                err.code === "P2025" &&
                (err?.meta?.cause as string).includes("No 'Warehouse' record")
              ) {
                this.logger.warn(
                  "Warehouse for defaultwarehouse relation is missing. Aborting sync. Should retry after rerun of Saleor Warehouse sync.",
                );
              }
            } else {
              this.logger.error(err.message, {
                ...defaultLogFields,
                stack: err.stack,
              });
            }
          } else {
            this.logger.error(
              "An unknown Error occured during product-variant sync loop: " +
                (err as any)?.toString(),
              defaultLogFields,
            );
          }
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
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

    /**
     * Get all product types, that are not yet created in Saleor
     */
    await this.createOrUpdateProductTypeinSaleor(createdGte);

    /**
     * Get all products, that are not yet create in Saleor. Select only
     * the ones, where we have a product type already in Saleor
     */
    await this.createProductinSaleor();

    /**
     * get all saleor productVariants where related stockEntries have been updated since last run or where related
     * productVariants have been updated since last run
     */
    const saleorProductVariants = await this.db.saleorProductVariant.findMany({
      where: {
        installedSaleorAppId: this.installedSaleorAppId,
        OR: [
          {
            updatedAt: {
              gte: createdGte,
            },
          },
          {
            productVariant: {
              updatedAt: {
                gte: createdGte,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        productId: true,
        productVariant: {
          select: {
            id: true,
            sku: true,
            stockEntries: true,
            averageRating: true,
            ratingCount: true,
            productId: true,
          },
        },
      },
    });

    if (saleorProductVariants.length === 0) {
      this.logger.info(
        "Saleor products did not change since last run or we have none in our DB. Aborting sync.",
      );
      return;
    }

    this.logger.info(
      `Working on ${saleorProductVariants.length} saleor product variants, where we have stock or review changes since the last run.`,
    );

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
      },
    });

    /**
     * A set of products, whose reviews have changed. We need this to update the average rating of the product.
     * Stores the internal ECI product id and the saleor product id.
     */
    const productsWithReviewsChanged = new Set<{
      eciProductId: string;
      saleorProductId: string;
    }>();

    for (const variant of saleorProductVariants) {
      // Get the current commited stock and the metadata of this product variant from saleor.
      // We need fresh data here, as the commited stock can change all the time.
      const saleorProductVariant =
        await this.saleorClient.saleorProductVariantBasicData({
          id: variant.id,
        });
      if (
        !saleorProductVariant ||
        !saleorProductVariant.productVariant?.id ||
        !saleorProductVariant.productVariant.stocks
      ) {
        this.logger.warn(
          `No product variant returned from saleor for id ${variant.id}! Cant update stocks.\
          Deleting variant in internal DB`,
        );
        if (variant.id)
          await this.db.saleorProductVariant.delete({
            where: {
              id_installedSaleorAppId: {
                id: variant.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          });
        continue;
      }

      // loop over all stock entries that we have and bring them to saleor
      for (const stockEntry of variant.productVariant.stockEntries) {
        // Check, if we have a saleor warehouse for this stock entry.
        // If not continue.
        const saleorWarehouse = warehouses.find(
          (saleorWarehouse) =>
            saleorWarehouse.warehouseId === stockEntry.warehouseId,
        );
        const saleorWarehouseId = saleorWarehouse?.id;
        /**
         * Just update the stock for warehouses, that we have configured in Saleor
         */
        if (!saleorWarehouseId) {
          continue;
        }
        /**
         * The stock information of the current product variant in the current warehouse
         */
        const saleorStockEntry =
          saleorProductVariant.productVariant.stocks.find(
            (x) => x?.warehouse.id === saleorWarehouseId,
          );
        const currentlyAllocated = saleorStockEntry?.quantityAllocated || 0;

        /**
         * to get the "real" available stock, we have to add the currently allocated stock from saleor
         */
        const totalQuantity =
          stockEntry.actualAvailableForSaleStock + currentlyAllocated;
        await this.saleorClient.productVariantStockEntryUpdate({
          variantId: variant.id,
          stocks: [
            {
              warehouse: saleorWarehouseId,
              quantity: totalQuantity,
            },
          ],
        });
        this.logger.debug(
          `Updated stock entry for ${variant.productVariant.sku} - id ${variant.id}`,
        );
      }

      // We parse the current product ratings from the metadata. We create a object productRating with averageRating and ratingCount.
      // The data is located in the saleor metadata in the fields customerRatings_averageRating  and customerRatings_ratingCount
      /**
       * The parsed customer rating from Saleor
       */
      const productRatingFromSaleor = {
        averageRating: 0,
        ratingCount: 0,
      };

      const averageRating = saleorProductVariant.productVariant.metadata.find(
        (x) => x.key === "customerRatings_averageRating",
      )?.value;
      productRatingFromSaleor.averageRating = parseFloat(averageRating || "0");

      const ratingCount = saleorProductVariant.productVariant.metadata.find(
        (x) => x.key === "customerRatings_ratingCount",
      )?.value;
      productRatingFromSaleor.ratingCount = parseInt(ratingCount || "0");

      this.logger.debug(
        `Parsed product rating: ${JSON.stringify(
          productRatingFromSaleor,
        )} for ${variant.productVariant.sku}`,
      );

      if (
        productRatingFromSaleor?.averageRating !==
        variant.productVariant.averageRating
      ) {
        if (
          variant.productVariant.averageRating === null ||
          variant.productVariant.ratingCount === null
        )
          continue;
        this.logger.info(
          `Updating average rating for ${variant.id} / ${variant.productVariant.sku} to ${variant.productVariant.averageRating}. Old rating was ${productRatingFromSaleor?.averageRating}`,
        );

        // adding the product to the set of products with changed reviews, so that we update the
        // product metadata as well
        productsWithReviewsChanged.add({
          eciProductId: variant.productVariant.productId,
          saleorProductId: variant.productId,
        });

        // to make use of shop facet filters, we create a metadata item with name "customerRatings_facet" and value like this:
        // [ "1+", "2+" ] showing if a product variant has a rating of 2 or more stars. This can be used to filter all products, that have "minimum 2 stars".
        // When a product has 5 stars, the value will be [ "1+", "2+", "3+", "4+", "5+" ].
        const facetValue = [];
        for (let i = 1; i <= variant.productVariant.averageRating; i++) {
          facetValue.push(`${i}-and-above`);
        }

        const metadataNew = [
          {
            key: "customerRatings_facet",
            value: JSON.stringify(facetValue),
          },
          {
            key: "customerRatings_averageRating",
            value: variant.productVariant.averageRating.toString(),
          },
          {
            key: "customerRatings_ratingCount",
            value: variant.productVariant.ratingCount.toString(),
          },
        ];
        await this.saleorClient.saleorUpdateMetadata({
          id: saleorProductVariant.productVariant.id,
          input: metadataNew,
        });
      }
    }

    // calculate the average product rating and the sum of ratings using the customer rating from all related
    // and active product variants of the current product. Just do it, if one of the reviews has changed.
    for (const productSet of productsWithReviewsChanged) {
      await this.setAggregatedProductRating(productSet);
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
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
    this.logger.debug(`Sending this metadata: ${JSON.stringify(metadataNew)}`);
    await this.saleorClient.saleorUpdateMetadata({
      id: productSet.saleorProductId,
      input: metadataNew,
    });
  }
}
