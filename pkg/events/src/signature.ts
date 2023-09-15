import { createHmac } from "crypto";
import { SignatureError } from "./errors";

export interface ISigner {
    sign: (data: unknown) => string;
    verify: (data: unknown, signature: string) => void;
}

export interface SignerConfig {
    signingKey: string;
}

/**
 * Sign and verify json objects
 */
export class Signer implements ISigner {
    /**
     * Secret key used to sign the data.
     */
    private readonly signingKey: string;

    constructor({ signingKey }: SignerConfig) {
        this.signingKey = signingKey;
    }

    /**
     * Create a signature for the given data.
     * @param data - object to be signed
     * @returns
     */
    public sign(data: unknown): string {
        return createHmac("sha256", this.signingKey)
            .update(JSON.stringify(data))
            .digest("hex");
    }

    /**
     * Verify the data was signed by the given signature.
     */
    public verify(data: unknown, expectedSignature: string): void {
        const signature = this.sign(data);
        if (signature !== expectedSignature) {
            throw new SignatureError(signature, expectedSignature);
        }
    }
}
