import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

import { NextApiRequest } from "next"
export { Zoho } from "@eci/adapters/zoho"

/**
 * Create a new zoho instance with client client config determined by the
 * incoming `cuid`
 */
export const setupPackageTracker =
  (req: NextApiRequest): ExtendContextFn<"packageTracker"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }

    // For dynamic pages like productdtafeed, have the CUID in the Query Object
    const cuid = req?.query["cuid"] as unknown as string

    const config = await ctx.prisma.findFirst({
      where: { cuid },
    })
    if (!config) {
      throw new Error(`No zoho config found for cuid: ${cuid}`)
    }

    ctx.zoho = await Zoho.new({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      orgId: config.orgId,
    })

    return ctx
  }
