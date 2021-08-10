import { ExtendContextFn } from "../context";
import { createLogger } from "@eci/util/logger";
export type { Logger } from "tslog";

/**
 * Create a new logger instance
 */
export const setupLogger = (): ExtendContextFn<"logger"> => async (ctx) => {
  const logger = createLogger();

  return { ...ctx, logger };
};
