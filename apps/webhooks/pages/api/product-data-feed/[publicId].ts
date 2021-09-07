import {
  setupPrisma,
  setupSaleor,
  getTenant,
  extendContext,
} from "@eci/context";
import { ProductDataFeedGenerator } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    publicId: z.string(),
    variant: z.enum(["facebookcommerce", "googlemerchant"]),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  const {
    query: { publicId, variant },
  } = req;

  const ctx = await extendContext<"prisma" | "tenant" | "saleor">(
    backgroundContext,
    setupPrisma(),
    getTenant({ where: { productdatafeed: { some: { publicId } } } }),
    setupSaleor({ traceId: backgroundContext.trace.id }),
  );

  ctx.logger.info("Creating new product datafeed");

  const productDataFeed = await ctx.prisma.productDataFeed.findFirst({
    where: { publicId },
  });
  if (!productDataFeed) {
    throw new HttpError(400, `No productDataFeed found in database: ${{ publicId }}`);
  }
  const storefrontProductUrl =
    productDataFeed?.productDetailStorefrontURL ?? "";

  if (
    !productDataFeed ||
    !productDataFeed.enabled ||
    storefrontProductUrl === ""
  ) {
    throw new HttpError(500, "Can not generate Productdatafeed");
  }

  const generator = new ProductDataFeedGenerator({
    saleorClient: ctx.saleor.client,
    channelSlug: ctx.saleor.config.channelSlug,
  });

  const products = await generator.generateCSV(storefrontProductUrl, variant);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=productdatafeed-${md5(products)}.csv`,
  );
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  res.send(products);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET"] },
    request: requestValidation,
  },
});
