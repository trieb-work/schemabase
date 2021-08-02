import { ExtendContextFn } from "../context"
import { ContextMissingFieldError } from "@eci/util/errors"

export type RequestDataFeed = {
  valid: boolean
  storefrontProductUrl: string
  variant: "facebookcommerce" | "googlemerchant"
}

export const setupRequestDataFeed =
  (req: { id: string; variant: string }): ExtendContextFn<"requestDataFeed"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma")
    }
    if (!ctx.logger) {
      throw new ContextMissingFieldError("logger")
    }

    const variant = req.variant === "facebookcommerce" ? "facebookcommerce" : "googlemerchant"

    const tenant = await ctx.prisma.tenant.findFirst({
      where: { productdatafeed: { cuid: req.id } },
      include: { productdatafeed: true, saleor: true },
    })
    if (!tenant) {
      throw new Error(`No tenant found in database: ${{ id: req.id }}`)
    }
    const storefrontProductUrl = tenant.productdatafeed?.productDetailStorefrontURL ?? ""

    if (storefrontProductUrl === "") {
      ctx.logger.info(
        "This app has no productDetailStorefrontURL set. Can not generate Productdatafeed",
      )
    }

    const valid = !!tenant.productdatafeed?.active && storefrontProductUrl !== ""

    return { ...ctx, requestDataFeed: { valid, storefrontProductUrl, variant } }
  }
