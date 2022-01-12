import { describe, expect, it } from "@jest/globals";
import { Signer } from "./signature";

const testCases: { name: string; message: unknown; signature: string }[] = [
  {
    name: "objects",
    message: {
      hello: "world",
    },
    signature:
      "2677ad3e7c090b2fa2c0fb13020d66d5420879b8316eb356a2d60fb9073bc778",
  },
  {
    name: "strings",
    message: "I am a string",
    signature:
      "61185ff480c83442fd597f087be0b9b17829f3753bf5c676ad3fec162d59543d",
  },
  {
    name: "numbers",
    message: 123,
    signature:
      "77de38e4b50e618a0ebb95db61e2f42697391659d82c064a5f81b9f48d85ccd5",
  },
  {
    name: "booleans",
    message: false,
    signature:
      "6a20f9fc3e1489885684d050218266e98e8a932c8ebe27cfbf97ca05f992c5dd",
  },
  {
    name: "arrays",
    message: ["no", 1, true],
    signature:
      "41f423075c35fa8026b88912a98ab56950efd6279527c38d9aba82b18e8dc89a",
  },
];
const signer = new Signer({ signingKey: "secret" });

describe("sign()", () => {
  for (const tc of testCases) {
    it(`should create the correct signature for ${tc.name}`, () => {
      const signature = signer.sign(tc.message);
      expect(signature).toEqual(tc.signature);
    });
  }
});

describe("verify()", () => {
  describe("when the signature is correct", () => {
    for (const tc of testCases) {
      it(`should pass for ${tc.name}`, () => {
        expect(() => signer.verify(tc.message, tc.signature)).not.toThrow();
      });
    }
  });

  describe("when the signature does not match", () => {
    it("should throw", () => {
      expect(() =>
        signer.verify("hello", "wrongSignature"),
      ).toThrowErrorMatchingInlineSnapshot(
        '"Signature is invalid, got: 6ae6caf33c4be33bbf6c699b171bd8c2b85b56778c99a425d0f41461f08fe222, expected: wrongSignature"',
      );
    });
  });
});
