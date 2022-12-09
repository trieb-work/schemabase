/**
 * Parse a boolean value. Returns undefined, if not able to cast
 * @param input
 * @returns
 */
const parseBoolean = (input: string | boolean | unknown) => {
  switch (input) {
    case "true" || true:
      return true;
    case "false" || false:
      return false;
    default:
      return undefined;
  }
};
export { parseBoolean };
