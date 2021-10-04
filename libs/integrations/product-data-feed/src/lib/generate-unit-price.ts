import { Weight } from "@eci/adapters/saleor/api";

export const generateUnitPrice = (
  variantWeight: Weight,
  productWeight: Weight,
): string | undefined => {
  if (!variantWeight?.value && !productWeight?.value) {
    return undefined;
  }
  return variantWeight?.value
    ? `${variantWeight.value} ${variantWeight.unit}`
    : `${productWeight.value} ${productWeight.unit}`;
};
