/* eslint-disable camelcase */
/* eslint-disable max-len */
import type { CreateSalesOrder } from "@trieb.work/zoho-ts";
import {
  Order,
  LineItem,
  Warehouse,
  ZohoWarehouse,
  ProductVariant,
  ZohoItem,
} from "@prisma/client";
import { Warning } from ".";
import { ExtendedTax, taxToZohoTaxId } from "./taxes";

type ExtendedLineItem = LineItem & {
  productVariant: ProductVariant & {
    zohoItem: ZohoItem[];
  };
  warehouse:
    (Warehouse & {
        zohoWarehouse: ZohoWarehouse[];
    })
    | null;
  tax: ExtendedTax;
};

type OrderWithZohoItemsAndZohoWarehouse = Order & {
  lineItems: ExtendedLineItem[];
};

export function calculateDiscount(
  value: number | undefined,
  type: "fixed" | "percentage",
) {
  if (!value) return "0";
  return type === "percentage" ? `${value}%` : `${value}`;
}

function calculateLineItemDiscount(
  lineItem: ExtendedLineItem,
  discount_type: CreateSalesOrder["discount_type"],
): CreateSalesOrder["line_items"][0]["discount"] {
  if (lineItem.discountValueNet) {
    if (discount_type === "entity_level") {
      throw new Error(
        "ECI Order is having a discountValueNet and therefore is from discount_type entity_level but lineItem also has a discountValueNet." +
          " This is not supported. It is only allowed to set discountValueNet on the ECI Order or on the ECI lineItems but not both",
      );
    }
    return calculateDiscount(lineItem.discountValueNet, "fixed");
  }
  return calculateDiscount(undefined, "fixed");
}

export function orderToZohoLineItems(
  order: OrderWithZohoItemsAndZohoWarehouse,
  discount_type: CreateSalesOrder["discount_type"],
): CreateSalesOrder["line_items"] {
  return order.lineItems.reduce((akku, lineItem) => {
    if (!lineItem?.productVariant) {
      throw new Error(
        "No productVariant set for this lineItem. Aborting sync of this order.",
      );
    }
    if (
      !lineItem?.productVariant?.zohoItem ||
      lineItem.productVariant.zohoItem.length === 0
    ) {
      throw new Warning(
        "No zohoItem set for the productVariant of this lineItem. Aborting sync of this order. Try again after zoho items sync.",
      );
    }
    if (lineItem.productVariant.zohoItem.length > 1) {
      throw new Error(
        "Multiple zohoItems set for the productVariant of this lineItem. Aborting sync of this order.",
      );
    }
    if (!lineItem?.warehouse) {
      throw new Error(
        "No warehouse set for current lineItem. Aborting sync of this order",
      );
    }
    const warehouses =
      lineItem?.warehouse?.zohoWarehouse?.flatMap((wh) => wh.id) || [];
    if (warehouses.length === 0) {
      throw new Warning(
        "No zoho warehouses found for single lineItem. Aborting sync of this order. Try again after zoho warehouses sync.",
      );
    }
    if (warehouses.length > 1) {
      throw new Error(
        "Multiple zoho warehouses found for single lineItem. Aborting sync of this order",
      );
    }
    return [
      ...akku,
      {
        item_id: lineItem.productVariant.zohoItem[0].id,
        quantity: lineItem.quantity,
        warehouse_id: warehouses[0],
        discount: calculateLineItemDiscount(lineItem, discount_type),
        tax_id: taxToZohoTaxId(lineItem.tax),
      },
    ];
  }, [] as CreateSalesOrder["line_items"]);
}