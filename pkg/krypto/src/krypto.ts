import { encryptString, decryptString } from "@47ng/cloak";
import { env } from "@eci/pkg/env";

class Encrypt {
    private readonly secretKey: string;

    constructor(secretKey?: string) {
        env.get("SECRET_KEY");
        this.secretKey = secretKey || env.get("SECRET_KEY") || "";
    }

    private checkSecretKey(secretKey?: string) {
        if (!secretKey && !this.secretKey && this.secretKey.length <= 0) {
            throw new Error(
                "Secret Key not found! Set via env variable SECRET_KEY or as function argument",
            );
        }
    }

    public async encrypt(string: string, secretKey?: string) {
        this.checkSecretKey(secretKey);
        return encryptString(string, secretKey || this.secretKey);
    }

    public async decrypt(string: string, secretKey?: string) {
        this.checkSecretKey(secretKey);
        return (
            await decryptString(string, secretKey || this.secretKey)
        ).trim();
    }
}
/**
 * Encrypt and Decrypt strings. The used secretKey can be set via argument or env variable
 * SECRET_KEY. Generate a Secret key (master key) with the cloak package: "pnpm cloak generate"
 */
export const krypto = new Encrypt();
