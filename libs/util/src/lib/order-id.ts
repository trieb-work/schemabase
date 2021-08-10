import { btoa } from "js-base64";
/**
 * Returns the Saleor Order Id from an order number.
 * @param orderNumber String like 356, 1502, etc..
 */
export function getGqlOrderId(orderNumber: string): string {
  return btoa(`Order:${orderNumber}`);
}
