import { GenericError } from "./base";

export class EnvironmentVariableNotFoundError extends GenericError {
  /**
   * @param name - The name of the environment variable
   */
  constructor(name: string) {
    super(
      "EnvironmentNotFoundError",
      `Environment variable "${name}" not found.`,
      {},
    );
  }
}
