import { NoopLogger } from "@eci/util/logger";
import { Signer } from "./signature";

const testCases: { name: string; message: unknown; signature: string }[] = [
  {
    name: "objects",
    message: {
      hello: "world",
    },
    signature:
      "2e405baa007ec09a02d0b8db166e52596914f89788f2fef1f5e85e8ce88e5a4f",
  },
  {
    name: "strings",
    message: "I am a string",
    signature:
      "7524a1884508acd5e12b5bbf10777484f3c567fcb7a303e2832498ee37621590",
  },
  {
    name: "numbers",
    message: 123,
    signature:
      "90315c4583544dad7ba552b927f150d7ae8d9fa817c919c4216f309aa55038c3",
  },
  {
    name: "booleans",
    message: false,
    signature:
      "71387594c59105dda3f561f058613c49adabc30bb02e1a988eecbcf1cd87a1e2",
  },
  {
    name: "arrays",
    message: ["no", 1, true],
    signature:
      "efa573414426547e2f3eca3bd0984e619b0574cef328a5cd003cbe73ca23f598",
  },
];
const signer = new Signer(new NoopLogger());

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
      ).toThrowErrorMatchingInlineSnapshot(`"Signature is invalid"`);
    });
  });
});
