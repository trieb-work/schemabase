import { GenericError } from "./error"

export class HTTPError extends GenericError {
  constructor(message = "Unable to request resource") {
    super("EnvironmentNotFoundError", message, {})
  }
}

export class MissingHTTPHeaderError extends GenericError {
  constructor(header: string) {
    super("MissingHTTPHeaderError", `Request is missing required "${header}" header`, {})
  }
}
export class MissingHTTPBodyError extends GenericError {
  constructor(field: string) {
    super("MissingHTTPBodyError", `Request body is missing required "${field}" field`, {})
  }
}
