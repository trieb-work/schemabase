import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  job: "j",
  trace: "tr",
  secretKey: "sk",
  publicKey: "pk",
  /**
   * Only used in automatic tests
   */
  test: "test",
};

export const idGenerator = new IdGenerator(prefixes);
