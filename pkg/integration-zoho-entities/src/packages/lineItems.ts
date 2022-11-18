import { ILogger } from "@eci/pkg/logger";
import { PackageLineItem } from "@eci/pkg/prisma";
import { CreatePackageLineItems } from "@trieb.work/zoho-ts/dist/types/package";
import { Warning } from "../utils";

export function packageToZohoLineItems(
  lineItems: {
    sku: string;
    quantity: number;
    zohoOrderLineItems: {
      id: string;
    }[];
  }[],
  packageLineItems: PackageLineItem[],
  logger: ILogger,
): CreatePackageLineItems {
  const formatedLineItems = packageLineItems
    .map((eciLineItem) => {
      /**
       * The ZohoSalesOrderLine corresponding to our internal PackageOrderLine
       */
      const zohoOrderLines = lineItems.find(
        (l) => l.sku === eciLineItem.sku && eciLineItem.quantity >= l.quantity,
      )?.zohoOrderLineItems?.[0];
      if (!zohoOrderLines) {
        logger.warn(
          // eslint-disable-next-line max-len
          `No order line items found for ${eciLineItem.sku} and quantity >= ${eciLineItem.quantity}`,
        );
        return undefined;
      }
      return {
        so_line_item_id: zohoOrderLines.id,
        quantity: eciLineItem.quantity,
      };
    })
    .filter((e) => e !== undefined);
  if (formatedLineItems.length === 0) {
    throw new Warning(
      `Could not match any Zoho SalesOrder Lines with our package line items! Can't proceed`,
    );
  }

  return formatedLineItems as CreatePackageLineItems;
}
