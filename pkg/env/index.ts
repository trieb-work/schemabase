import { getEnv, requireEnv } from "./src/env";
export { EnvironmentVariableNotFoundError } from "./src/env";

export const env = {
  get: getEnv,
  require: requireEnv,
};
