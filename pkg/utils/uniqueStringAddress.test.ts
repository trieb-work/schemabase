import { uniqueStringAddress } from "./uniqueStringAddress";
import { test, expect } from "@jest/globals";

test("It should work to generate a unique string for an address object", () => {
    const response = uniqueStringAddress({
        fullname: "Jannili Zinfl",
        street: "Terststraße 22",
        plz: "05693",
        city: "Teststadt",
        countryCode: "DE",
    });
    expect(response).toBe("jannilizinflterststrae2205693teststadtde");
});
