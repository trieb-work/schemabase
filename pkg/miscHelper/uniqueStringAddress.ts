import { normalizeStrings } from "../normalization";

/**
 * Generates the unique identifier for an address object
 * @param param0
 * @returns
 */
const uniqueStringAddress = ({
  street,
  additionalAddressLine,
  plz,
  city,
  countryCode,
  company,
  phone,
  fullname,
}: {
  street: string;
  additionalAddressLine?: string;
  plz: string;
  city: string;
  countryCode: string | undefined;
  company?: string;
  phone?: string;
  fullname: string;
}) => {
  return normalizeStrings.standardNormalize(
    `${fullname}${street}${
      additionalAddressLine ?? ""
    }${plz}${city}${countryCode}${company ?? ""}${phone ?? ""}`,
  );
};

export { uniqueStringAddress };
