import * as crypto from "crypto";
import config from "../config";
export function hash(message: string) {
  const hash = crypto
    .createHmac("sha256", config.esewsa.secret)
    .update(message)
    .digest("base64");
  return hash;
}
