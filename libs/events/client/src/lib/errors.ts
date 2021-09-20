import { GenericError } from "@eci/util/errors";

export class SignatureError extends GenericError {
  constructor() {
    super("SignatureError", "Signature is invalid");
  }
}
