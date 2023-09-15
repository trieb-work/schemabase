import { AttributeType } from "@eci/pkg/prisma";
import { parse } from "node-html-parser";

/**
 * Takes a string, that is html encoded, and returns a decoded string
 * @param input
 * @returns
 */
const htmlDecode = (input: string): string => {
    const doc = parse(input);
    return doc.textContent as string;
};

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
        case "FILE":
            return AttributeType.FILE;
        case "NUMERIC":
            return AttributeType.NUMERIC;
        case "RICH_TEXT":
            return AttributeType.RICH_TEXT;
        case "text":
            return AttributeType.PLAIN_TEXT;
        case "color":
            return AttributeType.SWATCH;
        case "checkbox":
            return AttributeType.BOOLEAN;
        case "reference":
            return AttributeType.PRODUCT_REFERENCE;
        case "DATE":
            return AttributeType.DATE;
        case "DATE_TIME":
            return AttributeType.DATE_TIME;
        default:
            throw new Error(`Unknown attribute type: ${kenAttribute}`);
    }
};

export { htmlDecode, kenAttributeToEciAttribute };
