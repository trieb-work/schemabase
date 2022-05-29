import { encryptString, decryptString } from "@47ng/cloak";

class Encrypt {
  private readonly secretKey: string;

  constructor() {
    if (!process.env.SECRET_KEY)
      throw new Error("Env variable SECRET_KEY not found!");
    this.secretKey = process.env.SECRET_KEY;
  }

  public encrypt(string: string) {
    return encryptString(string, this.secretKey);
  }

  public decrypt(string: string) {
    return decryptString(string, this.secretKey);
  }
}
export const krypto = new Encrypt();
