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
  return Carrier.UNKNOWN;
};
