import { normalizeStrings } from "../normalization";

const uniqueStringOrderLine = (
  orderNumber: string,
  sku: string,
  quantity: number,
) => {
  return normalizeStrings.lineItemStrings(`${orderNumber}${sku}${quantity}`);
};

/**
 * Generate a unique string that identifies this line_item
 * of a package
 * @param packageNumber
 * @param sku
 * @param quantity
 * @returns
 */
const uniqueStringPackageLineItem = (
  packageNumber: string,
  sku: string,
  quantity: number,
) => {
  return normalizeStrings.lineItemStrings(`${packageNumber}${sku}${quantity}`);
};
export { uniqueStringOrderLine, uniqueStringPackageLineItem };
