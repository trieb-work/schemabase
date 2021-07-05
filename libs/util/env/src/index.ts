import { loadEnv, requireEnv } from "./lib/env"

export const env = {
  get: loadEnv,
  require: requireEnv,
}
