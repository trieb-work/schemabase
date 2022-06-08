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
  lineItem: "li",
  contact: "c",
  invoice: "i",
  tax: "tx",
  payment: "p",
  /**
   * Product Variant
   */
  variant: "pro_v",
  product: "pro",
  company: "com",
  warehouse: "wrh",
  /**
   * Only used in automatic tests
   */
  test: "test",
  webhook: "wh",
  webhookSecret: "wh_sec",
};

export const id = new IdGenerator(prefixes);
