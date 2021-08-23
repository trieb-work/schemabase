import { GenericError } from "./base";

export class HTTPError extends GenericError {
  public readonly statusCode: number;
  constructor(statusCode: number, message = "HTTPError") {
    super("HTTPError", message, {});
    this.statusCode = statusCode;
  }
}
