import { GenericError } from "./error"

export class EnvironmentVariableNotFoundError extends GenericError {
  /**
   * @param name - The name of the environment variable
   */
  constructor(name: string) {
    super("EnvironmentNotFoundError", `Environment variable "${name}" not found.`, {})
  }
}
