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
    $Enums,
    Attribute,
    KencoveApiApp,
    KencoveApiProductType,
    MediaPlacementType,
    PrismaClient,
} from "@eci/pkg/prisma";
import { subHours, subYears } from "date-fns";
import { KencoveApiClient } from "../client";
import { id } from "@eci/pkg/ids";
import { normalizeStrings } from "@eci/pkg/normalization";
import { countryCodeMatch } from "@eci/pkg/utils/countryCodeMatch";
import {
    KencoveApiAAItem,
    KencoveApiAttributeInProduct,
    KencoveApiImage,
    KencoveApiOtherMedia,
    KencoveApiProduct,
    KencoveApiVideo,
} from "../types";
import {
    cleanAttributes,
    htmlDecode,
    kenAttributeToEciAttribute,
} from "../helper";
import { syncTaxClasses } from "./taxclasses";

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

type EnhancedProduct = {
    productId: string;
    productName: string;
    description: string;
    images: KencoveApiImage[] | null;
    videos: KencoveApiVideo[] | null;
    otherMedia: KencoveApiOtherMedia[] | null;
    accessories: KencoveApiAAItem[] | null;
    alternatives: KencoveApiAAItem[] | null;
    countryOfOrigin: string | null;
    categoryId: string | undefined;
};

export class KencoveApiAppProductSyncService {
    protected readonly logger: ILogger;

    protected readonly db: PrismaClient;

    public readonly kencoveApiApp: KencoveApiApp;

    protected readonly cronState: CronStateHandler;

    /**
     * kencoveApiAttribute Ids as key, value -> isForVariant: boolean and schemabase
     * internal attributeId
     */
    private kenToEciAttribute: Map<
        string,
        {
            isForVariant: boolean;
            attributeId: string;
            isVariantSelection: boolean;
        }
    > = new Map();

    /**
     * a cache for the product type attribute function, so that we can skip
     * the same attribute for the same product type with the same settings
     */
    private setProductTypeAttributeCache: Map<
        string,
        { isForVariant: boolean; isVariantSelection: boolean }
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
            attribute_model: string;
        },
        kenProdType: KencoveApiProductType,
        isForVariant: boolean,
        isVariantSelection: boolean,
    ) {
        if (!attribute.name) {
            this.logger.error(
                `[setProductTypeAttribute] Attribute ${JSON.stringify(
                    attribute,
                )} has no name. Skipping.`,
            );
            return;
        }

        /**
         * If our cached map is already the same, we can just skip this
         */
        const cached = this.setProductTypeAttributeCache.get(
            `${attribute.attribute_id.toString()}_${kenProdType.productTypeId}`,
        );
        if (
            cached &&
            cached.isForVariant === isForVariant &&
            cached.isVariantSelection === isVariantSelection
        ) {
            this.logger.debug(
                `[setProductTypeAttribute] Attribute ${attribute.name} is already set as ${isForVariant} and ${isVariantSelection}. Skipping.`,
            );
            return;
        }

        /**
         * First make sure, that the attribute itself does already exist in the DB
         */
        const kenAttribute = await this.db.kencoveApiAttribute.upsert({
            where: {
                id_model_kencoveApiAppId: {
                    id: attribute.attribute_id.toString(),
                    kencoveApiAppId: this.kencoveApiApp.id,
                    model: attribute.attribute_model,
                },
            },
            create: {
                id: attribute.attribute_id.toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
                model: attribute.attribute_model,
                kencoveApiApp: {
                    connect: {
                        id: this.kencoveApiApp.id,
                    },
                },
                attribute: {
                    connectOrCreate: {
                        where: {
                            normalizedName_tenantId: {
                                normalizedName: normalizeStrings.attributeNames(
                                    attribute.name,
                                ),
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("attribute"),
                            name: attribute.name,
                            normalizedName: normalizeStrings.attributeNames(
                                attribute.name,
                            ),
                            type: kenAttributeToEciAttribute(
                                attribute.display_type,
                            ),
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

        const existingProductTypeAttribute =
            await this.db.productTypeAttribute.findUnique({
                where: {
                    productTypeId_attributeId: {
                        productTypeId: kenProdType.productTypeId,
                        attributeId: kenAttribute.attributeId,
                    },
                },
            });

        if (!existingProductTypeAttribute) {
            // we are creating the productTypeAttribute relation via the productType table
            // so that the updateAt field gets updated correctly
            await this.db.productType.update({
                where: {
                    id: kenProdType.productTypeId,
                },
                data: {
                    updatedAt: new Date(),
                    attributes: {
                        create: {
                            id: id.id("productType"),
                            isVariantSelection,
                            isForVariant,
                            attribute: {
                                connect: {
                                    id: kenAttribute.attributeId,
                                },
                            },
                        },
                    },
                },
            });
        } else {
            /**
             * A product type attribute can be switched from product attribute to variant attribute, but not back.
             */
            if (
                (!existingProductTypeAttribute.isForVariant && isForVariant) ||
                (!existingProductTypeAttribute.isVariantSelection &&
                    isVariantSelection)
            ) {
                this.logger.info(
                    // eslint-disable-next-line max-len
                    `[setProductTypeAttribute] Product type attribute ${attribute.name} isForVariant changed to true`,
                );
                await this.db.productTypeAttribute.update({
                    where: {
                        productTypeId_attributeId: {
                            productTypeId: kenProdType.productTypeId,
                            attributeId: kenAttribute.attributeId,
                        },
                    },
                    data: {
                        isForVariant,
                        isVariantSelection,
                    },
                });
            }
        }

        this.kenToEciAttribute.set(kenAttribute.id, {
            attributeId: kenAttribute.attributeId,
            isForVariant,
            isVariantSelection,
        });

        this.setProductTypeAttributeCache.set(
            `${attribute.attribute_id.toString()}_${kenProdType.productTypeId}`,
            {
                isForVariant,
                isVariantSelection,
            },
        );
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
     * The Kencove API is often returning all attributes as variant attribtues, even if they are not.
     * We group all attributes by name and value. Attributes, that have the same name and value for
     * ALL variants are considered as product attributes and not variant attributes.
     * We set them as product attributes.
     * Only attributes, whose value is the same for ALL variants of the product can be considered
     * product attributes.
     * We also filter all attributes with value null or undefined or empty string out.
     * We return an array of attributes for product attributes and
     * an array of attributes for variant attributes.
     */
    private attributeMatch(
        productData: KencoveApiProduct,
    ): SeparatedAttributes {
        this.logger.debug(
            "Matching attributes for product " + productData.name,
            {
                odooId: productData.id,
            },
        );
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
                productAttributes: cleanAttributes(
                    allVariants[0].attributeValues || [],
                ).filter((vsa) => vsa.name !== "variant_website_description"),
                productAttributesUnique: cleanAttributes(
                    this.uniqueAttributes(allVariants[0].attributeValues || []),
                ),
                variantAttributes: [],
                variantAttributesUnique: [],
                variantSelectionAttributes: cleanAttributes(
                    allVariants[0].selectorValues,
                ).filter((vsa) => vsa.name !== "website_ref_desc"),
                variantSelectionAttributesUnique: cleanAttributes(
                    this.uniqueAttributes(allVariants[0].selectorValues),
                ).filter((vsa) => vsa.name !== "website_ref_desc"),
            };
        }

        allVariants.forEach((variant) => {
            /**
             * This logic sets selector values that have same values and names
             * for all variants as product attributes. This can be bad for product variants,
             * where we need this information, altough we just have one selection value.
             */
            // variant.selectorValues.forEach((selectorValue) => {
            //     if (
            //         allVariants.every((v) =>
            //             v.selectorValues.some(
            //                 (sv) =>
            //                     sv.name === selectorValue.name &&
            //                     sv.value === selectorValue.value,
            //             ),
            //         )
            //     ) {
            //         this.logger.debug(
            //             `Selector value ${selectorValue.name} with value ${selectorValue.value} is common for all variants. ` +
            //                 "Setting it as product attribute",
            //         );
            //         commonSelectorValues.push(selectorValue);
            //     }
            // });

            if (!variant.attributeValues) return;
            variant.attributeValues.forEach((attributeValue) => {
                if (
                    allVariants.every(
                        (v) =>
                            v.attributeValues?.some(
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

        commonSelectorValues = cleanAttributes(commonSelectorValues).filter(
            (vsa) => vsa.name !== "website_ref_desc",
        );
        commonAttributeValues = cleanAttributes(commonAttributeValues);

        const productAttributes = [
            ...commonSelectorValues,
            ...commonAttributeValues,
        ];

        allVariants.forEach((variant) => {
            variant.selectorValues.forEach((selectorValue) => {
                /**
                 * If the selector attribute is the "special" website_ref_desc
                 * and if a value is set for that attribute, we search for a better
                 * fitting attribute first (sometimes for example we have a "color" attribute)
                 */
                if (
                    selectorValue.name === "website_ref_desc" &&
                    selectorValue.value
                ) {
                    const correspondingAttributeValue =
                        variant.attributeValues?.find(
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
                                    vsa.attribute_id ===
                                    correspondingAttributeValue.attribute_id,
                            )
                        ) {
                            variantSelectionAttributes.push(
                                correspondingAttributeValue,
                            );
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
                                (vsa) =>
                                    vsa.attribute_id ===
                                    selectorValue.attribute_id,
                            )
                        ) {
                            variantSelectionAttributes.push(selectorValue);
                        }
                    }
                } else {
                    /**
                     * Regular and clean variant selection attributes
                     */
                    variantSelectionAttributes.push(selectorValue);
                }
            });
        });

        const variantAttributes = cleanAttributes(
            allVariants.flatMap(
                (variant) =>
                    variant.attributeValues?.filter(
                        (av): av is KencoveApiAttributeInProduct =>
                            !productAttributes.some(
                                (pa) => pa.name === av.name,
                            ) &&
                            !variantSelectionAttributes.some(
                                (vsa) => vsa.attribute_id === av.attribute_id,
                            ),
                    ) || [],
            ),
        );

        /**
         * We filter out website_ref_desc. We never want to use this as
         * an attribute, but only as variant name. We never want to have
         * variant_website_description as product attribute
         */
        return {
            productAttributesUnique: this.uniqueAttributes(
                productAttributes,
            ).filter((vsa) => vsa.name !== "variant_website_description"),
            productAttributes: productAttributes.filter(
                (vsa) => vsa.name !== "variant_website_description",
            ),
            variantAttributes,
            variantAttributesUnique: cleanAttributes(
                this.uniqueAttributes(variantAttributes),
            ),
            variantSelectionAttributesUnique: cleanAttributes(
                this.uniqueAttributes(variantSelectionAttributes),
            ).filter((vsa) => vsa.name !== "website_ref_desc"),
            variantSelectionAttributes: cleanAttributes(
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
        attributeInProduct,
        attributeValue,
        productId,
        variantId,
        isForVariant,
    }: {
        attribute: Attribute;
        attributeInProduct?: KencoveApiAttributeInProduct;
        attributeValue?: string;
        productId?: string;
        variantId?: string;
        isForVariant: boolean;
    }) {
        const value = attributeValue || attributeInProduct?.value;
        if (!value) {
            this.logger.error(
                `Attribute ${attribute.name} has no value. Skipping.`,
            );
            return;
        }
        const normalizedName = normalizeStrings.attributeValueNames(value);
        this.logger.debug(
            `Setting attribute ${attribute.name}, value ${value}`,
            {
                isForVariant,
            },
        );

        let hexCode: string | undefined = undefined;
        // we set an attribute hex value to the hex value field, when type is "swatch"
        // and value starts with "#"
        if (attribute.type === "SWATCH" && value.startsWith("#")) {
            this.logger.debug(
                `Attribute ${attribute.name} is a color swatch with hex code: ${value}`,
            );
            hexCode = value;
        }

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
                    value:
                        hexCode && attributeInProduct?.attribute_text
                            ? attributeInProduct.attribute_text
                            : value,
                    hexColor: hexCode,
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
                    value:
                        hexCode && attributeInProduct?.attribute_text
                            ? attributeInProduct.attribute_text
                            : value,
                    hexColor: hexCode,
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
     * takes all the products and extracts the unique product types we have. Then
     * creates or updates the product types in the DB and adds the related attributes
     * @param products
     */
    private async syncProductTypeAndAttributes(products: KencoveApiProduct[]) {
        const uniqueProductTypes = products
            .map((p) => p.productType)
            .filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
            .filter((pt) => pt.name !== null)
            .filter((pt) => pt.id !== null) as { id: string; name: string }[];

        const uniqueIds = uniqueProductTypes
            .map((pt) => pt.id)
            .filter((pt) => pt !== null) as string[];

        this.logger.info(
            `Found ${uniqueProductTypes.length} unique product types.`,
            {
                uniqueIds,
            },
        );

        /**
         * All product types, that are already in the DB.
         */
        const existingProductTypes =
            await this.db.kencoveApiProductType.findMany({
                where: {
                    kencoveApiAppId: this.kencoveApiApp.id,
                    id: {
                        in: uniqueIds,
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
                (p) =>
                    p.productType.id === productType.id &&
                    p.variants.length > 1,
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
                this.logger.info(
                    `Updating product type "${productType.name}".`,
                );
                let changeVariant: boolean | undefined;
                if (
                    existingProductType.productType.isVariant === false &&
                    isVariant
                ) {
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
            if (!kenProdType) {
                this.logger.error(
                    `Product type ${product.productType.name} not found in DB`,
                );
                continue;
            }

            /**
             * Manually adding three product attributes: Accessory Items, Alternative Items and Frequently Bought Together
             * They get values from the API in a different way, so we have to add them manually, so
             * move them to Saleor in a standard manner
             */
            productAttributesUnique.push({
                name: "Alternative Items",
                value: "",
                attribute_id: 333330,
                display_type: "reference",
                attribute_model: "custom",
            });
            productAttributesUnique.push({
                name: "Accessory Items",
                value: "",
                attribute_id: 333331,
                display_type: "reference",
                attribute_model: "custom",
            });
            productAttributesUnique.push({
                name: "Shipping Status",
                value: "",
                attribute_id: 333332,
                display_type: "multiselect",
                attribute_model: "custom",
            });
            variantAttributesUnique.push({
                name: "Frequently Bought Together",
                value: "",
                attribute_id: 333335,
                display_type: "variant_reference",
                attribute_model: "custom",
            });
            variantAttributesUnique.push({
                name: "Backorder",
                value: "",
                attribute_id: 333336,
                display_type: "checkbox",
                attribute_model: "custom",
            });
            productAttributesUnique.push({
                name: "Product Manual",
                value: "",
                attribute_id: 333334,
                display_type: "file",
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
                await this.setProductTypeAttribute(
                    attribute,
                    kenProdType,
                    true,
                    true,
                );
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
                await this.setProductTypeAttribute(
                    attribute,
                    kenProdType,
                    true,
                    false,
                );
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
                        id_model_kencoveApiAppId: {
                            id: "333331",
                            kencoveApiAppId: this.kencoveApiApp.id,
                            model: "custom",
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
                        id_model_kencoveApiAppId: {
                            id: "333330",
                            kencoveApiAppId: this.kencoveApiApp.id,
                            model: "custom",
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

    /**
     * Helper function that transforms the Kencove images, videos and other media
     * to our internal media format to directy connectOrCreate them in the DB
     * @param product
     */
    private getTotalMediaFromProduct(product: EnhancedProduct): {
        id: string;
        url: string;
        type: MediaPlacementType;
        tenant: {
            connect: {
                id: string;
            };
        };
    }[] {
        /**
         * We have product images and videos. The videos get the type
         * "PRODUCTVIDEO" when we create them in the DB. For otherMedia we
         * just take media with type "Manual" and create them in the DB with type "MANUAL"
         */
        const productImages = product.images || [];
        const productVideos = product.videos || [];
        const productOtherMedia = product.otherMedia || [];
        return [
            ...productImages.map((image) => ({
                id: id.id("media"),
                url: image.url,
                type: MediaPlacementType.PRODUCTIMAGE,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
            })),
            ...productVideos.map((video) => ({
                id: id.id("media"),
                url: video.url,
                type: MediaPlacementType.PRODUCTVIDEO,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
            })),
            ...productOtherMedia.map((media) => ({
                id: id.id("media"),
                url: media.url,
                type: MediaPlacementType.MANUAL,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
            })),
        ];
    }

    /**
     * Creates a product in our DB
     */
    private async createProductSchemabase(
        product: EnhancedProduct,
        normalizedProductName: string,
        countryOfOrigin: $Enums.CountryCode | null,
        productTypeId: string,
        category: string | undefined,
    ) {
        const totalMedia = this.getTotalMediaFromProduct(product);
        return this.db.product.create({
            data: {
                id: id.id("product"),
                name: product.productName,
                normalizedName: normalizedProductName,
                descriptionHTML: product.description,
                media: {
                    connectOrCreate: totalMedia.map((media) => ({
                        where: {
                            url_tenantId: {
                                url: media.url,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: media,
                    })),
                },
                productType: {
                    connect: {
                        id: productTypeId,
                    },
                },
                category: category
                    ? {
                          connect: {
                              id: category,
                          },
                      }
                    : undefined,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
                countryOfOrigin,
            },
            include: {
                variants: {
                    include: {
                        kencoveApiProductVariant: true,
                    },
                },
                media: true,
            },
        });
    }

    /**
     * Updates a product variant in our DB. Returns the product + related variants
     */
    private async updateProductSchemabase(
        product: EnhancedProduct,
        normalizedProductName: string,
        countryOfOrigin: $Enums.CountryCode | null,
        productTypeId: string,
        category: string | undefined,
    ) {
        const totalMedia = this.getTotalMediaFromProduct(product);

        // Delete all media items, that are not in totalMedia
        await this.db.media.deleteMany({
            where: {
                products: {
                    some: {
                        normalizedName: normalizedProductName,
                        tenantId: this.kencoveApiApp.tenantId,
                    },
                },
                tenantId: this.kencoveApiApp.tenantId,
                url: {
                    notIn: totalMedia.map((media) => media.url),
                },
            },
        });

        return this.db.product.update({
            where: {
                normalizedName_tenantId: {
                    normalizedName: normalizedProductName,
                    tenantId: this.kencoveApiApp.tenantId,
                },
            },
            data: {
                name: product.productName,
                descriptionHTML: product.description,
                media: {
                    connectOrCreate: totalMedia.map((media) => ({
                        where: {
                            url_tenantId: {
                                url: media.url,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("media"),
                            url: media.url,
                            type: media.type,
                            tenant: {
                                connect: {
                                    id: this.kencoveApiApp.tenantId,
                                },
                            },
                        },
                    })),
                },
                productType: {
                    connect: {
                        id: productTypeId,
                    },
                },
                category: category
                    ? {
                          connect: {
                              id: category,
                          },
                      }
                    : undefined,
                tenant: {
                    connect: {
                        id: this.kencoveApiApp.tenantId,
                    },
                },
                countryOfOrigin,
            },
            include: {
                variants: {
                    include: {
                        kencoveApiProductVariant: true,
                    },
                },
                media: true,
            },
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

        const client = new KencoveApiClient(this.kencoveApiApp, this.logger);

        const products = await client.getProducts(createdGte);

        this.logger.info(`Found ${products.length} products to sync`);
        if (products.length === 0) {
            this.logger.info("No products to sync. Exiting.");
            await this.cronState.set({ lastRun: new Date() });
            return;
        }

        /**
         * distinct Kencove API category ids
         */
        const categoryIds = products
            .map((p) => p?.categoryId?.toString())
            .filter((p) => p)
            .filter((p, i, self) => self.indexOf(p) === i);

        const existingCategories = await this.db.kencoveApiCategory.findMany({
            where: {
                kencoveApiAppId: this.kencoveApiApp.id,
                id: {
                    in: categoryIds,
                },
            },
        });
        this.logger.debug(
            `Found ${categoryIds.length} distinct Kencove categories over all products. Receive ${existingCategories.length} from our DB`,
        );

        /**
         * First sync the product types and related attributes.
         * Not the attribute values.
         */
        await this.syncProductTypeAndAttributes(products);

        /**
         * Sync tax classes with our DB. Returns a mapping table,
         * that can be used to lookup with the Kencove API tax class id
         */
        const taxClasses = await syncTaxClasses(
            products,
            this.db,
            this.kencoveApiApp.tenantId,
            this.logger,
        );

        /**
         * just kencove Api product variants enhanced with all data from their parent product
         */
        const enhancedProducts = products
            .map((p) => {
                return {
                    images: p.images,
                    videos: p.videos,
                    otherMedia: p.other_media,
                    productType: p.productType,
                    accessories: p.accessories,
                    alternatives: p.alternatives,
                    description: p?.website_description,
                    countryOfOrigin: p.countryOfOrigin,
                    productId: p.id,
                    productName: htmlDecode(p.name),
                    categoryId: p?.categoryId?.toString(),
                    taxClass: p.product_tax_code,
                    backorder: !p.do_not_backorder,
                    variants: p.variants.map((v) => ({
                        ...v,
                        productId: p.id,
                        productName: htmlDecode(p.name),
                        countryOfOrigin: p.countryOfOrigin,
                    })),
                };
            })
            // Filter out all products, that have no product type. This should not happen
            .filter(
                (p) =>
                    p.productType?.id !== undefined ||
                    p.productType.id !== null,
            );

        /**
         * First loop is looping over all products and inner loop is looping
         * over all variants of the product
         */
        for (const product of enhancedProducts) {
            if (!product.productType.id) {
                this.logger.warn(
                    `Product ${product.productName}, id: ${product.productId} has no product type. Skipping.`,
                );
                continue;
            }

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
                                                        kencoveApiAppId:
                                                            this.kencoveApiApp
                                                                .id,
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
                : null;

            /**
             * schemabase internal category id if
             * already synchronised
             */
            const category = existingCategories.find(
                (c) => c.id === product.categoryId,
            )?.categoryId;

            /**
             * The existing product from our DB. When product does not exist, we create it.
             * When product is internally different from the product from the API, we update it.
             */
            let existingProduct = await this.db.product.findUnique({
                where: {
                    normalizedName_tenantId: {
                        normalizedName: normalizedProductName,
                        tenantId: this.kencoveApiApp.tenantId,
                    },
                },
                include: {
                    variants: {
                        include: {
                            kencoveApiProductVariant: true,
                        },
                    },
                    media: true,
                },
            });

            if (!existingProduct) {
                this.logger.info(
                    `Creating product ${product.productName} with KencoveId ${product.productId}`,
                );
                existingProduct = await this.createProductSchemabase(
                    product,
                    normalizedProductName,
                    countryOfOrigin,
                    kenProdTypeWithProductType.productTypeId,
                    category,
                );
            } else {
                /**
                 * Compare the existing product with the product from the API and only update, if something has changed
                 */
                if (
                    existingProduct.normalizedName !== normalizedProductName ||
                    existingProduct.descriptionHTML !== product.description ||
                    existingProduct.productTypeId !==
                        kenProdTypeWithProductType.productTypeId ||
                    existingProduct.countryOfOrigin !== countryOfOrigin ||
                    existingProduct.categoryId !== category ||
                    /**
                     * Compare the media arrays with each other. For simplicity, we just compare the length
                     */
                    existingProduct.media.length !==
                        this.getTotalMediaFromProduct(product).length
                ) {
                    this.logger.info(
                        `Updating product ${product.productName} with KencoveId ${product.productId}, as something has changed.`,
                    );
                    this.logger.debug("", {
                        normalizedProductName,
                        description: product.description,
                        productTypeId: kenProdTypeWithProductType.productTypeId,
                        countryOfOrigin,
                        category,
                        mediaLength:
                            this.getTotalMediaFromProduct(product).length,
                        existingNormalizedName: existingProduct.normalizedName,
                        existingDescription: existingProduct.descriptionHTML,
                        existingProductTypeId: existingProduct.productTypeId,
                        existingCountryOfOrigin:
                            existingProduct.countryOfOrigin,
                        existingCategoryId: existingProduct.categoryId,
                        existingMediaLength: existingProduct.media.length,
                    });
                    existingProduct = await this.updateProductSchemabase(
                        product,
                        normalizedProductName,
                        countryOfOrigin,
                        kenProdTypeWithProductType.productTypeId,
                        category,
                    );
                } else {
                    this.logger.info(
                        `Product ${product.productName} with KencoveId ${product.productId} has not changed. Not updating our DB.`,
                    );
                }
            }

            /**
             * This is more a protection for Typescript - this case should never happen
             */
            if (!existingProduct) {
                throw new Error(
                    `Product ${product.productName} with KencoveId ${product.productId} not found in DB.`,
                );
            }

            for (const variant of product.variants) {
                const updatedAt = new Date(variant.updatedAt);
                const createdAt = new Date(variant.createdAt);

                this.logger.info(
                    `Syncing product variant ${variant.sku} of product ${product.productName}`,
                );

                /**
                 * The product variant name. This value is often not clean coming from the API, so we
                 * set the value from the API just as fallback. When we have website_ref_desc attribute
                 * and we did not replace it with a different attribute, we use the value of the
                 * attribute as variant name
                 */
                let variantName = variant.name;
                if (
                    !this.kenVariantSelectionAttributeOverwrite.get(
                        variant.id,
                    ) &&
                    variant.selectorValues?.[0]?.name === "website_ref_desc"
                ) {
                    const variantSelectionAttribute = cleanAttributes(
                        variant.selectorValues,
                    )[0];

                    if (
                        variant?.name &&
                        normalizeStrings.productNames(variant.name) !==
                            normalizeStrings.productNames(product.productName)
                    ) {
                        this.logger.info(
                            `Variant name ${variant.name} is different to ${product.productName}. Using this as variant name`,
                        );
                        variantName = variant.name;
                    } else if (variantSelectionAttribute) {
                        this.logger.debug(
                            `Using attribute ${variantSelectionAttribute.value} as variant name`,
                        );
                        variantName = variantSelectionAttribute.value;
                    }
                }

                const sku = variant.sku;

                /**
                 * the weight of the variant, rounded to max two decimals
                 */
                const weight = Math.round(variant.weight * 100) / 100;

                /**
                 * The existing variant from our DB. When variant does not exist, we create it.
                 */
                let existingVariant = existingProduct.variants.find(
                    (v) => v.sku === sku,
                );

                /**
                 * Schemabase internal tax Id for this product / product variant
                 */
                const taxId = product.taxClass
                    ? taxClasses[product.taxClass]
                    : undefined;

                /**
                 * We compare the weight, variant name, related productId and only
                 * update when something has been changed. We create the variant if
                 * it does not exist.
                 */
                if (!existingVariant) {
                    this.logger.info(
                        `Creating variant ${variant.id} of product ${product.productName}`,
                    );
                    existingVariant = await this.db.productVariant.upsert({
                        where: {
                            sku_tenantId: {
                                sku,
                                tenantId: this.kencoveApiApp.tenantId,
                            },
                        },
                        create: {
                            id: id.id("variant"),
                            ean: variant.upc,
                            sku,
                            weight,
                            variantName,
                            tenant: {
                                connect: {
                                    id: this.kencoveApiApp.tenantId,
                                },
                            },
                            product: {
                                connect: {
                                    id: existingProduct.id,
                                },
                            },
                            salesTax: taxId
                                ? {
                                      connect: {
                                          id: taxId,
                                      },
                                  }
                                : undefined,
                            kencoveApiProductVariant: {
                                connectOrCreate: {
                                    where: {
                                        id_kencoveApiAppId: {
                                            id: variant.id,
                                            kencoveApiAppId:
                                                this.kencoveApiApp.id,
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
                                    },
                                },
                            },
                        },
                        update: {
                            weight,
                            variantName,
                            ean: variant.upc,
                            product: {
                                connect: {
                                    id: existingProduct.id,
                                },
                            },
                        },
                        include: {
                            kencoveApiProductVariant: true,
                        },
                    });
                } else if (
                    /**
                     * Variant exists. We update it, when something has changed.
                     */
                    existingVariant.weight !== weight ||
                    existingVariant.variantName !== variantName ||
                    existingVariant.productId !== existingProduct.id ||
                    existingVariant.ean !== variant.upc ||
                    existingVariant.salesTaxId !== taxId ||
                    existingVariant.kencoveApiProductVariant?.[0]
                        ?.productVariantId !== variant.id
                ) {
                    this.logger.info(
                        `Updating variant ${variant.id} of product ${product.productName}`,
                    );
                    await this.db.productVariant.update({
                        where: {
                            id: existingVariant.id,
                        },
                        data: {
                            weight,
                            variantName,
                            ean: variant.upc,
                            salesTax: taxId
                                ? {
                                      connect: {
                                          id: taxId,
                                      },
                                  }
                                : undefined,
                            product: {
                                connect: {
                                    id: existingProduct.id,
                                },
                            },
                            kencoveApiProductVariant: {
                                connectOrCreate: {
                                    where: {
                                        id_kencoveApiAppId: {
                                            id: variant.id,
                                            kencoveApiAppId:
                                                this.kencoveApiApp.id,
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
                                    },
                                },
                            },
                        },
                    });
                } else {
                    this.logger.info(
                        `Variant ${variant.id} of product ${product.productName} has not changed. Not updating our DB.`,
                    );
                }

                /**
                 * We transform the information on backorder to an attribute,
                 * that we set here
                 */
                const backOrderAttribute: KencoveApiAttributeInProduct = {
                    value: product.backorder ? "true" : "false",
                    attribute_id: 333336,
                    attribute_model: "custom",
                    name: "Backorder",
                    display_type: "checkbox",
                };

                /// set the attribute values. We need to check the product type
                /// to see, if an attribute is used as product, or variant
                /// attribute create a value entry accordingly.
                const allAttributes = [
                    ...(variant.attributeValues || []),
                    ...variant.selectorValues,
                    backOrderAttribute,
                ];

                /**
                 * We only want to set the variant_website_description attribute
                 * if the value is different to the product.description.
                 */
                const variantWebsiteDescription = allAttributes.find(
                    (a) => a.name === "variant_website_description",
                )?.value;
                let filterVariantWebsiteDescription = true;
                if (
                    variantWebsiteDescription &&
                    variantWebsiteDescription !==
                        product.description.replace(/<[^>]*>?/gm, "")?.trim() &&
                    variantWebsiteDescription !== product?.description
                ) {
                    this.logger.debug(
                        "Variant website description is different to the product description. Setting this attribute",
                    );
                    filterVariantWebsiteDescription = false;
                } else {
                    this.logger.debug(
                        "Variant website description is the same as the product description. Removing this attribute",
                    );
                    filterVariantWebsiteDescription = true;
                }

                const cleanedAttributes = cleanAttributes(allAttributes)
                    .filter((a) => a.name !== "website_ref_desc")
                    .filter((a) => {
                        if (filterVariantWebsiteDescription) {
                            return a.name !== "variant_website_description";
                        }
                        return true;
                    });
                this.logger.debug(
                    `Will now set attribute values of ${cleanedAttributes.length} attributes`,
                    {
                        attributes: cleanedAttributes,
                    },
                );
                for (const attribute of cleanedAttributes) {
                    const matchedAttr =
                        kenProdTypeWithProductType.productType.attributes.find(
                            (a) => {
                                if (
                                    a.attribute.kencoveApiAttributes.length ===
                                    0
                                ) {
                                    return false;
                                }
                                const kenAttribute =
                                    a.attribute.kencoveApiAttributes[0];
                                if (
                                    kenAttribute.id ===
                                    attribute.attribute_id.toString()
                                ) {
                                    this.logger.debug(
                                        `Found attribute ${attribute.name} in product ` +
                                            `type ${kenProdTypeWithProductType.productType.name}. Is Variant: ${a.isForVariant}`,
                                    );
                                    return true;
                                }
                                return false;
                            },
                        );
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
                        const values = JSON.parse(attribute.value);
                        this.logger.debug(
                            `Found array of values for attribute ${attribute.name}`,
                            {
                                values,
                            },
                        );

                        for (const value of values) {
                            await this.setAttributeValue({
                                productId: existingProduct.id,
                                variantId: existingVariant.id,
                                attribute: matchedAttr.attribute,
                                attributeValue: value,
                                isForVariant:
                                    matchedAttr?.isForVariant ?? false,
                            });
                        }
                    } else {
                        await this.setAttributeValue({
                            productId: existingProduct.id,
                            variantId: existingVariant.id,
                            attribute: matchedAttr.attribute,
                            attributeValue: attribute.value,
                            attributeInProduct: attribute,
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
                existingProduct.id,
                product.accessories?.map((a) => a.itemCode),
                product.alternatives?.map((a) => a.itemCode),
            );
        }
    }
}
