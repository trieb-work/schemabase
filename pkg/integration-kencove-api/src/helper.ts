import { AttributeType } from "@eci/pkg/prisma";
import { parse } from "node-html-parser";
import { KencoveApiAttribute, KencoveApiAttributeInProduct } from "./types";

/**
 * Takes a string, that is html encoded, and returns a decoded string
 * @param input
 * @returns
 */
const htmlDecode = (input: string): string => {
    const doc = parse(input);
    return doc.textContent as string;
};

/**
 * Clean the attributes, remove empty null or undefined values. HTML decode the attribute value.
 * Replace certain attribute names with our own names. For example "uom" get "Unit of Measure"
 * @param attributes
 * @returns
 */
function cleanAttributes(
    attributes: KencoveApiAttribute[],
): KencoveApiAttribute[];
function cleanAttributes(
    attributes: KencoveApiAttributeInProduct[],
): KencoveApiAttributeInProduct[];
function cleanAttributes(
    attributes: KencoveApiAttributeInProduct[] | KencoveApiAttribute[],
): KencoveApiAttributeInProduct[] | KencoveApiAttribute[] {
    const attributeNamesToReplace = [
        {
            name: "uom",
            replaceWith: "Unit of Measure",
        },
        {
            name: "dim",
            replaceWith: "Dimensions",
        },
        {
            name: "#000000",
            replaceWith: "Black",
        },
        {
            name: "#FFFFFF",
            replaceWith: "White",
        },
        {
            name: "#604738",
            replaceWith: "Brown",
        },
    ];
    /**
     * Attributes with this name don't get HTML decoded
     */
    const noHtmlDecode = ["variant_website_description"];
    /**
     * look for a attribute name and replace its attribute type
     */
    const attributeTypesToReplace = [
        {
            name: "Number Range",
            display_type: "radio",
        },
        {
            name: "variant_website_description",
            display_type: "richtext",
        },
        {
            name: "uom",
            display_type: "radio",
        },
        {
            name: "Unit of Measure",
            display_type: "radio",
        },
    ];

    /**
     * Typeguard function for typescript to check, which kind of attributes we have
     * @param input
     * @returns
     */
    const isKencoveApiAttributeInProduct = (
        input: any,
    ): input is KencoveApiAttributeInProduct[] => {
        return (
            (input as KencoveApiAttributeInProduct[]).filter((x) => x)?.[0]
                ?.name !== undefined
        );
    };

    // if we have attributes with values (type KencoveApiAttributeInProduct) we
    // return attributes with value filter
    if (isKencoveApiAttributeInProduct(attributes)) {
        return attributes
            .filter(
                (attribute) =>
                    attribute.value !== undefined &&
                    attribute.value !== null &&
                    attribute.value !== "" &&
                    attribute.value !== " " &&
                    attribute.value !== "0x0x0",
            )
            .map((attribute) => {
                const attributeNameToReplace = attributeNamesToReplace.find(
                    (atr) => atr.name === attribute.name,
                );
                if (attributeNameToReplace) {
                    attribute.name = attributeNameToReplace.replaceWith;
                }
                const attributeTypeToReplace = attributeTypesToReplace.find(
                    (atr) => atr.name === attribute.name,
                );
                if (attributeTypeToReplace) {
                    attribute.display_type =
                        attributeTypeToReplace.display_type;
                }
                return attribute;
            })
            .map((attribute) => ({
                ...attribute,
                value: noHtmlDecode.includes(attribute.name)
                    ? attribute.value
                    : htmlDecode(attribute.value),
            }));
    }

    return attributes.map((attribute) => {
        const attributeNameToReplace = attributeNamesToReplace.find(
            (atr) => atr.name === attribute.attribute_name,
        );
        if (attributeNameToReplace) {
            attribute.attribute_name = attributeNameToReplace.replaceWith;
        }
        const attributeTypeToReplace = attributeTypesToReplace.find(
            (atr) => atr.name === attribute.attribute_name,
        );
        if (attributeTypeToReplace) {
            attribute.display_type = attributeTypeToReplace.display_type;
        }
        return attribute;
    });
}

// takes a string and tries to map it to our internal attribute type.
// Switch case that return all possible enums from
// DROPDOWN
// MULTISELECT
// FILE
// REFERENCE
// NUMERIC
// RICH_TEXT
// PLAIN_TEXT
// SWATCH
// BOOLEAN
// DATE
// DATE_TIME
const kenAttributeToEciAttribute = (kenAttribute: string): AttributeType => {
    switch (kenAttribute) {
        case "select":
            return AttributeType.DROPDOWN;
        case "radio":
            return AttributeType.DROPDOWN;
        case "multiselect":
            return AttributeType.MULTISELECT;
        case "file":
            return AttributeType.FILE;
        case "NUMERIC":
            return AttributeType.NUMERIC;
        case "richtext":
            return AttributeType.RICH_TEXT;
        case "text":
            return AttributeType.PLAIN_TEXT;
        case "color":
            return AttributeType.SWATCH;
        case "checkbox":
            return AttributeType.BOOLEAN;
        case "reference":
            return AttributeType.PRODUCT_REFERENCE;
        case "variant_reference":
            return AttributeType.VARIANT_REFERENCE;
        case "DATE":
            return AttributeType.DATE;
        case "DATE_TIME":
            return AttributeType.DATE_TIME;
        default:
            throw new Error(`Unknown attribute type: ${kenAttribute}`);
    }
};

export { htmlDecode, kenAttributeToEciAttribute, cleanAttributes };
