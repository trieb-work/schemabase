class NormalizationUtility {
    /**
     * Removes whitespace, trim, lowercase, remove special characters
     * @param input
     */
    public standardNormalize(input: string) {
        return input
            .trim()
            .toLowerCase()
            .replace(/\s/g, "")
            .replace(/[^a-zA-Z0-9]/g, "");
    }

    /**
     * Normalize Product Names
     * @param input
     * @returns
     */
    public productNames(input: string) {
        return this.standardNormalize(input);
    }

    public itemSKU(input: string) {
        return input.replace(/\s*/, "");
    }

    /**
     * Normalize Company Names
     * @param input
     * @returns
     */
    public companyNames(input: string) {
        return this.standardNormalize(input);
    }

    public warehouseNames(input: string) {
        return this.standardNormalize(input);
    }

    public taxNames(input: string) {
        return this.standardNormalize(input);
    }

    public lineItemStrings(input: string) {
        return input.trim().toLowerCase();
    }

    /**
     * normalization for attribute names
     */
    public attributeNames(input: string) {
        return this.standardNormalize(input);
    }

    /**
     * Normalize category names
     */
    public categoryNames(input: string) {
        return this.standardNormalize(input);
    }

    /**
     * Normalize product type names
     * @param input
     */
    public productTypeNames(input: string) {
        return this.standardNormalize(input);
    }

    /**
     * Normalize attribute values. Attribute value
     * reduced to 150 characters
     * @param input
     */
    public attributeValueNames(input: string) {
        return this.standardNormalize(input).slice(0, 150);
    }

    public channelNames(input: string) {
        return this.standardNormalize(input);
    }
}

/**
 * Normalize strings for different lookup reasons.
 */
export const normalizeStrings = new NormalizationUtility();
