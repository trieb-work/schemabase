import { Currency } from "@eci/pkg/prisma";

/**
 * Transforms a string to a valid, internal currency. Throws if no match is possible
 * @param val
 * @returns
 */
export function checkCurrency(val: string | null | undefined): Currency {
  if (!val) {
    throw new Error(`Currency is ${val}`);
  }
  const matchingCurrency = Object.values(Currency).find(
    (cur) => cur.toLowerCase() === val.toLowerCase(),
  );
  if (matchingCurrency) {
    return matchingCurrency;
  } else {
    throw new Error(
      `No matching currency found in ${Object.keys(Currency).join(
        ",",
      )} for value ${val}`,
    );
  }
}
