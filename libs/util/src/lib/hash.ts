import { createHash } from "crypto";

export function sha256(obj: unknown): string {
  return createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}
