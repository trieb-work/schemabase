import { PrismaClient } from "@eci/data-access/prisma"
import { GoogleOAuthConfig } from "./setup/googleOAuth"
import { RedisConfig } from "./setup/redis"
import { ElasticSearchConfig } from "./setup/elasticSearch"
import { Logger } from "./setup/logger"
import { BrainTree } from "./setup/braintree"
import { Zoho } from "./setup/zoho"
import { Sentry } from "./setup/sentry"

export type Context = {
  prisma?: PrismaClient
  googleOAuth?: GoogleOAuthConfig
  redis?: RedisConfig
  elasticSearch?: ElasticSearchConfig
  logger?: Logger
  braintree?: BrainTree
  zoho?: Zoho
  sentry?: Sentry
}


type RequiredKeys<Keys extends keyof Context> = Context & Required<Pick<Context,Keys>>

/**
 * A function that initializes an integration or otherwise inserts something into the context.
 *
 * This allows a fully typed experience.
 *
 * @example
 * ```
 *  const extendContext: ExtendContextFn<"newField"> = async (ctx) => {
 *    return { newField: "abc" }
 * }
 * ```
 *
 */
export type ExtendContextFn<K extends keyof Context> = (
  ctx: Context,
) => Promise<RequiredKeys<K>>

/**
 * Convenience function to batch multiple setup functions together
 */
export async function createContext<Keys extends keyof Context>( 
  ...extendContext: ExtendContextFn<any>[]
): Promise<RequiredKeys<Keys>> {
  let ctx = {} as Context

  extendContext.forEach(async (extend) => {
    ctx =   await extend(ctx)
  })

  return ctx as RequiredKeys<Keys>
}
