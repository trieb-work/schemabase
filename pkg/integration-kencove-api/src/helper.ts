import { parse } from "node-html-parser";

/**
 * Takes a string, that is html encoded, and returns a decoded string
 * @param input
 * @returns
 */
const htmlDecode = (input: string): string => {
  const doc = parse(input);
  return doc.textContent as string;
};

export { htmlDecode };
