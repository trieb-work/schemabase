import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

import { NextApiRequest } from "next"
import { AppConfig } from "@eci/data-access/prisma"

/**
 * Null if config is invalid
 */
export type BrainTree = AppConfig | null

/**
 * Call this function for every API route trigger to configure the ECI tenant
 * that this request is used for. Exposes all needed helper functions
 */
export const w =
  (req: NextApiRequest): ExtendContextFn<"logger"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }
    if (!ctx.elasticSearch) {
      throw new ContextMissingFieldError("elasticSearch")
    }
    if (!ctx.redis) {
      throw new ContextMissingFieldError("redis")
    }
    if (!ctx.logger) {
      throw new ContextMissingFieldError("logger")
    }

    // For dynamic pages like productdtafeed, have the CUID in the Query Object
    const cuid = req?.query["cuid"] as unknown as string

    const currentTentantConfig = await ctx.prisma.appConfig.findFirst({
      where: { zoho: { orgId: cuid } },
    })

    ctx.braintree = currentTentantConfig
    return ctx
  }
