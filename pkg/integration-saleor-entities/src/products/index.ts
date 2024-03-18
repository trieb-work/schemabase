/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
    AttributeValueInput,
    ProductTypeFragment,
    ProductVariantBulkCreateInput,
    ProductVariantBulkUpdateInput,
    queryWithPagination,
    SaleorClient,
    VariantFragment,
} from "@eci/pkg/saleor";
import {
    PrismaClient,
    Prisma,
    Media,
    InstalledSaleorApp,
    SaleorApp,
    ProductVariant,
    AttributeValueVariant,
    Product,
    SaleorAttribute,
    SaleorProductVariant,
    Attribute as SchemaBaseAttribute,
    Attribute,
    AttributeValueProduct,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { subHours, subYears } from "date-fns";
import { editorJsHelper } from "../editorjs";
import { MediaNotFoundError, MediaUpload } from "../mediaUpload.js";
import { parseBoolean } from "@eci/pkg/utils/parseBoolean";
import { SaleorProductManual } from "./productManual";

export interface SaleorProductSyncServiceConfig {
    saleorClient: SaleorClient;
    channelSlug?: string;
    installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };
    tenantId: string;
    db: PrismaClient;
    logger: ILogger;
}

export class SaleorProductSyncService {
    public readonly saleorClient: SaleorClient;

    protected readonly config: SaleorProductSyncServiceConfig;

    private readonly channelSlug?: string;

    protected readonly logger: ILogger;

    public readonly installedSaleorApp: InstalledSaleorApp & {
        saleorApp: SaleorApp;
    };

    protected readonly installedSaleorAppId: string;

    public readonly tenantId: string;

    private readonly cronState: CronStateHandler;

    protected readonly db: PrismaClient;

    /**
     * Cache for swatch attribute values. We need to create them in saleor
     * only once.
     */
    private swatchCache: Record<string, string> = {};

    public constructor(config: SaleorProductSyncServiceConfig) {
        this.config = config;
        this.saleorClient = config.saleorClient;
        this.channelSlug = config.channelSlug;
        this.logger = config.logger;
        this.installedSaleorApp = config.installedSaleorApp;
        this.installedSaleorAppId = config.installedSaleorApp.id;
        this.tenantId = config.tenantId;
        this.db = config.db;
        this.cronState = new CronStateHandler({
            tenantId: this.tenantId,
            appId: this.installedSaleorApp.id,
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
                    `Product Variant has no stocks (warehouses) assigned, therefore we can not determine the default warehouse.`,
                );
            }
            if (variant?.stocks?.length > 1) {
                throw new Error(
                    `Product Variant has multiple stocks (warehouses) assigned, therefore we can not determine the default warehouse.`,
                );
            }
            if (!variant.stocks?.[0]?.warehouse?.name) {
                throw new Error(
                    `First Warehouse of Product Variant (the default warehouse) has no name set. Aborting sync.`,
                );
            }
            const normalizedDefaultWarehouseName =
                normalizeStrings.warehouseNames(
                    variant.stocks?.[0]?.warehouse.name,
                );
            return normalizedDefaultWarehouseName;
        } catch (error: any) {
            // this.logger.warn(
            //     `Error determining the default warehouse: ${error.message}`,
            // );
            return undefined;
        }
    }

    /**
     * Take the information we get from saleor and synchronise our internal product type model
     * accordingly
     */
    private async syncProductType(productType: ProductTypeFragment) {
        this.logger.info(
            `Syncing product type ${productType.name} with internal DB`,
        );
        const normalizedProductTypeName = normalizeStrings.productTypeNames(
            productType.name,
        );
        const existingEntry = await this.db.saleorProductType.findUnique({
            where: {
                id_installedSaleorAppId: {
                    id: productType.id,
                    installedSaleorAppId: this.installedSaleorAppId,
                },
            },
            include: {
                productType: true,
            },
        });

        if (!existingEntry?.productType) {
            this.logger.info(
                `Creating product type ${productType.name} in internal DB`,
            );
            await this.db.productType.create({
                data: {
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
            });
        }

        /**
         * Just update, when something has changed
         */
        if (
            existingEntry?.productType?.normalizedName !==
            normalizedProductTypeName
        ) {
            this.logger.info(
                `Updating product type ${productType.name} in internal DB`,
            );
            await this.db.productType.update({
                where: {
                    id: existingEntry!.productType.id,
                },
                data: {
                    name: productType.name,
                    normalizedName: normalizedProductTypeName,
                    isVariant: productType.hasVariants,
                },
            });
        }
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
            this.logger.info(
                `Setting variant selection attribute ${selectionAttribute} for saleor product type ${saleorProdTypeId}`,
            );
            const resp =
                await this.saleorClient.productAttributeVariantSelection({
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
        const productTypesToCreateOrUpdate = await this.db.productType.findMany(
            {
                where: {
                    OR: [
                        {
                            saleorProductTypes: {
                                none: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                        {
                            updatedAt: {
                                gte: gteDate,
                            },
                        },
                        {
                            attributes: {
                                some: {
                                    updatedAt: {
                                        gte: gteDate,
                                    },
                                },
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
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
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
            },
        );
        if (productTypesToCreateOrUpdate.length > 0) {
            this.logger.info(
                `Found ${productTypesToCreateOrUpdate.length} product types to create or update in Saleor`,
                {
                    productTypesToCreate: productTypesToCreateOrUpdate.map(
                        (x) => x.name,
                    ),
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
                    `Creating / updating product type ${prodType.name} in Saleor now.`,
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
                        productTypeCreateResponse?.productTypeCreate?.errors
                            ?.length > 0
                    ) {
                        this.logger.error(
                            `Error creating product type ${
                                prodType.name
                            } in Saleor: ${JSON.stringify(
                                productTypeCreateResponse.productTypeCreate
                                    .errors,
                            )}`,
                        );
                        return;
                    }
                    if (
                        !productTypeCreateResponse?.productTypeCreate
                            ?.productType?.id
                    ) {
                        this.logger.error(
                            `Error creating product type ${prodType.name} in Saleor: No product type id returned`,
                        );
                        return;
                    }
                    const saleorProdTypeId =
                        productTypeCreateResponse.productTypeCreate.productType
                            .id;
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
                        productTypeUpdateResponse?.productTypeUpdate?.errors
                            ?.length > 0
                    ) {
                        this.logger.error(
                            `Error updating product type ${
                                prodType.name
                            } in Saleor: ${JSON.stringify(
                                productTypeUpdateResponse.productTypeUpdate
                                    .errors,
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

    public async deleteMedia(saleorMediaId: string) {
        const mediaDeleteResponse = await this.saleorClient.productMediaDelete({
            id: saleorMediaId,
        });
        if (
            mediaDeleteResponse.productMediaDelete?.errors &&
            mediaDeleteResponse.productMediaDelete?.errors.length > 0
        ) {
            this.logger.error(
                `Error deleting media ${saleorMediaId} in Saleor: ${JSON.stringify(
                    mediaDeleteResponse.productMediaDelete.errors,
                )}`,
            );
        }
    }

    /**
     * Takes our internal data schema and creates the corresponding
     * product variants with attributes in Saleors. Stores the Saleor Variant Ids
     * back in our DB.
     * @param variantsToCreate
     * @param product
     * @param saleorProductId
     * @returns
     */
    private async createProductVariantsInSaleor(
        variantsToCreate: (ProductVariant & {
            attributes: (AttributeValueVariant & {
                attribute: SchemaBaseAttribute & {
                    saleorAttributes: SaleorAttribute[];
                };
            })[];
        } & {
            saleorProductVariant: SaleorProductVariant[];
        })[],
        product: Product,
        saleorProductId: string,
    ) {
        this.logger.info(
            `Found ${variantsToCreate.length} variants to create for product ${product.name} in Saleor`,
        );
        const variantsToCreateInput: ProductVariantBulkCreateInput[] =
            await Promise.all(
                variantsToCreate.map(async (v) => ({
                    attributes:
                        await this.schemabaseAttributesToSaleorAttribute(
                            v.attributes,
                        ),

                    sku: v.sku,
                    name: v.variantName,
                    trackInventory: true,
                    weight: v.weight,
                })),
            );
        this.logger.debug(`Creating variants`, {
            attributes: JSON.stringify(
                variantsToCreateInput.map((x) => x.attributes),
                null,
                2,
            ),
        });
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
                    product.name
                } in Saleor: ${JSON.stringify(
                    productVariantBulkCreateResponse.productVariantBulkCreate
                        .errors,
                )}`,
            );
            return;
        }
        this.logger.info(
            `Successfully created ${variantsToCreate.length} variants for product ${product.name} in Saleor`,
        );
        // Store the created variants in our DB
        for (const variant of variantsToCreate) {
            const createdVariant =
                productVariantBulkCreateResponse.productVariantBulkCreate?.productVariants?.find(
                    (v) => v.sku === variant.sku,
                )?.id;
            if (!createdVariant) {
                this.logger.error(
                    `Error creating variant ${variant.sku} for product ${product.name} in Saleor: No variant id returned`,
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

    /**
     * Gets saleor product variant with their stock and
     * metadata. Deletes a product variant in our db, if it does not exist in saleor
     * any more
     */
    private async getSaleorProductVariants(variantIds: string[]) {
        // Get the current commited stock and the metadata of this product variant from saleor.
        //     // We need fresh data here, as the commited stock can change all the time.
        const response = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorProductVariantsBasicData({
                first,
                after,
                ids: variantIds,
            }),
        );
        const variants = response.productVariants;
        if (!variants) {
            this.logger.warn(
                `No product variants returned from saleor for ids ${variantIds}! Cant update stocks.\
          Deleting variants in internal DB`,
            );
            if (variantIds.length > 0)
                await this.db.saleorProductVariant.deleteMany({
                    where: {
                        id: {
                            in: variantIds,
                        },
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                });
            return null;
        }
        /**
         * check for the IDs of the variants, that we have in our DB, but not in saleor and delete them in our DB
         */
        const variantIdsInSaleor = variants.edges.map((v) => v.node.id);
        const variantIdsToDelete = variantIds.filter(
            (v) => !variantIdsInSaleor.includes(v),
        );
        if (variantIdsToDelete.length > 0) {
            this.logger.info(
                `Deleting ${variantIdsToDelete.length} variants in internal DB, that do not exist in saleor any more`,
            );
            await this.db.saleorProductVariant.deleteMany({
                where: {
                    id: {
                        in: variantIdsToDelete,
                    },
                    installedSaleorAppId: this.installedSaleorAppId,
                },
            });
        }

        /**
         * Rewriting the resulting data, returning edges.map((e) => node)
         * and making in every node the stock non nullable in the retruning type
         */
        const variantsWithStock = variants.edges.map((e) => ({
            ...e.node,
            stocks: e.node.stocks ?? [],
        }));

        return variantsWithStock;
    }

    /**
     * takes Media entries from our DB and a saleor productId. Uploads that media using mutation ProductMediaCreate.
     * Adds a metadata to the media to identify it as a media from our app. Does not check, if that media does already exist.
     * This has to be done before calling this function. We download the media from the url and upload it via
     * GraphQL multipart request specification
     */
    public async uploadMedia(saleorProductId: string, media: Media[]) {
        const mediaUpload = new MediaUpload(this.installedSaleorApp, this.db);
        for (const element of media) {
            this.logger.info(
                `Uploading media ${element.id}: ${element.url} to saleor`,
            );
            if (element.type === "PRODUCTIMAGE") {
                try {
                    const mediaBlob = await mediaUpload.fetchMediaBlob(
                        element.url,
                    );
                    const fileExtension = await mediaUpload.getFileExtension(
                        element.url,
                        mediaBlob,
                    );
                    if (!fileExtension) {
                        this.logger.error(
                            `Could not get file extension for media ${element.id}: ${element.url}. Can't upload to Saleor`,
                        );
                        continue;
                    }
                    const imageId = await mediaUpload.uploadImageToSaleor({
                        saleorProductId,
                        mediaBlob,
                        fileExtension: fileExtension.extension,
                        fileType: fileExtension.fileType,
                        mediaId: element.id,
                    });
                    await this.saleorClient.saleorUpdateMetadata({
                        id: imageId,
                        input: [
                            {
                                key: "schemabase-media-id",
                                value: element.id,
                            },
                        ],
                    });
                    this.logger.info(
                        `Successfully uploaded media ${element.id}: ${element.url} to saleor with id ${imageId}`,
                    );
                } catch (error: any) {
                    /**
                     * delete media if NotFound error is thrown
                     */
                    if (error instanceof MediaNotFoundError) {
                        await this.db.media.delete({
                            where: {
                                id: element.id,
                            },
                        });
                    }
                    this.logger.error(
                        `Error handling media ${element.id}: ${element.url} - ${
                            error?.message ?? error
                        }`,
                    );
                }
            }
            if (element.type === "PRODUCTVIDEO") {
                try {
                    const createMedia =
                        await this.saleorClient.productMediaCreate({
                            productId: saleorProductId,
                            URL: element.url,
                        });
                    const newMediaId =
                        createMedia.productMediaCreate?.media?.id;
                    if (!newMediaId) {
                        throw new Error(
                            `Error creating media ${element.id}: ${element.url} in Saleor. No media id returned`,
                        );
                    }
                    await this.saleorClient.saleorUpdateMetadata({
                        id: newMediaId,
                        input: [
                            {
                                key: "schemabase-media-id",
                                value: element.id,
                            },
                        ],
                    });
                    this.logger.info(
                        `Successfully uploaded media ${element.id}: ${element.url} to saleor with id ${newMediaId}`,
                    );
                } catch (error: any) {
                    this.logger.error(
                        `Error handling media ${element.id}: ${element.url} - ${
                            error?.message ?? error
                        }`,
                    );
                }
            }
        }
    }

    /**
     * Unfortunately, we can't set swatch attribute values
     * directly in the product create / update mutation. We need to
     * first check, if the attribute value does already exist in saleor,
     * create it if not and return the slug of the attribute value, so
     * that it can be used as value in the product create / update mutation
     */
    private async handleSwatchAttributeInSaleor(
        saleorAttributeId: string,
        attributeValueName: string,
        attributeValueHex: string,
    ): Promise<string> {
        /**
         * Check if we already have the attribute value in our cache
         */
        if (this.swatchCache[saleorAttributeId + attributeValueName]) {
            return this.swatchCache[saleorAttributeId + attributeValueName];
        }

        const searchResult = await this.saleorClient.attributeValueSearch({
            attributeId: saleorAttributeId,
            searchvalue: attributeValueName,
        });

        const hexMatch = searchResult.attribute?.choices?.edges?.find(
            (x) => x.node.value === attributeValueHex,
        );
        /**
         * When we don't have a search response, or when the value is not
         * the hex value, we expect, we need to create the attribute value
         */
        if (
            !searchResult.attribute?.choices?.edges?.[0]?.node.id ||
            !hexMatch
        ) {
            this.logger.info(
                `Creating swatch attribute value ${attributeValueName} for saleor attribute ${saleorAttributeId}`,
            );
            const resp = await this.saleorClient.attributeHexValueCreate({
                attributeId: saleorAttributeId,
                attributeValueHex,
                attributeValueName,
            });

            if (
                resp.attributeValueCreate?.errors &&
                resp.attributeValueCreate?.errors.length > 0
            ) {
                this.logger.error(
                    `Error creating swatch attribute value ${attributeValueName} for saleor attribute ${saleorAttributeId}: ${JSON.stringify(
                        resp.attributeValueCreate.errors,
                    )}`,
                );
                return "";
            }
            if (!resp.attributeValueCreate?.attributeValue?.slug) {
                this.logger.error(
                    `Error creating swatch attribute value ${attributeValueName} for saleor attribute ${saleorAttributeId}: No slug returned`,
                );
                return "";
            }

            return resp.attributeValueCreate?.attributeValue?.slug;
        }

        if (!hexMatch.node?.slug) {
            this.logger.error(
                `Error getting swatch attribute value ${attributeValueName} for saleor attribute ${saleorAttributeId}: No slug returned`,
            );
            return "";
        }

        this.swatchCache[saleorAttributeId + attributeValueName] =
            hexMatch.node.slug;
        return hexMatch.node.slug;
    }

    /**
     * Generic function to transform our attributes to Saleor attributes.
     * Handles the creation of swatch attributes and the reference attributes
     * @param attributesWithSaleorAttributes
     * @returns
     */
    private async schemabaseAttributesToSaleorAttribute(
        attributesWithSaleorAttributes: ((
            | AttributeValueVariant
            | AttributeValueProduct
        ) & {
            attribute: Attribute & { saleorAttributes: SaleorAttribute[] };
        })[],
    ): Promise<AttributeValueInput[]> {
        let attributes: AttributeValueInput[] = [];
        /**
         * Prepare the attributes to fit the saleor schema
         */
        for (const attr of attributesWithSaleorAttributes) {
            if (!attr.attribute.saleorAttributes[0]?.id) continue;
            const saleorAttributeId = attr.attribute.saleorAttributes[0].id;
            if (attr.attribute.type === "BOOLEAN") {
                const value = parseBoolean(attr.value);
                if (value === undefined) {
                    this.logger.warn(
                        `Can't parse boolean value for boolean attribute ${attr.attribute.name}. Value: ${attr.value}. Skipping`,
                    );
                    continue;
                } else {
                    attributes.push({
                        id: saleorAttributeId,
                        boolean: value,
                    });
                }
            } else if (attr.attribute.type === "PRODUCT_REFERENCE") {
                /// We store our internal product Id in value of product reference attributes.
                /// We need to aks our DB for the saleor product id
                const saleorProductId = await this.db.product.findUnique({
                    where: {
                        id: attr.value,
                    },
                    select: {
                        saleorProducts: {
                            where: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                });
                if (!saleorProductId?.saleorProducts?.[0]?.id) {
                    // `Item has a reference to a product, that has no saleor product id. Skipping`,
                    continue;
                }
                const existingReferences = attributes.find(
                    (x) => x.id === saleorAttributeId,
                )?.references;
                if (existingReferences) {
                    existingReferences.push(
                        saleorProductId.saleorProducts[0].id,
                    );
                } else {
                    attributes.push({
                        id: saleorAttributeId,
                        references: [saleorProductId.saleorProducts[0].id],
                    });
                }
            } else if (attr.attribute.type === "VARIANT_REFERENCE") {
                /// We store our internal variant Id in value of variant reference attributes.
                /// We need to aks our DB for the saleor variant id
                const saleorVariantId = await this.db.productVariant.findUnique(
                    {
                        where: {
                            id: attr.value,
                        },
                        select: {
                            saleorProductVariant: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                );
                if (!saleorVariantId?.saleorProductVariant?.[0]?.id) {
                    this.logger.warn(
                        `Item has no saleor variant id. Skipping`,
                        {
                            productVariantId: attr.value,
                        },
                    );
                    continue;
                }
                const existingReferences = attributes.find(
                    (x) => x.id === saleorAttributeId,
                )?.references;
                if (existingReferences) {
                    existingReferences.push(
                        saleorVariantId.saleorProductVariant[0].id,
                    );
                } else {
                    attributes.push({
                        id: saleorAttributeId,
                        references: [
                            saleorVariantId.saleorProductVariant[0].id,
                        ],
                    });
                }

                // Handle the special case SWATCH where the hex code and the name is given
            } else if (
                attr.attribute.type === "SWATCH" &&
                attr.hexColor &&
                attr.value
            ) {
                const value = await this.handleSwatchAttributeInSaleor(
                    saleorAttributeId,
                    attr.value,
                    attr.hexColor,
                );
                attributes.push({
                    id: saleorAttributeId,
                    swatch: {
                        value,
                    },
                });
            } else if (attr.attribute.type === "RICH_TEXT" && attr.value) {
                /**
                 * handle the transform of HTML text to editorJS text
                 */
                const richText = JSON.stringify(
                    await editorJsHelper.HTMLToEditorJS(attr.value),
                );
                attributes.push({
                    id: saleorAttributeId,
                    richText,
                });
            } else if (attr.attribute.type === "PLAIN_TEXT" && attr.value) {
                attributes.push({
                    id: saleorAttributeId,
                    plainText: attr.value,
                });
            } else if (attr.attribute.type === "MULTISELECT") {
                /**
                 * get all existing choices from Saleor and see, if
                 * we have a match for the current attribute value.
                 * If yes, we use the slug as attribute value
                 */
                const saleorAttribute =
                    await this.saleorClient.attributeValueSearch({
                        attributeId: saleorAttributeId,
                    });
                const existingChoices =
                    saleorAttribute.attribute?.choices?.edges;
                const existingChoice = existingChoices?.find(
                    (x) => x.node.name === attr.value,
                )?.node.slug;

                /**
                 * handle multiselect - push all values to the array
                 */
                const existingValues = attributes.find(
                    (x) => x.id === saleorAttributeId,
                )?.values;
                if (existingValues) {
                    existingValues.push(existingChoice || attr.value);
                } else
                    attributes.push({
                        id: saleorAttributeId,
                        values: [existingChoice || attr.value],
                    });
            } else {
                attributes.push({
                    id: saleorAttributeId,
                    values: [attr.value],
                });
            }
        }
        return attributes;
    }

    /**
     * Find and create all products, that are not yet created in Saleor.
     * Update products, that got changed since the last run
     */
    private async createOrUpdateProductinSaleor(gteDate: Date) {
        this.logger.info(
            `Looking in our DB for products to create or update in Saleor. GTE Date: ${gteDate}`,
        );

        const productInclude = {
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
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                },
            },
            productType: {
                include: {
                    attributes: {
                        include: {
                            attribute: {
                                include: {
                                    saleorAttributes: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
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
                    media: {
                        include: {
                            saleorMedia: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                    salesTax: {
                        include: {
                            saleorTaxClasses: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    },
                    attributes: {
                        include: {
                            attribute: {
                                include: {
                                    saleorAttributes: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
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
            media: true,
        };

        const itemsToCreate = await this.db.product.findMany({
            where: {
                saleorProducts: {
                    none: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },

                productType: {
                    saleorProductTypes: {
                        some: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                },

                category: {
                    saleorCategories: {
                        some: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                },
            },
            include: productInclude,
        });

        this.logger.debug(`Received ${itemsToCreate.length} items to create`);

        const updatedItemsDatabase = await this.db.product.findMany({
            where: {
                updatedAt: {
                    gte: gteDate,
                },
                saleorProducts: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            },
            include: productInclude,
        });

        this.logger.debug(
            `Received ${updatedItemsDatabase.length} items to update`,
        );

        const unsortedProductsToCreateOrUpdate = [
            ...itemsToCreate,
            ...updatedItemsDatabase,
        ];

        const productsToCreate = unsortedProductsToCreateOrUpdate.filter(
            (product) => !product.saleorProducts?.[0]?.id,
        );
        const productsToUpdate = unsortedProductsToCreateOrUpdate.filter(
            (product) => product.saleorProducts?.[0]?.id,
        );

        const sortedProducts = [...productsToCreate, ...productsToUpdate];

        if (sortedProducts.length > 0) {
            this.logger.info(
                `Found ${productsToCreate.length} products to create, ${
                    productsToUpdate.length
                }  to update in Saleor: ${sortedProducts.map((p) => p.name)}`,
                {
                    productsToCreate: productsToCreate.map((p) => p.name),
                    productsToUpdate: productsToUpdate.map((p) => p.name),
                },
            );
            const errors = [];
            for (const product of sortedProducts) {
                try {
                    const productType = product.productType;
                    if (!productType) {
                        this.logger.warn(
                            `Product ${product.name} has no product type. Skipping`,
                        );
                        continue;
                    }
                    if (!productType.saleorProductTypes?.[0]?.id) {
                        this.logger.warn(
                            `Product ${product.name} has no product type in Saleor. Skipping`,
                        );
                        continue;
                    }
                    /**
                     * The description as editorjs json
                     */
                    const description = product.descriptionHTML
                        ? JSON.stringify(
                              await editorJsHelper.HTMLToEditorJS(
                                  product.descriptionHTML,
                              ),
                          )
                        : undefined;

                    const saleorCategoryId =
                        product.category?.saleorCategories?.[0]?.id;
                    if (!saleorCategoryId) {
                        this.logger.warn(
                            `Product ${product.name} has no category. Skipping`,
                            {
                                category: product.category,
                            },
                        );
                        continue;
                    }

                    const attributesWithSaleorAttributes =
                        product.attributes.filter(
                            (a) => a.attribute.saleorAttributes.length > 0,
                        );

                    const attributes: AttributeValueInput[] =
                        await this.schemabaseAttributesToSaleorAttribute(
                            attributesWithSaleorAttributes,
                        );

                    /**
                     * Products can have related product manuals. We try to upload the corresponding
                     * media and add it as product attributes to the product. We just upload media,
                     * that is missing in saleor.
                     */
                    const productManuals = await this.db.media.findMany({
                        where: {
                            products: {
                                some: {
                                    id: product.id,
                                },
                            },
                            tenantId: this.tenantId,
                            type: "MANUAL",
                        },
                        include: {
                            saleorMedia: {
                                where: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
                        },
                    });
                    if (productManuals.length > 0) {
                        /**
                         * Internally, we support multiple product manuals per product. In
                         * Saleor we currently just support one, so we just take the first
                         */
                        let externalMediaUrl =
                            productManuals[0].saleorMedia?.[0]?.url;
                        const saleorProdManual = new SaleorProductManual(
                            this.logger,
                            this.db,
                            this.installedSaleorApp,
                        );
                        /**
                         * Just the product manuals that we still need to upload
                         */
                        const manualsToUpload = productManuals.filter(
                            (manual) => !manual.saleorMedia?.[0]?.url,
                        );
                        for (const manual of manualsToUpload) {
                            const resp =
                                await saleorProdManual.uploadProductManual(
                                    manual,
                                );
                            if (resp) {
                                externalMediaUrl = resp;
                            }
                        }
                        /**
                         * Adding the manual URL to the product attributes
                         */

                        /**
                         * The saleor attribute id for the product manual
                         */
                        const saleorAtttribute = productType.attributes.find(
                            (a) =>
                                a.attribute.normalizedName === "productmanual",
                        )?.attribute?.saleorAttributes[0]?.id;

                        if (!saleorAtttribute) {
                            this.logger.error(
                                'We have a product manual, but no saleor attribute for "product manual". Skipping',
                                {
                                    productManuals: productManuals.map(
                                        (x) => x.id,
                                    ),
                                    productName: product.name,
                                },
                            );
                            continue;
                        }
                        attributes.push({
                            id: saleorAtttribute,
                            file: externalMediaUrl,
                        });
                    }

                    let saleorProductId = product.saleorProducts?.[0]?.id;

                    /**
                     * We store the tax class on variant level,
                     * so we need to get the tax class from the first variant
                     */
                    const taxClass =
                        product.variants[0]?.salesTax?.saleorTaxClasses?.[0]
                            ?.id;

                    /**
                     * Media files from our DB - product videos are not uploaded,
                     * but just set as youtube URLs. We filter out type MANUAL
                     */
                    const schemabaseMedia = product.media.filter(
                        (m) => m.type !== "MANUAL",
                    );

                    /**
                     * go through all variant media, as we first need
                     * all media to be uploaded for that product and can later
                     * assign media items to a specific variant. Only push the
                     * variant image, if it is not already in the schemabaseMedia
                     * array
                     */
                    for (const variant of product.variants) {
                        for (const media of variant.media) {
                            if (
                                media.type === "PRODUCTIMAGE" &&
                                !schemabaseMedia.find((x) => x.id === media.id)
                            ) {
                                schemabaseMedia.push(media);
                            }
                        }
                    }

                    if (!saleorProductId) {
                        this.logger.info(
                            `Creating product ${product.name} in Saleor`,
                            {
                                attributes: JSON.stringify(attributes, null, 2),
                                productType: productType.name,
                            },
                        );

                        const productCreateResponse =
                            await this.saleorClient.productCreate({
                                input: {
                                    attributes,
                                    category: saleorCategoryId,
                                    chargeTaxes: true,
                                    taxClass,
                                    collections: [],
                                    description,
                                    name: product.name,
                                    productType:
                                        productType.saleorProductTypes[0].id,
                                },
                            });
                        if (
                            (productCreateResponse.productCreate?.errors &&
                                productCreateResponse.productCreate?.errors
                                    .length > 0) ||
                            !productCreateResponse.productCreate?.product?.id
                        ) {
                            this.logger.error(
                                `Error creating product ${
                                    product.name
                                } in Saleor: ${JSON.stringify(
                                    productCreateResponse?.productCreate
                                        ?.errors,
                                )}`,
                            );
                            continue;
                        }
                        const createdProduct =
                            productCreateResponse.productCreate.product;
                        saleorProductId = createdProduct.id;
                        this.logger.info(
                            `Successfully created product ${product.name} in Saleor`,
                            {
                                saleorProductId,
                            },
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
                                        id: product.id,
                                    },
                                },
                                updatedAt: product.updatedAt,
                            },
                        });

                        const mediaToUpload = schemabaseMedia;

                        if (mediaToUpload.length > 0) {
                            await this.uploadMedia(
                                saleorProductId,
                                mediaToUpload,
                            );
                        }
                    } else {
                        this.logger.info(
                            `Updating product ${product.name} - ${product.id} in Saleor`,
                        );
                        const productUpdateResponse =
                            await this.saleorClient.productUpdate({
                                id: saleorProductId,
                                input: {
                                    attributes,
                                    category: saleorCategoryId,
                                    chargeTaxes: true,
                                    taxClass,
                                    collections: [],
                                    description,
                                    name: product.name,
                                },
                            });
                        if (
                            (productUpdateResponse.productUpdate?.errors &&
                                productUpdateResponse.productUpdate?.errors
                                    .length > 0) ||
                            !productUpdateResponse.productUpdate?.product?.id
                        ) {
                            this.logger.error(
                                `Error updating product ${
                                    product.name
                                } in Saleor: ${JSON.stringify(
                                    productUpdateResponse?.productUpdate
                                        ?.errors,
                                )}`,
                            );
                            continue;
                        }
                        this.logger.info(
                            `Successfully updated product ${product.name} in Saleor`,
                        );
                        // compare the media we have in our DB with the media currently in saleor.
                        // upload media, that doesn't exist in saleor yet, delete, media that does no longer exist.
                        // only take media, with the metadata "schemabase-media-id" set, as these are the media we uploaded.
                        // delete also media that does exist multiple times in saleor (upload by bugs in schemabase)
                        // We don't want to delete media, that was uploaded manually in saleor. The field "metafield" is either
                        // our internal media id or null
                        const saleorMedia =
                            productUpdateResponse.productUpdate.product.media ||
                            [];

                        const filteredMedia = saleorMedia?.filter(
                            (m) => m.metafield !== null || undefined,
                        );
                        const mediaToDelete = filteredMedia.filter(
                            (m) =>
                                !schemabaseMedia.find(
                                    (sm) => sm.id === m.metafield,
                                )?.id,
                        );
                        const mediaToUpload = schemabaseMedia.filter(
                            (m) =>
                                !filteredMedia.find(
                                    (sm) => sm.metafield === m.id,
                                )?.id,
                        );

                        if (mediaToUpload.length > 0) {
                            await this.uploadMedia(
                                saleorProductId,
                                mediaToUpload,
                            );
                        }

                        if (mediaToDelete.length > 0) {
                            this.logger.info(
                                `Deleting ${mediaToDelete.length} media for product ${product.name} in Saleor`,
                                {
                                    mediaToDelete: mediaToDelete.map(
                                        (x) => x.id,
                                    ),
                                },
                            );
                            for (const element of mediaToDelete) {
                                await this.deleteMedia(element.id);
                            }
                        }
                    }
                    /**
                     * Variants for this product that we need to create
                     */
                    const variantsToCreate = product.variants.filter(
                        (v) => v.saleorProductVariant.length === 0,
                    );
                    /**
                     * Variants of the current product, that we need to update
                     */
                    const variantsToUpdate = product.variants.filter(
                        (v) => v.saleorProductVariant.length > 0,
                    );
                    if (variantsToCreate.length > 0) {
                        await this.createProductVariantsInSaleor(
                            variantsToCreate,
                            product,
                            saleorProductId,
                        );
                    }
                    if (variantsToUpdate.length > 0) {
                        this.logger.info(
                            `Found ${variantsToUpdate.length} variants to update for product ${product.name} in Saleor`,
                        );

                        const variantsToUpdateInput:
                            | ProductVariantBulkUpdateInput
                            | ProductVariantBulkUpdateInput[] = [];
                        for (const v of variantsToUpdate) {
                            const attr =
                                await this.schemabaseAttributesToSaleorAttribute(
                                    v.attributes,
                                );
                            const variantToUpdateInput: ProductVariantBulkUpdateInput =
                                {
                                    attributes: attr,
                                    sku: v.sku,
                                    name: v.variantName,
                                    trackInventory: true,
                                    id: v.saleorProductVariant[0].id,
                                    weight: v.weight,
                                };
                            variantsToUpdateInput.push(variantToUpdateInput);
                        }
                        this.logger.debug(
                            `Updating variants for product ${saleorProductId}`,
                            {
                                variants: variantsToUpdateInput.map(
                                    (x) => x.sku,
                                ),
                            },
                        );
                        const productVariantBulkUpdateResponse =
                            await this.saleorClient.productVariantBulkUpdate({
                                variants: variantsToUpdateInput,
                                productId: saleorProductId,
                            });
                        if (
                            productVariantBulkUpdateResponse
                                .productVariantBulkUpdate?.errors &&
                            productVariantBulkUpdateResponse
                                .productVariantBulkUpdate?.errors.length > 0
                        ) {
                            this.logger.error(
                                `Error creating variants for product ${
                                    product.name
                                } in Saleor: ${JSON.stringify(
                                    productVariantBulkUpdateResponse
                                        .productVariantBulkUpdate.errors,
                                )}`,
                            );
                            continue;
                        }
                        this.logger.info(
                            `Successfully updated ${productVariantBulkUpdateResponse.productVariantBulkUpdate?.results.length} variants for product ${product.name} in Saleor`,
                        );

                        /**
                         * If we have variant specific media, we need to set that in Saleor
                         */
                        for (const variantImage of variantsToUpdate) {
                            if (variantImage.media.length > 0) {
                                this.logger.debug(
                                    `Assigning media to variant ${variantImage.variantName} in Saleor`,
                                    {
                                        media: variantImage.media.map(
                                            (x) => x.id,
                                        ),
                                    },
                                );
                                for (const mediaElement of variantImage.media) {
                                    if (!mediaElement.saleorMedia?.[0]?.id) {
                                        this.logger.warn(
                                            `Media ${mediaElement.id} has no saleor media id. Skipping`,
                                        );
                                        continue;
                                    }
                                    const r =
                                        await this.saleorClient.VariantMediaAssign(
                                            {
                                                mediaId:
                                                    mediaElement
                                                        .saleorMedia?.[0].id,
                                                variantId:
                                                    variantImage
                                                        .saleorProductVariant[0]
                                                        .id,
                                            },
                                        );
                                    if (r.variantMediaAssign?.errors.length) {
                                        this.logger.error(
                                            `Error assigning media to variant ${
                                                variantImage.variantName
                                            } in Saleor: ${JSON.stringify(
                                                r.variantMediaAssign.errors,
                                            )}`,
                                        );
                                        if (
                                            r.variantMediaAssign.errors.find(
                                                (x) =>
                                                    x.message?.includes(
                                                        "Couldn't resolve to a node",
                                                    ),
                                            )
                                        ) {
                                            /**
                                             * fixing a bug - deleting media that doesn't exist in saleor
                                             */
                                            if (mediaElement.saleorMedia[0].url)
                                                await this.db.saleorMedia.delete(
                                                    {
                                                        where: {
                                                            url_installedSaleorAppId:
                                                                {
                                                                    url: mediaElement
                                                                        .saleorMedia[0]
                                                                        .url,
                                                                    installedSaleorAppId:
                                                                        this
                                                                            .installedSaleorAppId,
                                                                },
                                                        },
                                                    },
                                                );
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    errors.push(error);
                    this.logger.error(error as any);
                }
            }
            if (errors.length > 0) {
                /**
                 * we make sure, that this run is marked as failed
                 */
                throw new Error(
                    `${errors.length} errors occurred during product creation or update. See log for error details`,
                );
            }
        } else {
            this.logger.info(`No products to create or update in Saleor`);
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

        const uniqueProductTypes = products
            .map((p) => p.productType)
            .filter((p) => p !== null)
            .filter((p, i, arr) => arr.findIndex((x) => x?.id === p?.id) === i);
        /**
         * Sync the product type
         * TODO: always pull all product types, as there are not that many.
         * Not just pull them via the product sync
         */
        for (const productType of uniqueProductTypes) {
            await this.syncProductType(productType);
        }

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

            /**
             * Existing Saleor product from our DB
             */
            const existingProduct = await this.db.saleorProduct.findUnique({
                where: {
                    id_installedSaleorAppId: {
                        id: product.id,
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
            });

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
                     * Existing schemabase product variant
                     */
                    const existingVariant =
                        await this.db.productVariant.findUnique({
                            where: {
                                sku_tenantId: {
                                    sku: variant.sku,
                                    tenantId: this.tenantId,
                                },
                            },
                            include: {
                                saleorProductVariant: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorAppId,
                                    },
                                },
                            },
                        });

                    const existingProductId =
                        existingProduct?.productId ||
                        existingVariant?.productId;

                    /**
                     * We currently don't have a unique identifier that we can use to
                     * identify the product in our DB, so we can only work with products,
                     * that we created with schemabase in Saleor
                     */
                    if (!existingProductId) {
                        this.logger.info(
                            `Product ${product.name} does not exist in our DB. We don't create new products in our DB. Continue.`,
                        );
                        continue;
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

                    this.logger.info(
                        `Syncing product variant ${variant.id} - ${variant.sku} - ${product.name}`,
                        defaultLogFields,
                    );

                    await this.db.saleorProductVariant.upsert({
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
                                        defaultWarehouse:
                                            normalizedDefaultWarehouseName
                                                ? {
                                                      connect: {
                                                          normalizedName_tenantId:
                                                              {
                                                                  normalizedName:
                                                                      normalizedDefaultWarehouseName,
                                                                  tenantId:
                                                                      this
                                                                          .tenantId,
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
                                            connect: {
                                                id: existingProductId,
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
                                        defaultWarehouse:
                                            normalizedDefaultWarehouseName
                                                ? {
                                                      connect: {
                                                          normalizedName_tenantId:
                                                              {
                                                                  normalizedName:
                                                                      normalizedDefaultWarehouseName,
                                                                  tenantId:
                                                                      this
                                                                          .tenantId,
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
                                            connect: {
                                                id: existingProductId,
                                            },
                                        },
                                    },
                                },
                                update: {
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
                                    defaultWarehouse:
                                        normalizedDefaultWarehouseName
                                            ? {
                                                  connect: {
                                                      normalizedName_tenantId: {
                                                          normalizedName:
                                                              normalizedDefaultWarehouseName,
                                                          tenantId:
                                                              this.tenantId,
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
                    /**
                     * the saleor product gets upserted as well, but just
                     * at the first variant
                     */
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
                                    id: existingProductId,
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
                        if (
                            err instanceof Prisma.PrismaClientKnownRequestError
                        ) {
                            if (
                                err.code === "P2025" &&
                                (err?.meta?.cause as string).includes(
                                    "No 'Warehouse' record",
                                )
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
         * or updated since last run
         */
        await this.createOrUpdateProductTypeinSaleor(createdGte);

        /**
         * Get all products, that are not yet create in Saleor. Select only
         * the ones, where we have a product type already in Saleor
         */
        await this.createOrUpdateProductinSaleor(createdGte);

        /**
         * get all saleor productVariants where related stockEntries have been updated since last run or where related
         * productVariants have been updated since last run
         */
        const saleorProductVariants =
            await this.db.saleorProductVariant.findMany({
                where: {
                    installedSaleorAppId: this.installedSaleorAppId,
                    OR: [
                        {
                            productVariant: {
                                stockEntries: {
                                    some: {
                                        updatedAt: {
                                            gte: createdGte,
                                        },
                                    },
                                },
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

        const saleorProductVariantsFromSaleor =
            (await this.getSaleorProductVariants(
                saleorProductVariants.map((x) => x.id),
            )) || [];
        for (const variant of saleorProductVariants) {
            const saleorProductVariant = saleorProductVariantsFromSaleor.find(
                (x) => x.id === variant.id,
            );

            if (!saleorProductVariant) {
                continue;
            }

            // loop over all stock entries that we have and bring them to saleor
            for (const stockEntry of variant.productVariant.stockEntries) {
                // Check, if we have a saleor warehouse for this stock entry.
                // If not continue.
                const saleorWarehouse = warehouses.find(
                    (sw) => sw.warehouseId === stockEntry.warehouseId,
                );
                const saleorWarehouseId = saleorWarehouse?.id;
                /**
                 * Just update the stock for warehouses, that we have configured in Saleor
                 */
                if (!saleorWarehouseId) {
                    this.logger.warn(
                        `No saleor warehouse found for warehouse ${stockEntry.warehouseId}. Skipping`,
                    );
                    continue;
                }
                /**
                 * The stock information of the current product variant in the current warehouse
                 */
                const saleorStockEntry = saleorProductVariant.stocks.find(
                    (x) => x?.warehouse.id === saleorWarehouseId,
                );
                const currentlyAllocated =
                    saleorStockEntry?.quantityAllocated || 0;

                /**
                 * to get the "real" available stock, we have to add the currently allocated stock from saleor
                 */
                const totalQuantity =
                    stockEntry.actualAvailableForSaleStock + currentlyAllocated;

                // only update the stock entry in saleor, if the stock has changed
                if (saleorStockEntry?.quantity === totalQuantity) {
                    this.logger.debug(
                        `Stock for ${variant.productVariant.sku} - id ${variant.id} has not changed. Skipping`,
                    );
                    continue;
                }
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

            const averageRating = saleorProductVariant.metadata.find(
                (x) => x.key === "customerRatings_averageRating",
            )?.value;
            productRatingFromSaleor.averageRating = parseFloat(
                averageRating || "0",
            );

            const ratingCount = saleorProductVariant.metadata.find(
                (x) => x.key === "customerRatings_ratingCount",
            )?.value;
            productRatingFromSaleor.ratingCount = parseInt(ratingCount || "0");

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
                for (
                    let i = 1;
                    i <= variant.productVariant.averageRating;
                    i++
                ) {
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
                    id: saleorProductVariant.id,
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
        this.logger.debug(
            `Sending this metadata: ${JSON.stringify(metadataNew)}`,
        );
        await this.saleorClient.saleorUpdateMetadata({
            id: productSet.saleorProductId,
            input: metadataNew,
        });
    }
}
