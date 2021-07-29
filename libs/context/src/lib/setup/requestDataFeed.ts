import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

import { NextApiRequest } from "next"

/**
 * Call this function for every API route trigger to configure the ECI tenant that this request is used for. Exposes all needed helper functions

 */
export const setupRequestDataFeed =
  (req: NextApiRequest): ExtendContextFn<"zoho"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }

    // For dynamic pages like productdatafeed, have the CUID in the Query Object
    const cuid = req?.query["cuid"] as unknown as string

    const config = await ctx.prisma.zohoConfig.findFirst({
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
