import { GenericError } from "./base";

export class ContextMissingFieldError extends GenericError {
  /**
   * @param missingField - The name field that was not set up properly before.
   */
  constructor(missingField: string) {
    super(
      "ContextMissingFieldError",
      `The context is missing a required field: ${missingField}. Is the context set up in the correct order?`,
      {},
    );
  }
}
