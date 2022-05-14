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
  };
  return trackingUrls[carrier];
}
