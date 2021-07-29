import { PrismaClient } from "@eci/data-access/prisma"
import { GoogleOAuthConfig } from "./setup/googleOAuth"
import { RedisConfig } from "./setup/redis"
import { ElasticSearchConfig } from "./setup/elasticSearch"
import { Logger } from "./setup/logger"
import { BrainTree } from "./setup/braintree"
import { Zoho } from "./setup/zoho"
import { RequestDataFeed } from "./setup/requestDataFeed"

export type Context = {
  prisma?: PrismaClient
  googleOAuth?: GoogleOAuthConfig
  redis?: RedisConfig
  elasticSearch?: ElasticSearchConfig
  logger?: Logger
  braintree?: BrainTree
  zoho?: Zoho
  requestDataFeed?: RequestDataFeed
}

/**
 * A function that initializes an integration or otherwise inserts something into the context.
 *
 * This allows a fully typed experience.
 *
 * @example
 * ```
 *  const extendContext: ExtendContextFn<"newField"> = async (ctx) => {
 *    ctx.newField = "abc"
 *    return ctx
 * }
 * ```
 *
 */
export type ExtendContextFn<Key extends keyof Context> = (
  ctx: Context,
) => Promise<Context & Pick<Context, Key>>

/**
 * Convenience function to batch multiple setup functions together
 */
export async function newContext<Keys extends keyof Context>(
  ...extendContext: ExtendContextFn<Keys>[]
): Promise<Context & Pick<Context, Keys>> {
  let ctx = {} as Context

  extendContext.forEach(async (extend) => {
    ctx = await extend(ctx)
  })

  return ctx
}
