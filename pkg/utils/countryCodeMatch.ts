import { CountryCode } from "@prisma/client";

/**
 * Match any two letter country code to the ISO 3166-1 alpha-2 standard.
 * Return our internal CountryCode enum.
 * Throws an error if no match is found, or if the input is not a two letter string
 * @param input
 */
const countryCodeMatch = (input: string): CountryCode => {
    const regex = /^[A-Z]{2}$/;
    if (!regex.test(input)) {
        throw new Error(
            `countryCodeMatch: Input ${input} is not a two letter string.`,
        );
    }
    const countryCodeValid = Object.values(CountryCode).includes(input as any);
    if (!countryCodeValid) {
        throw new Error(
            `countryCodeMatch: Input ${input} is not a valid country code.`,
        );
    }
    const countryCode = input.toUpperCase() as CountryCode;
    return countryCode;
};

export { countryCodeMatch };
