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
  /**
   * Iterate through the package line items and find the corresponding order line items
   */
  // const formatedLineItems = packageLineItems
  //   .map((eciLineItem) => {
  //     /**
  //      * The ZohoSalesOrderLine corresponding to our internal PackageOrderLine
  //      */
  //     const orderLineItems = lineItems.find(
  //       (l) => l.sku === eciLineItem.sku && l.quantity >= eciLineItem.quantity,
  //     );
  //     const zohoOrderLines = orderLineItems?.zohoOrderLineItems?.[0];
  //     if (!zohoOrderLines) {
  //       logger.warn(
  // eslint-disable-next-line max-len
  //         `No order line items found for ${eciLineItem.sku} and quantity >= ${eciLineItem.quantity}.`,
  //       );
  //       return undefined;
  //     }
  //     if (eciLineItem.quantity > orderLineItems.quantity) {
  //       logger.info(
  //         "Package line items quantity is bigger than our Order line items quantity. " +
  //           "This might happen for bundle products.",
  //       );
  //     }
  //     return {
  //       so_line_item_id: zohoOrderLines.id,
  //       quantity: eciLineItem.quantity,
  //     };
  //   })
  //   .filter((e) => e !== undefined);

  /**
   * Iterate through our line items and find the corresponding package line items.
   */
  const formatted2 = lineItems
    .map((i) => {
      const match = packageLineItems.find(
        (x) => x.sku === i.sku && x.quantity <= i.quantity,
      );

      if (!match) {
        logger.warn(
          // eslint-disable-next-line max-len
          `No order line items found for ${i.sku}`,
        );

        return undefined;
      }
      if (!i.zohoOrderLineItems?.[0].id) {
        return undefined;
      }
      return {
        so_line_item_id: i.zohoOrderLineItems[0].id,
        quantity: match.quantity,
      };
    })
    .filter((e) => e !== undefined);

  if (formatted2.length === 0) {
    throw new Warning(
      `Could not match any Zoho SalesOrder Lines with our package line items! Can't proceed`,
    );
  }

  return formatted2 as CreatePackageLineItems;
}
