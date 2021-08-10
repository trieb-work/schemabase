import { MissingHTTPHeaderError } from "@eci/util/errors";
import { NextApiRequest } from "next";

/**
 * Utility function to extract a header from a request.
 *
 */
export function getHeader<T = string>(req: NextApiRequest, key: string): T {
  const value = req.headers[key] as unknown as T | undefined;
  if (!value) {
    throw new MissingHTTPHeaderError(key);
  }
  return value;
}
