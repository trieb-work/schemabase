import { ExtendContextFn } from "../context"
import { createLogger } from "@eci/util/apm"
import winston from "winston"
import { ContextMissingFieldError } from "@eci/util/errors"

export type Logger = winston.Logger

/**
 * Create a new logger instance
 */
export const getLogger = (): ExtendContextFn<"logger"> => async (ctx) => {
  if (!ctx.elasticSearch) {
    throw new ContextMissingFieldError("elasticSearch")
  }

  const logger = createLogger(ctx.elasticSearch.loggingServer)

  return Object.assign(ctx, {logger})
}
