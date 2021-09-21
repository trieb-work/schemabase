import { createHmac } from "crypto";
import { env } from "@chronark/env";
import { ILogger } from "@eci/util/logger";
import { SignatureError } from "./errors";

export interface ISigner {
  sign(data: unknown): string;
  verify(data: unknown, signature: string): void;
}

/**
 * Sign and verify json objects
 */
export class Signer implements Signer {
  /**
   * Secret key used to sign the data.
   */
  private readonly signingKey: string;

  constructor(logger: ILogger) {
    if (env.get("NODE_ENV") === "production") {
      this.signingKey = env.require("SIGNING_KEY");
    } else {
      logger.warn(
        "Using generated signing key. In production you need to provide the `SIGNING_KEY` env variable",
      );
      this.signingKey = "super-secret-key";
    }
  }

  private serialize(data: unknown): string {
    return JSON.stringify(data);
  }
  /**
   * Create a signature for the given data.
   * @param data - object to be signed
   * @returns
   */
  public sign(data: unknown): string {
    return createHmac("sha256", this.signingKey)
      .update(this.serialize(data))
      .digest("hex");
  }

  /**
   * Verify the data was signed by the given signature.
   */
  public verify(data: unknown, expectedSignature: string): void {
    const signature = this.sign(data);
    if (signature !== expectedSignature) {
      throw new SignatureError();
    }
  }
}
