import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  message: "m",

  trace: "tr",
  secretKey: "sk",
  publicKey: "pk",
  /**
   * Only used in automatic tests
   */
  test: "test",
};

export const id = new IdGenerator(prefixes);
