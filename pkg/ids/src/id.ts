import nodeCrypto from "node:crypto";
import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  message: "m",
  trace: "tr",
  secretKey: "sk",
  publicKey: "pk",
  event: "evt",
  package: "pa",
  email: "em",
  order: "o",
  lineItem: "li",
  packageLineItem: "pli",
  contact: "c",
  invoice: "i",
  tax: "tx",
  payment: "pay",
  paymentMethod: "paym",
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
  stockEntry: "stock_e",
  address: "address",
  /**
   * Xentral Ids
   */
  xentralAuftrag: "x_af",
  xentralArtikel: "x_at",
  billOfMaterial: "bom",
  datevContact: "datev_c",
  attribute: "attr",
  attributeValue: "attr_v",
  category: "cat",
  productType: "pt",
};

export const id = new IdGenerator({ crypto: nodeCrypto, prefixes });
