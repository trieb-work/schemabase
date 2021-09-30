import {
  setupPrisma,
  extendContext,
  newSaleorClient,
  authorizeIntegration,
} from "@eci/context";
import { ProductDataFeedGenerator } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
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
    query: { webhookId, variant },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const webhook = await ctx.prisma.incomingProductDataFeedWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      secret: true,
      productDataFeedApp: {
        include: {
          integration: {
            include: { subscription: true, saleorApp: true },
          },
        },
      },
    },
  });

  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }
  const { productDataFeedApp } = webhook;
  if (!productDataFeedApp) {
    throw new HttpError(400, "productDataFeedApp is not configured");
  }
  const { integration } = productDataFeedApp;
  if (!integration) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  ctx.logger.info("Creating new product datafeed");

  const { saleorApp } = integration;

  if (!saleorApp.channelSlug) {
    throw new HttpError(
      500,
      `Saleor app does not have a channel configured: ${saleorApp}`,
    );
  }

  const saleorClient = newSaleorClient(ctx, saleorApp.domain);
  const generator = new ProductDataFeedGenerator({
    saleorClient,
    channelSlug: saleorApp.channelSlug,

    logger: ctx.logger.with({
      saleor: { domain: saleorApp.domain, channel: saleorApp.channelSlug },
    }),
  });

  const products = await generator.generateCSV(
    productDataFeedApp.productDetailStorefrontURL,
    variant,
  );

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
