import { Carrier, CountryCode } from "@eci/pkg/prisma";

/**
 * Generates a tracking portal URL for different carriers and countries.
 * @param carrier
 * @param countryCode
 * @param trackingCode
 * @param zip
 */
export const generateTrackingPortalURL = (
  carrier: Carrier,
  countryCode: CountryCode,
  trackingCode: string,
  zip: string,
) => {
  const patterns: any = {
    DE: {
      DPD: `https://my.dpd.de/redirect.aspx?action=1&pno=${trackingCode}&zip=${zip}&lng=De_de`,
    },
    CH: {
      DPD: `https://www.dpdgroup.com/ch/mydpd/tmp/basicsearch?parcel_id=${trackingCode}`,
    },
    AT: {
      DPD: `https://www.mydpd.at/meine-pakete?pno=${trackingCode}`,
    },
    ES: {
      DPD: `https://www.seur.com/livetracking/?segOnlineIdentificador=${trackingCode}&segOnlineIdioma=es`,
    },
    FR: {
      DPD: `https://www.dpd.fr/trace/${trackingCode}`,
    },
    NO: {
      DPD: `https://tracking.postnord.com/no/?id=${trackingCode}`,
    },
    UK: {
      DPD: `https://apis.track.dpd.co.uk/v1/track?parcel=${trackingCode}`,
    },
    BE: {
      DPD: `https://www.dpdgroup.com/be/mydpd/tmp/basicsearch?parcel_id=${trackingCode}`,
    },
    NL: {
      DPD: `https://tracking.dpd.de/status/nl_NL/parcel/${trackingCode}`,
    },
  };

  const returnUrl = countryCode
    ? patterns?.[countryCode]?.[carrier]
    : null || null;

  return returnUrl as string | null;
};
