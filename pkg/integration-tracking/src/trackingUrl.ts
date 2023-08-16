import { Carrier, Language } from "@eci/pkg/prisma";

export function generateTrackingPortalURL(
  carrier: Carrier,
  language: Language,
  trackingId: string,
): string {
  const languageCode = `${language.toLowerCase()}_${language.toUpperCase()}`;
  const dhlLanguageCode = `${language.toLowerCase()}-${language.toLowerCase()}`;
  const trackingUrls: Record<Carrier, string> = {
    DPD: `https://tracking.dpd.de/status/${languageCode}/parcel/${trackingId}`,
    UNKNOWN: "",
    UPS: "",
    DHL: `https://www.dhl.com/${dhlLanguageCode}/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingId}`,
    HERMES: "",
    PICKUP: "",
    FEDEX: "",
    USPS: "",
    BULK: "",
  };
  return trackingUrls[carrier];
}
