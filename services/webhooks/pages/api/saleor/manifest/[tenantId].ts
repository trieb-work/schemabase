import { z } from "zod";
import { env } from "@chronark/env";
import { handleWebhook, Webhook } from "@eci/pkg/http";
const requestValidation = z.object({
  query: z.object({
    tenantId: z.string(),
  }),
});

/**
 * Return an app manifest including the tenantId
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext: ctx,
  req,
  res,
}): Promise<void> => {
  const {
    query: { tenantId },
  } = req;
  ctx.logger = ctx.logger.with({ tenantId });
  ctx.logger.info("Manifest requested");

  const baseUrl = env.require("ECI_BASE_URL");

  const manifest = {
    id: "triebwork.eci",
    version: "1.0.0",
    name: "eCommerce Integrations for Saleor",
    // eslint-disable-next-line max-len
    about:
      "The trieb.work ECI for saleor is a powerful App used for several services like data synchronisation to Zoho Inventory, Mailchimp, an advanced product data feed etc.. ",
    permissions: [
      "MANAGE_APPS",
      "MANAGE_SHIPPING",
      "MANAGE_PRODUCTS",
      "MANAGE_ORDERS",
      "MANAGE_GIFT_CARD",
      "MANAGE_DISCOUNTS",
      "MANAGE_CHECKOUTS",
      "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
    ],
    appUrl: "http://localhost:3000/app",
    configurationUrl: `${baseUrl}/saleor/configuration/${tenantId}`,
    tokenTargetUrl: `${baseUrl}/api/saleor/register/${tenantId}`,
    dataPrivacy: "Lorem ipsum",
    dataPrivacyUrl: "http://localhost:3000/app-data-privacy",
    homepageUrl: "https://trieb.work",
    supportUrl: "http://localhost:3000/support",
  };

  res.json(manifest);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET"] },
    request: requestValidation,
  },
});
