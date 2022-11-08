import { PackageLineItem } from "@eci/pkg/prisma";
import { CreatePackageLineItems } from "@trieb.work/zoho-ts/dist/types/package";

export function packageToZohoLineItems(
  lineItems: {
    sku: string;
    quantity: number;
    zohoOrderLineItems: {
      id: string;
    }[];
  }[],
  packageLineItems: PackageLineItem[],
): CreatePackageLineItems {
  return packageLineItems.map((eciLineItem) => {
    /**
     * The ZohoSalesOrderLine corresponding to our internal PackageOrderLine
     */
    const zohoOrderLines = lineItems.find(
      (l) => l.sku === eciLineItem.sku && eciLineItem.quantity >= l.quantity,
    )?.zohoOrderLineItems?.[0];
    if (!zohoOrderLines)
      throw new Error(
        `No order line items found for ${eciLineItem.sku} and quantity >= ${eciLineItem.quantity}`,
      );
    return {
      so_line_item_id: zohoOrderLines.id,
      quantity: eciLineItem.quantity,
    };
  });
}
