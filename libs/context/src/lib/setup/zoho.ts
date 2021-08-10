import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

import { NextApiRequest } from "next"
import { Zoho } from "@eci/adapters/zoho"
export type { Zoho } from "@eci/adapters/zoho"

/**
 * Create a new zoho instance with client client config determined by the
 * incoming `cuid`
 */
export const setupZoho =
  (req: NextApiRequest): ExtendContextFn<"zoho"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }

    // For dynamic pages like productdtafeed, have the CUID in the Query Object
    const cuid = req?.query["cuid"] as unknown as string

    const config = await ctx.prisma.zohoConfig.findFirst({
      where: { cuid },
    })
    if (!config) {
      throw new Error(`No zoho config found for cuid: ${cuid}`)
    }

    const zoho = await Zoho.new({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      orgId: config.orgId,
    })

    return { ...ctx, zoho }
  }
