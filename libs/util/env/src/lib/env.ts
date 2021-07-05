import { EnvironmentVariableNotFoundError } from "@eci/util/errors"
/**
 * Load an environment variable.
 * Returns the fallback if not found.
 */
export function loadEnv(key: string, fallback?: string): string | undefined {
  const value = process.env[key]
  return value ?? fallback
}

/**
 * Load an environment variable or throw an error if not found.
 */
export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new EnvironmentVariableNotFoundError(key)
  }
  return value
}
