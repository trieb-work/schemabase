import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  tenant: "t",
  saleorApp: "sa",
  trace: "trace",
  request: "req",
};

export const idGenerator = new IdGenerator(prefixes);
