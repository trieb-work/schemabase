type TaxIdentifier = "tax_rate" | "tax_percentage";
/**
 * This function takes all saleor orderlines and calculates the corresponding taxrate for the shipping costs.
 * Always the highest tax rate of all order lines is the shipping cost tax rate
 * @param {array} lines Saleor Orderline with field tax_rate
 */
export function calculateShippingTaxRate(
  lines: { tax_rate?: string; tax_percentage?: number }[],
  identifier: TaxIdentifier,
) {
  const parsedLines = lines.map((line) => {
    switch (identifier) {
      case "tax_rate":
        const tax = line[identifier];
        if (typeof tax === "undefined") {
          throw new Error(`${line} does not have an attribute "${identifier}"`);
        }
        return parseInt(tax, 10);
      case "tax_percentage":
        return line.tax_percentage;
    }
  });
  const max = Math.max(...(parsedLines as number[]));
  if (!Number.isInteger(max)) {
    throw new Error(`${max} is not an integer`);
  }
  return max;
}
