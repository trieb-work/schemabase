import { ContextMissingFieldError, ExtendContextFn } from "../context"
import { createLogger } from "@eci/util/apm"
import winston from "winston"
export type Logger = winston.Logger

/**
 * Fetch the client's configuration and expose it to the context
 */
export const getLogger = (): ExtendContextFn<"logger"> => async (ctx) => {
  if (!ctx.elasticSearch) {
    throw new ContextMissingFieldError("elasticSearch")
  }

  ctx.logger = createLogger(ctx.elasticSearch.loggingServer)

  return ctx
}
