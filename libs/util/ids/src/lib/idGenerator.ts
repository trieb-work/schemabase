import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  tenant: "t",
  saleorApp: "sa",
  trace: "trace",
  secretKey: "sk",
  publicKey: "pk",
};

export const idGenerator = new IdGenerator(prefixes);
