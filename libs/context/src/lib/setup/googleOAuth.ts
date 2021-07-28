import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

export type GoogleOAuthConfig = {
  clientId: string
  clientSecret: string
}

/**
 * Fetch the client's configuration and expose it to the context
 */
export const getGoogleOAuthConfig = (): ExtendContextFn<"googleOAuth"> => async (ctx) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma")
  }

  const config = await ctx.prisma.googleOAuth.findFirst({ where: { id: 1 } })
  if (!config) {
    throw new Error("Unable to find google oauth config from database")
  }

  ctx.googleOAuth = { clientId: config.clientId, clientSecret: config.clientSecret }
  return ctx
}
