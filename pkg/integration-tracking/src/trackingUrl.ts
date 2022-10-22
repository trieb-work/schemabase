import { Carrier, Language } from "@eci/pkg/prisma";

export function generateTrackingPortalURL(
  carrier: Carrier,
  language: Language,
  trackingId: string,
): string {
  const languageCode = `${language.toLowerCase()}_${language.toUpperCase()}`;
  const trackingUrls: Record<Carrier, string> = {
    DPD: `https://tracking.dpd.de/status/${languageCode}/parcel/${trackingId}`,
    UNKNOWN: "",
    UPS: "",
    DHL: `https://www.dhl.com/${languageCode}/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingId}`,
  };
  return trackingUrls[carrier];
}
