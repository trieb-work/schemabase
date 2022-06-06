import { normalizeStrings } from "../normalization";

const uniqueStringOrderLine = (
  orderNumber: string,
  sku: string,
  quantity: number,
) => {
  return normalizeStrings.lineItemStrings(`${orderNumber}${sku}${quantity}`);
};
export { uniqueStringOrderLine };
