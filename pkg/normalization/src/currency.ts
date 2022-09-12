import { Currency } from "@eci/pkg/prisma";

export function checkCurrency(val: string | null): Currency {
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
