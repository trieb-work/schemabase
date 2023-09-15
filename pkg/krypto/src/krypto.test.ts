import { describe, test, expect } from "@jest/globals";
import { krypto } from "./krypto";

describe("Test krypto module", () => {
    const secretKey =
        "k1.aesgcm256.xgX2hMLPj4rBWwv-oUrKC_9pjpXPnKCnH4T35KcU-l8=";
    const testString = "Test22";

    let encryptedValue = "";
    test("It should work to encrypt string", async () => {
        const string = await krypto.encrypt(testString, secretKey);

        expect(string).toBeDefined();
        encryptedValue = string;
    });

    test("It should work to decrypt string", async () => {
        const string = await krypto.decrypt(encryptedValue, secretKey);

        expect(string).toBe(testString);
    });
});
