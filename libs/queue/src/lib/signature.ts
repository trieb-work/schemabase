import { createHmac, randomUUID } from "crypto";
import { env } from "@chronark/env";
import { Logger } from "@eci/util/logger";

/**
 * Sign and verify json objects
 */
export class Signer {
  /**
   * Secret key used to sign the data.
   */
  private readonly signingKey: string;

  constructor(logger: Logger) {
    if (env.get("NODE_ENV") === "production") {
      this.signingKey = env.require("SIGNING_KEY");
    } else {
      logger.warn(
        "Using generated signing key. In production you need to provide the `SIGNING_KEY` env variable",
      );
      this.signingKey = randomUUID();
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
    return createHmac("sha512", this.signingKey)
      .update(this.serialize(data))
      .digest("hex");
  }

  /**
   * Verify the data was signed by the given signature.
   */
  public verify(data: unknown, expectedSignature: string): boolean {
    const signature = this.sign(data);
    return signature === expectedSignature;
  }
}
