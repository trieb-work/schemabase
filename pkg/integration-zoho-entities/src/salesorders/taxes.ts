/* eslint-disable max-len */
import { ZohoTax, Tax } from "@prisma/client";
import { Warning } from "../utils";

export type ExtendedTax = Tax & {
    zohoTaxes: ZohoTax[];
};

export function taxToZohoTaxId(
    tax: ExtendedTax,
    isExportDelivery?: boolean,
): string {
    if (!tax?.zohoTaxes || tax.zohoTaxes.length === 0) {
        throw new Warning(
            "No zohoTaxes set for this tax. Aborting sync of this order. Try again after zoho taxes sync.",
        );
    }
    if (tax.zohoTaxes.length > 1) {
        /**
         * If there are multiple zoho taxes for this tax,
         * we need to check if the tax is for export delivery. (0%)
         * We try to find a tax rate from zoho by name by searching for "export" in the name
         */
        if (isExportDelivery) {
            const exportTax = tax.zohoTaxes.find(
                (zohoTax) =>
                    zohoTax.name &&
                    zohoTax.name.toLowerCase().includes("export"),
            );
            if (exportTax) {
                return exportTax.id;
            }
        }
        throw new Error(
            `Multiple zohoTaxes set for this tax. Percentage: ${tax.percentage}. Aborting sync of this order. Is export delivery: ${isExportDelivery}`,
        );
    }
    return tax.zohoTaxes[0].id;
}
