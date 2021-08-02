import { loadEnv, requireEnv, isProduction } from "./lib/env"

export const env = {
  get: loadEnv,
  require: requireEnv,
  isProduction,
}
