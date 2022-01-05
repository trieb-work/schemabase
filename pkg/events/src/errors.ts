import { GenericError } from "@eci/pkg/errors";

export class SignatureError extends GenericError {
  constructor(got: string, expected: string) {
    super(
      "SignatureError",
      `Signature is invalid, got: ${got}, expected: ${expected}`,
    );
  }
}
