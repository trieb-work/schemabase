import { normalizeStrings } from "../normalization";

/**
 * Generates the unique identifier for an address object
 * we can use plz or zip, but not both. We use plz if it exists, otherwise zip
 * @param param0
 * @returns
 */
const uniqueStringAddress = ({
    street,
    additionalAddressLine,
    plz,
    zip,
    city,
    countryCode,
    company,
    phone,
    fullname,
    state,
}: {
    street: string;
    additionalAddressLine?: string | null;
    plz?: string | null;
    zip?: string | null;
    city: string;
    countryCode?: string | null;
    company?: string | null;
    phone?: string | null;
    fullname: string;
    state?: string | null;
}) => {
    return normalizeStrings.standardNormalize(
        `${fullname}${street}${additionalAddressLine ?? ""}${
            plz ?? zip
        }${city}${countryCode ?? ""}${company ?? ""}${phone ?? ""}${
            state ?? ""
        }`,
    );
};

export { uniqueStringAddress };
