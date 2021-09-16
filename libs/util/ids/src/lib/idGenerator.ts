import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  tenant: "t",
  saleorApp: "sa",
  trace: "trace",
};

export const idGenerator = new IdGenerator(prefixes);
