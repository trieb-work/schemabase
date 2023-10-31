/**
 * Parse a boolean value. Returns undefined, if not able to cast
 * @param input
 * @returns
 */
const parseBoolean = (input: string | boolean | unknown) => {
    switch (input) {
        case "true" || true || "True" || "TRUE":
            return true;
        case "false" || false || "False" || "FALSE":
            return false;
        default:
            return undefined;
    }
};
export { parseBoolean };
