import {
  authorizeIntegration,
  extendContext,
  newSaleorClient,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { ProductDataFeedGenerator } from "@eci/pkg/integration-saleor-product-data-feed";
import { createHash } from "crypto";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
    variant: z.enum(["facebookcommerce", "googlemerchant"]),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and
 * their attributes in your shop.
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

  const webhook = await ctx.prisma.incomingWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      productDataFeedApp: {
        include: {
          integration: {
            include: { subscription: true, installedSaleorApp: true },
          },
        },
      },
    },
  });

  if (webhook == null) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }
  const { productDataFeedApp } = webhook;
  if (productDataFeedApp == null) {
    throw new HttpError(400, "productDataFeedApp is not configured");
  }
  const { integration } = productDataFeedApp;
  if (integration == null) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  ctx.logger.info("Creating new product datafeed");

  const { installedSaleorApp } = integration;

  if (!installedSaleorApp)
    throw new HttpError(400, "Installed Saleor App is not configured");

  if (!installedSaleorApp.channelSlug) {
    throw new HttpError(
      500,
      `Saleor app does not have a channel configured: ${installedSaleorApp}`,
    );
  }

  const saleorClient = newSaleorClient(ctx, installedSaleorApp.domain);
  const generator = new ProductDataFeedGenerator({
    saleorClient,
    channelSlug: installedSaleorApp.channelSlug,

    logger: ctx.logger.with({
      saleor: {
        domain: installedSaleorApp.domain,
        channel: installedSaleorApp.channelSlug,
      },
    }),
  });

  const products = await generator.generateCSV(
    productDataFeedApp.productDetailStorefrontURL,
    variant,
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=productdatafeed-${createHash("md5")
      .update(products)
      .digest("hex")}.csv`,
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
