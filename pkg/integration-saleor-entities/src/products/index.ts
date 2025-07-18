/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import {
    AttributeValueInput,
    ProductInput,
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
// import { MediaUpload } from "../mediaUpload.js";
import { parseBoolean } from "@eci/pkg/utils/parseBoolean";
import { SaleorProductManual } from "./productManual";
import { sortVideoOrder } from "./helper";
import { VariantAndVariantStocks } from "./variantsAndVariantStocks";
import { sha256 } from "@eci/pkg/hash";

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

    /**
     * Count all Saleor requests that we do
     * to get a total number of requests at the end
     */
    private saleorRequestCounter = 0;

    public constructor(config: SaleorProductSyncServiceConfig) {
        this.config = config;
        this.saleorClient = config.saleorClient;
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
     * A Saleor client instance, that includes the request counter,
     * but is other than that just forwarding the requests to the
     * original Saleor client. E.g.: this.saleorClientWithCounter.productTypeList({})
     */
    private get saleorClientWithCounter() {
        this.saleorRequestCounter++;
        return this.saleorClient;
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
            return this.db.saleorProductType.create({
                data: {
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
            return this.db.productType.update({
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

        return existingEntry;
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
                await this.saleorClientWithCounter.productAttributeVariantSelection(
                    {
                        attributeId: selectionAttribute,
                        productTypeId: saleorProdTypeId,
                    },
                );
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
                            a.attribute?.type.toString().toLowerCase(),
                        ),
                    )
                    .map((a) => a.attribute.saleorAttributes[0].id);

                this.logger.info(
                    `Creating / updating product type ${prodType.name} in Saleor now.`,
                );
                if (!existingProdTypeId) {
                    const productTypeCreateResponse =
                        await this.saleorClientWithCounter.productTypeCreate({
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
                    // Fetch the current product type from Saleor to get all attributes
                    this.logger.info(
                        `Fetching current product type ${existingProdTypeId} from Saleor`,
                    );

                    try {
                        // Use the productType query from the newly created GraphQL file
                        const currentProductTypeResponse =
                            await this.saleorClient.productType({
                                id: existingProdTypeId,
                            });

                        if (!currentProductTypeResponse?.productType) {
                            this.logger.error(
                                `Error fetching product type ${existingProdTypeId} from Saleor`,
                            );
                            return;
                        }

                        const currentProductType =
                            currentProductTypeResponse.productType;

                        // Get current attribute IDs from Saleor
                        const currentProductAttributeIds =
                            currentProductType.productAttributes?.map(
                                (attr: { id: string }) => attr.id,
                            ) || [];

                        const currentVariantAttributeIds =
                            currentProductType.variantAttributes?.map(
                                (attr: { id: string }) => attr.id,
                            ) || [];

                        // Merge attributes - keep all existing attributes from Saleor and add our new ones
                        const mergedProductAttributes = [
                            ...new Set([
                                ...currentProductAttributeIds,
                                ...productAttributes,
                            ]),
                        ];

                        const mergedVariantAttributes = [
                            ...new Set([
                                ...currentVariantAttributeIds,
                                ...variantAttributes,
                            ]),
                        ];

                        this.logger.info(
                            `Updating product type ${prodType.name} in Saleor with merged attributes`,
                            {
                                originalProductAttributes:
                                    productAttributes.length,
                                originalVariantAttributes:
                                    variantAttributes.length,
                                currentProductAttributes:
                                    currentProductAttributeIds.length,
                                currentVariantAttributes:
                                    currentVariantAttributeIds.length,
                                mergedProductAttributes:
                                    mergedProductAttributes.length,
                                mergedVariantAttributes:
                                    mergedVariantAttributes.length,
                            },
                        );

                        const productTypeUpdateResponse =
                            await this.saleorClient.productTypeUpdate({
                                id: existingProdTypeId,
                                input: {
                                    name: prodType.name,
                                    hasVariants: prodType.isVariant,
                                    productAttributes: mergedProductAttributes,
                                    variantAttributes: mergedVariantAttributes,
                                },
                            });

                        if (
                            productTypeUpdateResponse?.productTypeUpdate
                                ?.errors &&
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
                    } catch (error) {
                        this.logger.error(
                            `Error during product type update for ${prodType.name}: ${error}`,
                            { error },
                        );
                    }
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
            {
                skus: variantsToCreate.map((v) => v.sku),
            },
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
     * takes Media entries from our DB and a saleor productId. Uploads that media using mutation ProductMediaCreate.
     * Adds a metadata to the media to identify it as a media from our app. Does not check, if that media does already exist.
     * This has to be done before calling this function. We download the media from the url and upload it via
     * GraphQL multipart request specification
     */
    public async uploadMedia(saleorProductId: string, media: Media[]) {
        // const mediaUpload = new MediaUpload(this.installedSaleorApp, this.db);
        for (const element of media) {
            if (element.deleted) continue;
            this.logger.info(
                `Uploading media ${element.id}: ${element.url} to saleor`,
                {
                    type: element?.type,
                },
            );
            // we no longer upload media.
            // if (element.type === "PRODUCTIMAGE") {
            //     try {
            //         const mediaBlob = await mediaUpload.fetchMediaBlob(
            //             element.url,
            //         );
            //         const fileExtension = await mediaUpload.getFileExtension(
            //             element.url,
            //             mediaBlob,
            //         );
            //         if (!fileExtension) {
            //             this.logger.error(
            //                 `Could not get file extension for media ${element.id}: ${element.url}. Can't upload to Saleor`,
            //             );
            //             continue;
            //         }
            //         const imageId = await mediaUpload.uploadImageToSaleor({
            //             saleorProductId,
            //             mediaBlob,
            //             fileExtension: fileExtension.extension,
            //             fileType: fileExtension.fileType,
            //             mediaId: element.id,
            //         });
            //         await this.saleorClient.saleorUpdateMetadata({
            //             id: imageId,
            //             input: [
            //                 {
            //                     key: "schemabase-media-id",
            //                     value: element.id,
            //                 },
            //             ],
            //         });
            //         this.logger.info(
            //             `Successfully uploaded media ${element.id}: ${element.url} to saleor with id ${imageId}`,
            //         );
            //     } catch (error: any) {
            //         /**
            //          * delete media if NotFound error is thrown
            //          */
            //         if (error instanceof MediaNotFoundError) {
            //             this.logger.info(
            //                 `Media ${element.id} not found. Deleting in internal DB`,
            //             );
            //             await this.db.media.delete({
            //                 where: {
            //                     id: element.id,
            //                 },
            //             });
            //         }
            //         this.logger.error(
            //             `Error handling media ${element.id}: ${element.url} - ${
            //                 error?.message ?? error
            //             }`,
            //         );
            //     }
            // } else if (element.type === "PRODUCTVIDEO") {
            //     try {
            //         const createMedia =
            //             await this.saleorClient.productMediaCreate({
            //                 productId: saleorProductId,
            //                 URL: element.url,
            //             });
            //         const newMediaId =
            //             createMedia.productMediaCreate?.media?.id;
            //         if (createMedia.productMediaCreate?.errors.length) {
            //             if (
            //                 createMedia.productMediaCreate.errors[0].code ===
            //                 "UNSUPPORTED_MEDIA_PROVIDER"
            //             ) {
            //                 this.logger.error(
            //                     `Error creating media ${element.id}: ${element.url} in Saleor. Unsupported media provider. Deleting media element in our DB`,
            //                     {
            //                         error: createMedia.productMediaCreate
            //                             .errors[0].message,
            //                         url: element.url,
            //                     },
            //                 );
            //                 await this.db.media.delete({
            //                     where: {
            //                         id: element.id,
            //                     },
            //                 });
            //             }
            //         }
            //         if (!newMediaId) {
            //             throw new Error(
            //                 `Error creating media ${element.id}: ${element.url} in Saleor. No media id returned`,
            //             );
            //         }
            //         await this.saleorClient.saleorUpdateMetadata({
            //             id: newMediaId,
            //             input: [
            //                 {
            //                     key: "schemabase-media-id",
            //                     value: element.id,
            //                 },
            //             ],
            //         });
            //         this.logger.info(
            //             `Successfully uploaded media ${element.id}: ${element.url} to saleor with id ${newMediaId}`,
            //         );
            //     } catch (error: any) {
            //         this.logger.error(
            //             `Error handling media ${element.id}: ${element.url} - ${
            //                 error?.message ?? error
            //             }`,
            //         );
            //     }
            // } else {
            //     this.logger.error(
            //         `Media type ${element.type} not supported or media type not defined. Skipping`,
            //     );
            // }
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
        if (
            this.swatchCache[
                saleorAttributeId + attributeValueName + attributeValueHex
            ]
        ) {
            return this.swatchCache[
                saleorAttributeId + attributeValueName + attributeValueHex
            ];
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

        this.swatchCache[
            saleorAttributeId + attributeValueName + attributeValueHex
        ] = hexMatch.node.slug;
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
                            saleorProductVariant: {
                                some: {
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            },
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
            media: {
                where: {
                    deleted: false,
                },
                include: {
                    saleorMedia: {
                        where: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                },
            },
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

        this.logger.debug(`Received ${itemsToCreate.length} items to create`, {
            itemsToCreate: itemsToCreate.map((x) => x.name),
        });

        /**
         * It can happen, that we have products, where the variants are not yet created in Saleor.
         */
        const itemsWithMissingVariants = await this.db.product.findMany({
            where: {
                id: {
                    notIn: itemsToCreate.map((x) => x.id),
                },
                saleorProducts: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                variants: {
                    // ensure that the product has at least one variant
                    some: {},
                    none: {
                        saleorProductVariant: {
                            some: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
                productType: {
                    saleorProductTypes: {
                        some: {
                            installedSaleorAppId: this.installedSaleorAppId,
                        },
                    },
                },
            },
            include: productInclude,
        });

        this.logger.debug(
            `Received ${itemsWithMissingVariants.length} items with missing variants`,
            {
                itemsWithMissingVariants: itemsWithMissingVariants.map(
                    (x) => `${x.name} - ${x.id}`,
                ),
            },
        );

        /**
         * It can happen, that we have products, where the media is not yet created in Saleor.
         */
        const itemsWithMissingMedia = await this.db.product.findMany({
            where: {
                id: {
                    notIn: itemsToCreate.map((x) => x.id),
                },
                tenantId: this.tenantId,
                saleorProducts: {
                    some: {
                        installedSaleorAppId: this.installedSaleorAppId,
                    },
                },
                media: {
                    some: {
                        type: {
                            not: null,
                        },
                        deleted: false,
                        saleorMedia: {
                            none: {
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                    },
                },
            },
            include: productInclude,
        });

        this.logger.debug(
            `Received ${itemsWithMissingMedia.length} items with missing media`,
            {
                itemsWithMissingMedia: itemsWithMissingMedia.map((x) => x.name),
            },
        );

        const updatedItemsDatabase = await this.db.product.findMany({
            where: {
                id: {
                    notIn: [
                        ...itemsToCreate.map((x) => x.id),
                        ...itemsWithMissingVariants.map((x) => x.id),
                        ...itemsWithMissingMedia.map((x) => x.id),
                    ],
                },
                updatedAt: {
                    gte: gteDate,
                },
                saleorProducts: {
                    some: {
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
            },
            include: productInclude,
        });

        this.logger.debug(
            `Received ${updatedItemsDatabase.length} items to update`,
        );

        /**
         * get all products with variants that need to be updated
         */
        const updatedVariants = await this.db.product.findMany({
            where: {
                id: {
                    notIn: [
                        ...itemsToCreate.map((x) => x.id),
                        ...itemsWithMissingVariants.map((x) => x.id),
                        ...itemsWithMissingMedia.map((x) => x.id),
                        ...updatedItemsDatabase.map((x) => x.id),
                    ],
                },
                variants: {
                    some: {
                        updatedAt: {
                            gte: gteDate,
                        },
                    },
                },
            },
            include: productInclude,
        });

        this.logger.debug(
            `Received ${updatedVariants.length} items with variants to update`,
        );

        const unsortedProductsToCreateOrUpdate = [
            ...itemsToCreate,
            ...itemsWithMissingVariants,
            ...updatedItemsDatabase,
            ...itemsWithMissingMedia,
            ...updatedVariants,
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
                `Found ${productsToCreate.length} products to create, ${productsToUpdate.length}  to update in Saleor`,
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

                    let saleorProductId: string | undefined =
                        product.saleorProducts?.[0]?.id;

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
                    const schemabaseMedia = product.media
                        .filter((m) => m.type !== "MANUAL")
                        .filter((m) => m.deleted === false);

                    /**
                     * go through all variant media, as we first need
                     * all media to be uploaded for that product and can later
                     * assign media items to a specific variant. Only push the
                     * variant image, if it is not already in the schemabaseMedia
                     * array. In our database, we have product and variant images separated
                     * but in Saleor they get uploaded on the product level and later just assigned
                     * on variant level.
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

                    /**
                     * If we have an existing Saleor product id,
                     * we pull the item from Saleor to compare it with our
                     * existing data. We also pull all variants, to see, if we might
                     * have wrong connected variants in Saleor (as they changed in our DB)
                     * and which images are related to which variant
                     */
                    const saleorProductToCompare = saleorProductId
                        ? await this.saleorClient.productAndVariantsToCompare({
                              id: saleorProductId,
                          })
                        : undefined;

                    // check if the product type matches. It can happen, that the product type of this product changed
                    // and is no longer the product type that we used to create the product in Saleor. In that case, we need to delete the product and create it again.
                    if (
                        saleorProductToCompare?.product?.productType.id &&
                        saleorProductToCompare?.product?.productType.id !==
                            product.productType?.saleorProductTypes[0].id
                    ) {
                        this.logger.info(
                            `Product type of product ${product.name} changed in our DB. Deleting product and creating it again`,
                            {
                                productName: product.name,
                                productType: product.productType?.name,
                                saleorProductType:
                                    saleorProductToCompare?.product?.productType
                                        ?.name,
                            },
                        );
                        await this.saleorClient.deleteProducts({
                            ids: [saleorProductId],
                        });
                        // deleting the saleor product and variant ids in our DB as well
                        await this.fullDeleteSaleorProduct(saleorProductId);

                        saleorProductId = undefined;
                    }

                    /**
                     * Create the product if it does not exist in Saleor
                     */
                    if (!saleorProductId) {
                        this.logger.info(
                            `Creating product ${product.name} in Saleor`,
                            {
                                attributes: JSON.stringify(attributes, null, 2),
                                productType: productType.name,
                                schemabaseId: product.id,
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
                            { saleorProductId },
                        );

                        const productUpdateInput: ProductInput = {
                            attributes,
                            category: saleorCategoryId,
                            chargeTaxes: true,
                            taxClass,
                            collections: [],
                            description,
                            name: product.name,
                            seo: {
                                title: null,
                                description: null,
                            },
                        };

                        const dataHash = sha256(
                            JSON.stringify(productUpdateInput),
                        );

                        const productUpdateNeeded =
                            dataHash !== product.saleorProducts?.[0]?.dataHash;

                        if (productUpdateNeeded) {
                            let saleorProductMedia =
                                saleorProductToCompare?.product?.media || [];

                            const productUpdateResponse =
                                await this.saleorClient.productUpdate({
                                    id: saleorProductId,
                                    input: productUpdateInput,
                                });
                            if (
                                (productUpdateResponse.productUpdate?.errors &&
                                    productUpdateResponse.productUpdate?.errors
                                        .length > 0) ||
                                !productUpdateResponse.productUpdate?.product
                                    ?.id
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

                            // write the data hash to the DB
                            await this.db.saleorProduct.update({
                                where: {
                                    id_installedSaleorAppId: {
                                        id: saleorProductId,
                                        installedSaleorAppId:
                                            this.installedSaleorAppId,
                                    },
                                },
                                data: {
                                    dataHash,
                                },
                            });
                            saleorProductMedia =
                                productUpdateResponse.productUpdate.product
                                    .media || [];

                            // compare the media we have in our DB with the media currently in saleor.
                            // upload media, that doesn't exist in saleor yet, delete, media that does no longer exist.
                            // only take media, with the metadata "schemabase-media-id" set, as these are the media we uploaded.
                            // delete also media that does exist multiple times in saleor (upload by bugs in schemabase)
                            // We don't want to delete media, that was uploaded manually in saleor. The field "metafield" is either
                            // our internal media id or null
                            await sortVideoOrder(
                                this.saleorClient,
                                this.logger,
                                saleorProductId,
                                saleorProductMedia,
                            );

                            /**
                             * Media that we once uploaded from schemabase, as we did write an
                             * id to the metadata
                             */
                            const filteredMedia = saleorProductMedia?.filter(
                                (m) => m.metafield !== null || undefined,
                            );

                            /**
                             * Media that we once uploaded from schemabase but that is no longer
                             * in our DB or that is marked as deleted
                             */
                            // const mediaToDelete = filteredMedia.filter(
                            //     (m) =>
                            //         !schemabaseMedia.find(
                            //             (sm) => sm.id === m.metafield,
                            //         )?.id,
                            // );

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

                            // if (mediaToDelete.length > 0) {
                            //     this.logger.info(
                            //         `Deleting ${mediaToDelete.length} media for product ${product.name} in Saleor`,
                            //         {
                            //             mediaToDelete: mediaToDelete.map(
                            //                 (x) => x.id,
                            //             ),
                            //         },
                            //     );
                            //     for (const element of mediaToDelete) {
                            //         await this.deleteMedia(element.id);
                            //     }
                            // }
                        }
                    }
                    /**
                     * check, if we have variants in saleor, that we don't have in our
                     * DB and delete them in Saleor. It can happen, that variants get assign to
                     * new products
                     */
                    const variantIds = product.variants.map(
                        (v) => v.saleorProductVariant[0]?.id,
                    );
                    const variantsInSaleor =
                        saleorProductToCompare?.product?.variants;
                    if (variantsInSaleor) {
                        const variantIdsInSaleor = variantsInSaleor.map(
                            (v) => v.id,
                        );
                        const variantIdsToDelete = variantIdsInSaleor.filter(
                            (v) => !variantIds.includes(v),
                        );
                        if (variantIdsToDelete.length > 0) {
                            this.logger.info(
                                `Deleting ${variantIdsToDelete.length} variants in Saleor, that do not exist in our DB any more`,
                                {
                                    variantIdsToDelete,
                                },
                            );
                            await this.saleorClient.productVariantBulkDelete({
                                ids: variantIdsToDelete,
                            });
                            await this.db.saleorProductVariant.deleteMany({
                                where: {
                                    id: {
                                        in: variantIdsToDelete,
                                    },
                                    installedSaleorAppId:
                                        this.installedSaleorAppId,
                                },
                            });
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
                        const variantsToUpdateInput: ProductVariantBulkUpdateInput[] =
                            [];
                        const variantDataHashes: {
                            id: string;
                            dataHash: string;
                        }[] = [];

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

                            const dataHash = sha256(
                                JSON.stringify(variantToUpdateInput),
                            );

                            if (
                                dataHash !== v.saleorProductVariant[0].dataHash
                            ) {
                                variantsToUpdateInput.push(
                                    variantToUpdateInput,
                                );
                                variantDataHashes.push({
                                    id: v.saleorProductVariant[0].id,
                                    dataHash,
                                });
                            }
                        }

                        /**
                         * bulk update variants if any of them has a different data hash
                         */
                        if (variantDataHashes.length > 0) {
                            this.logger.debug(
                                `Updating variants for product ${saleorProductId}`,
                                {
                                    variants: variantsToUpdateInput.map(
                                        (x) => x.sku,
                                    ),
                                },
                            );

                            const productVariantBulkUpdateResponse =
                                await this.saleorClient.productVariantBulkUpdate(
                                    {
                                        variants: variantsToUpdateInput,
                                        productId: saleorProductId,
                                    },
                                );
                            if (
                                (productVariantBulkUpdateResponse
                                    .productVariantBulkUpdate?.errors &&
                                    productVariantBulkUpdateResponse
                                        .productVariantBulkUpdate?.errors
                                        .length > 0) ||
                                productVariantBulkUpdateResponse.productVariantBulkUpdate?.results.some(
                                    (r) => (r.errors?.length ?? 0) > 0,
                                )
                            ) {
                                this.logger.error(
                                    `Error updating variants for product ${
                                        product.name
                                    } in Saleor: ${JSON.stringify(
                                        productVariantBulkUpdateResponse
                                            .productVariantBulkUpdate.errors,
                                    )} ${productVariantBulkUpdateResponse.productVariantBulkUpdate?.results
                                        .map((r) => JSON.stringify(r.errors))
                                        .join(", ")}`,
                                );

                                // if we have an error like [{"field":"id","message":"Variant #UHJvZHVjdFZhcmlhbnQ6MjY2Nw== does not exist."}] we delete
                                // the variant id from our db. We take the variant Id from the error message.
                                const errorMsgs =
                                    productVariantBulkUpdateResponse
                                        .productVariantBulkUpdate?.errors || [];
                                // Also collect errors from individual results
                                productVariantBulkUpdateResponse.productVariantBulkUpdate?.results.forEach(
                                    (r) => {
                                        if (r.errors && r.errors.length > 0) {
                                            errorMsgs.push(
                                                ...(r.errors as any),
                                            );
                                        }
                                    },
                                );
                                // Extract variant IDs from error messages indicating missing variant
                                const missingVariantIds: string[] = [];
                                for (const e of errorMsgs) {
                                    if (
                                        e.field === "id" &&
                                        typeof e.message === "string" &&
                                        /Variant #([A-Za-z0-9=:+/-]+) does not exist\./.test(
                                            e.message,
                                        )
                                    ) {
                                        const match = e.message.match(
                                            /Variant #([A-Za-z0-9=:+/-]+) does not exist\./,
                                        );
                                        if (match && match[1]) {
                                            missingVariantIds.push(match[1]);
                                        }
                                    }
                                }
                                if (missingVariantIds.length > 0) {
                                    this.logger.warn(
                                        `Cleaning up ${missingVariantIds.length} missing variants from DB for product ${product.name}`,
                                        { missingVariantIds },
                                    );
                                    await this.db.saleorProductVariant.deleteMany(
                                        {
                                            where: {
                                                id: {
                                                    in: missingVariantIds,
                                                },
                                                installedSaleorAppId:
                                                    this.installedSaleorAppId,
                                            },
                                        },
                                    );
                                }

                                // we try and handle this error. A known issue is
                                continue;
                            }
                            this.logger.info(
                                `Successfully updated ${productVariantBulkUpdateResponse.productVariantBulkUpdate?.results.length} variants for product ${product.name} in Saleor`,
                            );

                            /**
                             * writing the data hash to the DB
                             */
                            for (const variant of variantDataHashes) {
                                await this.db.saleorProductVariant.update({
                                    where: {
                                        id_installedSaleorAppId: {
                                            id: variant.id,
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
                                        },
                                    },
                                    data: {
                                        dataHash: variant.dataHash,
                                    },
                                });
                            }
                        }
                    }

                    /**
                     * If we have variant specific media, we need to set that in Saleor.
                     * We disabled that again, as it does break things
                     */
                    // for (const variantImage of variantsToUpdate) {
                    //     if (variantImage.media.length > 0) {
                    //         for (const mediaElement of variantImage.media) {
                    //             if (!mediaElement.saleorMedia?.[0]?.id) {
                    //                 this.logger.warn(
                    //                     `Media ${mediaElement.id} has no saleor media id. Skipping`,
                    //                 );
                    //                 continue;
                    //             }
                    //             /**
                    //              * We are checking the existing saleor product variant media.
                    //              * If this media item is already assigned to the variant, we skip it.
                    //              */
                    //             const existingVariantMedia =
                    //                 saleorProductToCompare?.product?.variants?.find(
                    //                     (v) =>
                    //                         v.id ===
                    //                         variantImage
                    //                             .saleorProductVariant[0].id,
                    //                 )?.media;

                    //             if (
                    //                 existingVariantMedia?.find(
                    //                     (x) =>
                    //                         x.id ===
                    //                         mediaElement.saleorMedia[0].id,
                    //                 )
                    //             ) {
                    //                 // Media is already assigned to variant. No API request needed
                    //                 continue;
                    //             }

                    //             const r =
                    //                 await this.saleorClient.VariantMediaAssign(
                    //                     {
                    //                         mediaId:
                    //                             mediaElement
                    //                                 .saleorMedia?.[0].id,
                    //                         variantId:
                    //                             variantImage
                    //                                 .saleorProductVariant[0]
                    //                                 .id,
                    //                     },
                    //                 );
                    //             if (r.variantMediaAssign?.errors.length) {
                    //                 if (
                    //                     r.variantMediaAssign.errors.find(
                    //                         (x) =>
                    //                             x.message?.includes(
                    //                                 "This media is already assigned",
                    //                             ),
                    //                     )
                    //                 ) {
                    //                     this.logger.info(
                    //                         `Media ${mediaElement.id} is already assigned to variant ${variantImage.variantName}`,
                    //                     );
                    //                 } else {
                    //                     this.logger.error(
                    //                         `Error assigning media to variant ${
                    //                             variantImage.variantName
                    //                         } in Saleor: ${JSON.stringify(
                    //                             r.variantMediaAssign.errors,
                    //                         )}, tried to assign media with Saleor id ${
                    //                             mediaElement
                    //                                 .saleorMedia?.[0].id
                    //                         } to variant with Saleor id ${
                    //                             variantImage
                    //                                 .saleorProductVariant[0]
                    //                                 .id
                    //                         }`,
                    //                     );
                    //                 }
                    //                 if (
                    //                     r.variantMediaAssign.errors.find(
                    //                         (x) =>
                    //                             x.message?.includes(
                    //                                 "Couldn't resolve to a node",
                    //                             ) ||
                    //                             x.code ===
                    //                                 "NOT_PRODUCTS_IMAGE",
                    //                     )
                    //                 ) {
                    //                     /**
                    //                      * fixing a bug - deleting media that doesn't exist in saleor
                    //                      */
                    //                     if (mediaElement.saleorMedia[0].url)
                    //                         await this.db.saleorMedia.delete(
                    //                             {
                    //                                 where: {
                    //                                     url_installedSaleorAppId:
                    //                                         {
                    //                                             url: mediaElement
                    //                                                 .saleorMedia[0]
                    //                                                 .url,
                    //                                             installedSaleorAppId:
                    //                                                 this
                    //                                                     .installedSaleorAppId,
                    //                                         },
                    //                                 },
                    //                             },
                    //                         );
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                } catch (error) {
                    errors.push(error);
                    this.logger.error(error as any);
                }
            }
            if (errors.length > 0) {
                /**
                 * just log the errors for now
                 */
                this.logger.error(
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
            this.logger.info(`Setting GTE date to ${createdGte}.`, {
                saleorRun: "syncToECI",
                updatedAtGte: createdGte.toISOString(),
            });
        }
        const response = await queryWithPagination(({ first, after }) =>
            this.saleorClient.saleorEntitySyncProducts({
                first,
                after,
                updatedAtGte: createdGte.toISOString(),
                /**
                 * for testing purposes we can limit the result to just specific product ids
                 */
                // ids: ["UHJvZHVjdDo4MTk="],
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
                include: {
                    product: {
                        include: {
                            variants: {
                                include: {
                                    saleorProductVariant: {
                                        where: {
                                            installedSaleorAppId:
                                                this.installedSaleorAppId,
                                        },
                                    },
                                    media: {
                                        include: {
                                            saleorMedia: {
                                                where: {
                                                    installedSaleorAppId:
                                                        this
                                                            .installedSaleorAppId,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
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
                        },
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

            /**
             * we just make sure, that connected media is still connected.
             * Sometimes, connections get lost.
             */
            const existingSchemabaseMediaInSaleor =
                product?.media?.filter((m) => m?.schemabaseMediaId) || [];
            for (const existingMedia of existingSchemabaseMediaInSaleor) {
                if (!existingMedia.schemabaseMediaId) continue;
                try {
                    await this.db.saleorMedia.upsert({
                        where: {
                            url_installedSaleorAppId: {
                                url: existingMedia.url,
                                installedSaleorAppId: this.installedSaleorAppId,
                            },
                        },
                        create: {
                            id: existingMedia.id,
                            url: existingMedia.url,
                            installedSaleorApp: {
                                connect: {
                                    id: this.installedSaleorAppId,
                                },
                            },
                            media: {
                                connect: {
                                    id: existingMedia.schemabaseMediaId,
                                },
                            },
                        },
                        update: {
                            id: existingMedia.id,
                        },
                    });
                } catch (error) {
                    this.logger.error(
                        `Error upserting media ${existingMedia.id} for product ${product.id} from Saleor: ${error}`,
                        {
                            mediaId: existingMedia.id,
                            productId: product.id,
                            url: existingMedia.url,
                        },
                    );
                }
            }

            /**
             * Media in schemabase is connected to product and / or variant.
             * Saleor uses just product and connects media to variant.
             * This here is all media we have for this product or its variants
             */
            const existingTotalMediaInSchemabase = await this.db.media.findMany(
                {
                    where: {
                        OR: [
                            {
                                products: {
                                    some: {
                                        id: existingProduct?.product.id,
                                    },
                                },
                            },
                            {
                                productVariants: {
                                    some: {
                                        productId: existingProduct?.product.id,
                                    },
                                },
                            },
                        ],
                    },
                    include: {
                        saleorMedia: true,
                    },
                },
            );
            /**
             * media, that has a Saleor id in our db, but does no longer exist in Saleor. We can assume,
             * that this media was deleted in Saleor and we can mark it as deleted in our DB. We compare
             * product and variant media
             */
            const productMediaToDelete =
                existingTotalMediaInSchemabase
                    ?.filter(
                        (m) =>
                            product.media &&
                            !product.media.find(
                                (x) => x.id === m.saleorMedia?.[0]?.id,
                            ),
                    )
                    .filter((m) => m.type !== "MANUAL")
                    .filter((m) => m.deleted === false) || [];

            // marking media as deleted in our DB
            for (const m of productMediaToDelete) {
                await this.db.media.update({
                    where: {
                        id: m.id,
                    },
                    data: {
                        deleted: true,
                    },
                });
            }

            const variantMediaToDelete =
                existingProduct?.product?.variants
                    .map((v) => v.media)
                    .flat()
                    .filter(
                        (m) =>
                            product.media &&
                            !product.media.find(
                                (x) => x.id === m.saleorMedia?.[0]?.id,
                            ),
                    ) || [];
            // marking media as deleted in our DB
            for (const m of variantMediaToDelete) {
                this.logger.info(`Deleting media ${m.id} from DB`);
                await this.db.media.update({
                    where: {
                        id: m.id,
                    },
                    data: {
                        deleted: true,
                    },
                });
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

        this.saleorRequestCounter = 0;

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

        const variantSync = new VariantAndVariantStocks({
            saleorClient: this.saleorClient,
            installedSaleorAppId: this.installedSaleorApp.id,
            logger: this.logger,
            db: this.db,
        });

        await variantSync.syncVariantsAndVariantStocks(createdGte);

        this.logger.info("Sync completed. Setting cron state in DB");

        await this.cronState.set({
            lastRun: new Date(),
            lastRunStatus: "success",
        });
    }

    /**
     * Fully deletes all data we have in our DB from a Saleor product. All media, channels, variants, etc.
     * @param saleorProductId
     */
    private async fullDeleteSaleorProduct(saleorProductId: string) {
        const saleorItem = await this.db.saleorProduct.findUniqueOrThrow({
            where: {
                id_installedSaleorAppId: {
                    id: saleorProductId,
                    installedSaleorAppId: this.installedSaleorApp.id,
                },
            },
            include: {
                product: {
                    include: {
                        media: {
                            include: {
                                saleorMedia: {
                                    where: {
                                        installedSaleorAppId:
                                            this.installedSaleorApp.id,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        this.logger.info(
            `Deleting every Saleor data in our DB for product ${saleorItem.product.id}`,
            {
                productId: saleorItem.product.id,
                saleorProductId: saleorProductId,
            },
        );

        // delete the saleor product
        await this.db.saleorProduct.delete({
            where: {
                id_installedSaleorAppId: {
                    id: saleorProductId,
                    installedSaleorAppId: this.installedSaleorApp.id,
                },
            },
        });

        // delete all Saleor variants
        await this.db.saleorProductVariant.deleteMany({
            where: {
                productId: saleorProductId,
                installedSaleorAppId: this.installedSaleorApp.id,
            },
        });

        // delete all Saleor media
        await this.db.saleorMedia.deleteMany({
            where: {
                installedSaleorAppId: this.installedSaleorApp.id,
                media: {
                    id: {
                        in: saleorItem.product.media?.map((m) => m.id),
                    },
                },
            },
        });

        // deleting Saleor channel listing
        await this.db.saleorChannelListing.deleteMany({
            where: {
                productId: saleorProductId,
                installedSaleorAppId: this.installedSaleorApp.id,
            },
        });
    }
}
