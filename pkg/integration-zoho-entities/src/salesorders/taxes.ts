/* eslint-disable max-len */
import { ZohoTax, Tax } from "@prisma/client";
import { Warning } from "../utils";

export type ExtendedTax = Tax & {
    zohoTaxes: ZohoTax[];
};

export function taxToZohoTaxId(tax: ExtendedTax): string {
    if (!tax?.zohoTaxes || tax.zohoTaxes.length === 0) {
        throw new Warning(
            "No zohoTaxes set for this tax. Aborting sync of this order. Try again after zoho taxes sync.",
        );
    }
    if (tax.zohoTaxes.length > 1) {
        throw new Error(
            `Multiple zohoTaxes set for this tax. Percentage:${tax.percentage}. Aborting sync of this order.`,
        );
    }
    return tax.zohoTaxes[0].id;
}
