import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

export type ElasticSearchConfig = {
  apmServer: string
  apmSecretToken: string
  loggingServer: string
}

/**
 * Fetch the client's configuration and expose it to the context
 */
export const getElasticConfig = (): ExtendContextFn<"elasticSearch"> => async (ctx) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma")
  }

  const config = await ctx.prisma.elasticConfig.findFirst({ where: { id: 1 } })
  if (!config) {
    throw new Error("Unable to find elastic config from database")
  }

  return {elasticSearch: {
    apmServer: config.apmServer,
    apmSecretToken: config.apmSecretToken,
    loggingServer: config.loggingServer,
  }}
}
