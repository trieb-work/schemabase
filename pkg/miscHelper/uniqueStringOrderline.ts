import { normalizeStrings } from "../normalization";

/**
 * Generate a unique string as ID for the database for orderLineItems.
 * Taking the following conciderations into account:
 * There can be any combination of SKU, quantity, price, etc. for an order
 * @param orderNumber
 * @param sku
 * @param quantity
 * @param order - the order, of the line item. Starting with 1 for the first item
 * @returns
 */
const uniqueStringOrderLine = (
    orderNumber: string,
    sku: string,
    quantity: number,
    order: number,
) => {
    return normalizeStrings.lineItemStrings(
        `${orderNumber}${sku}${quantity}${order}`,
    );
};

/**
 * Generate a unique string that identifies this line_item
 * of a package
 * @param packageNumber
 * @param sku
 * @param quantity
 * @param order - the order, of the line item. Starts with 1 for the first item
 * @returns
 */
const uniqueStringPackageLineItem = (
    packageNumber: string,
    sku: string,
    quantity: number,
    order: number,
) => {
    return normalizeStrings.lineItemStrings(
        `${packageNumber}${sku}${quantity}${order}`,
    );
};
export { uniqueStringOrderLine, uniqueStringPackageLineItem };
