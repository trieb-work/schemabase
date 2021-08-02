import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

import { NextApiRequest } from "next"

import { BrainTree } from "@eci/adapters/braintree"
export { BrainTree } from "@eci/adapters/braintree"
/**
 * Call this function for every API route trigger to configure the ECI tenant
 * that this request is used for. Exposes all needed helper functions
 */
export const setupBrainTree =
  (req: NextApiRequest): ExtendContextFn<"logger"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
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
      include: { braintree: true },
    })

    const config = currentTentantConfig?.braintree
    if (!config) {
      throw new Error(`No braintree config found for cuid: ${cuid}`)
    }

    ctx.braintree = new BrainTree(config)
    return ctx
  }
