import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  message: "m",

  trace: "tr",
  secretKey: "sk",
  publicKey: "pk",
  event: "evt",
  package: "p",
  email: "em",
  order: "o",
  /**
   * Only used in automatic tests
   */
  test: "test",
  webhook: "wh",
  webhookSecret: "wh_sec",
};

export const id = new IdGenerator(prefixes);
