import { GenericError } from "./error"

export class HTTPError extends GenericError {
  constructor(message = "Unable to request resource") {
    super("EnvironmentNotFoundError", message, {})
  }
}
