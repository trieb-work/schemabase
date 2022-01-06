export class EnvironmentVariableNotFoundError extends Error {
  public readonly variableName: string;
  /**
   * @param name - The name of the environment variable.
   */
  constructor(name: string) {
    super(`Environment variable "${name}" not found.`);
    this.variableName = name;
  }
}
/**
 * Load an environment variable.
 * Returns the fallback if not found.
 */
export function getEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] ?? fallback;
}

/**
 * Load an environment variable or throw an error if not found.
 * @throws EnvironmentVariableNotFoundError
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new EnvironmentVariableNotFoundError(key);
  }
  return value;
}
