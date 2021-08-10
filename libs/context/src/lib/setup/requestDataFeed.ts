import { ExtendContextFn } from "../context";
import { ContextMissingFieldError } from "@eci/util/errors";

export type RequestDataFeed = {
  valid: boolean;
  storefrontProductUrl: string;
  variant: "facebookcommerce" | "googlemerchant";
};

export const setupRequestDataFeed =
  (req: {
    publicId: string;
    variant: string;
  }): ExtendContextFn<"requestDataFeed"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma");
    }
    if (!ctx.logger) {
      throw new ContextMissingFieldError("logger");
    }

    const variant =
      req.variant === "facebookcommerce"
        ? "facebookcommerce"
        : "googlemerchant";

    const productDataFeed = await ctx.prisma.productDataFeed.findFirst({
      where: { publicId: req.publicId },
    });
    if (!productDataFeed) {
      throw new Error(
        `No productDataFeed found in database: ${{ publicId: req.publicId }}`,
      );
    }
    const storefrontProductUrl =
      productDataFeed?.productDetailStorefrontURL ?? "";

    if (storefrontProductUrl === "") {
      ctx.logger.info(
        "This app has no productDetailStorefrontURL set. Can not generate Productdatafeed",
      );
    }

    const valid = !!productDataFeed?.active && storefrontProductUrl !== "";

    return {
      ...ctx,
      requestDataFeed: { valid, storefrontProductUrl, variant },
    };
  };
