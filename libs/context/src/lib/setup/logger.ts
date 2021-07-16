import { ContextMissingFieldError, ExtendContextFn } from "../context"
import { createLogger } from "@eci/util/apm"
import winston from "winston"
export type Logger = winston.Logger

/**
 * Create a new logger instance
 */
export const getLogger = (): ExtendContextFn<"logger"> => async (ctx) => {
  if (!ctx.elasticSearch) {
    throw new ContextMissingFieldError("elasticSearch")
  }

  ctx.logger = createLogger(ctx.elasticSearch.loggingServer)

  return ctx
}
