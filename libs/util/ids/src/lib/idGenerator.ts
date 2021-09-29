import { IdGenerator } from "@chronark/prefixed-id";

const prefixes = {
  trace: "trace",
  secretKey: "sk",
  publicKey: "pk",
};

export const idGenerator = new IdGenerator(prefixes);
