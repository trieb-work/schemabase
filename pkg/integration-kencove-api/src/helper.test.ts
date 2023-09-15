/// test the helper function htmlDecode. Send a string with html encoded characters
// and expect a string with decoded characters.
// send a regular string, expect the same string back

import { htmlDecode } from "./helper";
import { describe, it, expect } from "@jest/globals";

describe("htmlDecode", () => {
    it("should return the same string if no html encoded characters are present", () => {
        const input = "test string";
        const output = htmlDecode(input);
        expect(output).toBe(input);
    });
    it("should return a decoded string if html encoded characters are present", () => {
        const input = "test &amp; string";
        const output = htmlDecode(input);
        expect(output).toBe("test & string");
    });
});
