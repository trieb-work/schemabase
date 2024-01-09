/**
 * test the parseBoolean function
 */

import { parseBoolean } from "./parseBoolean";
import { test, expect } from "@jest/globals";

test("parseBoolean returns boolean value", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("True")).toBe(true);

    expect(parseBoolean("false")).toBe(false);

    expect(parseBoolean(1)).toBe(true);

    expect(parseBoolean(0)).toBe(false);

    expect(parseBoolean("abc")).toBe(false);
});
