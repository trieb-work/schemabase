import { ILogger } from "@eci/pkg/logger";
import { closestsMatch } from "@eci/pkg/utils/closestMatch";
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
     * Iterate through our line items and find the corresponding package line items.
     */
    const formatted2 = lineItems
        .map((i) => {
            const filteredForSku = packageLineItems.filter(
                (x) => x.sku === i.sku,
            );

            if (filteredForSku.length === 0) {
                logger.warn(
                    `No order line items found for the package line item with SKU ${i.sku}`,
                );
                return undefined;
            }
            const match = closestsMatch(filteredForSku, i.quantity, "quantity");
            // const match = packageLineItems.find(
            //   (x) => x.sku === i.sku && x.quantity <= i.quantity,
            // );

            if (!match) {
                logger.warn(
                    // eslint-disable-next-line max-len
                    `No order line items found for ${i.sku}`,
                );
                return undefined;
            }
            if (match.sku !== i.sku) {
                logger.error(
                    `Security check failed! The best match SKU is different to SKU ${i.sku}`,
                );
                return undefined;
            }
            if (!i.zohoOrderLineItems?.[0]?.id) {
                return undefined;
            }
            return {
                so_line_item_id: i.zohoOrderLineItems[0]?.id,
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
