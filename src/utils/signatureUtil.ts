import * as crypto from "crypto";
export function hash(message: string) {
  const hash = crypto
    .createHmac("sha256", "8gBm/:&EnhH.1/q")
    .update(message)
    .digest("base64");
  return hash;
}
