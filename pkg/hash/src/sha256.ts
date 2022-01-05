import { createHash } from "crypto";

export function sha256(s: unknown): string {
  return createHash("sha256").update(JSON.stringify(s)).digest("hex");
}
