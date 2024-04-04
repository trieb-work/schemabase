import { Carrier } from "@prisma/client";

/**
 * Parse the carrier name from a string like "DHL Germany" or "DPD Klimaneutraler Versand" and
 * bring it to our internal matching format
 * @param carrierString
 * @returns
 */
export const shippingMethodMatch = (carrierString: string): Carrier => {
    const carrierLowercase = carrierString.toLowerCase();
    if (carrierLowercase.includes("dpd")) return Carrier.DPD;
    if (carrierLowercase.includes("dhl")) return Carrier.DHL;
    if (carrierLowercase.includes("ups")) return Carrier.UPS;
    if (carrierLowercase.includes("abholung")) return Carrier.PICKUP;
    if (carrierLowercase.includes("pickup")) return Carrier.PICKUP;
    if (carrierLowercase.includes("hermes")) return Carrier.HERMES;
    if (carrierLowercase.includes("usps")) return Carrier.USPS;
    if (carrierLowercase.includes("fedex")) return Carrier.FEDEX;
    if (carrierLowercase.includes("bulk")) return Carrier.BULK;
    return Carrier.UNKNOWN;
};
