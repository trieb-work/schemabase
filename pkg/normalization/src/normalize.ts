class NormalizationUtility {
  /**
   * Removes whitespace, trim, lowercase, remove special characters
   * @param input
   */
  private standardNormalize(input: string) {
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
}

/**
 * Normalize strings for different lookup reasons.
 */
export const normalizeStrings = new NormalizationUtility();
