import { isProduction, loadEnv, requireEnv } from "./lib/env";

export const env = {
  isProduction,
  get: loadEnv,
  require: requireEnv,
};
