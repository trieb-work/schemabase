import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"
export type RedisConfig = {
  host: string
  password: string
  port: number
}

/**
 * Fetch the client's configuration and expose it to the context
 */
export const getRedisConfig = (): ExtendContextFn<"redis"> => async (ctx) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma")
  }

  const config = await ctx.prisma.redisConfig.findFirst({ where: { id: 1 } })
  if (!config) {
    throw new Error("Unable to find redis config from database")
  }

  const redis = {
    host: config.host,
    password: config.password,
    port: config.port,
  }
  return { ...ctx, redis }
}
