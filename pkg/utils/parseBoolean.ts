/**
 * Parse a boolean value. Returns undefined, if not able to cast
 * @param input
 * @returns
 */
const parseBoolean = (input: string | boolean | unknown) => {
    switch (input) {
        case true:
        case "true":
        case "TRUE":
        case "True":
        case "true":
        case "1":
        case 1:
            return true;
        case false:
        case "false":
        case "FALSE":
        case "False":
        case "false":
        case "0":
        case 0:
            return false;

        default:
            return undefined;
    }
};
export { parseBoolean };
