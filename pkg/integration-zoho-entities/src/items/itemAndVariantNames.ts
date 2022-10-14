/**
 * Zoho does not have a clean product naming schema for product and variant name.
 * We use our own schema like this: Productname - Variant Name
 *
 */

/**
 * Takes a fullname from Zoho, returns if matched a variant and a product name
 * @param fullname
 * @returns
 */
export const getProductAndVariantName = (
  fullname: string,
): {
  itemName: string;
  variantName: string | undefined;
} => {
  const matched = fullname.match(/^(.*)\s-\s(.*)/);

  if (!matched) return { itemName: fullname, variantName: undefined };

  return { itemName: matched[1], variantName: matched[2] };
};
