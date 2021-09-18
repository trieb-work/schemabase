import { GenericError } from "./base";

/**
 * HttpError is used to pass a status code inside nextjs api routes.
 */
export class HttpError extends GenericError {
  public readonly statusCode: number;
  constructor(statusCode: number, message = "HttpError") {
    super("HttpError", message);
    this.statusCode = statusCode;
  }
}
