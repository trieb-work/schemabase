import { z } from "zod";
import { env } from "@eci/pkg/env";
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
  ctx.logger.info("Saleor app manifest requested");

  const baseUrl = env.require("ECI_BASE_URL");

  const manifest = {
    id: "triebwork.eci",
    version: "1.0.0",
    name: "eCommerce Integrations for Saleor",
    about: "ECI is cool",
    permissions: [
      "HANDLE_PAYMENTS",
      "HANDLE_CHECKOUTS",
      "MANAGE_APPS",
      "MANAGE_CHECKOUTS",
      "MANAGE_DISCOUNTS",
      "MANAGE_GIFT_CARD",
      "MANAGE_MENUS",
      "MANAGE_ORDERS",
      "MANAGE_PAGES",
      "MANAGE_PLUGINS",
      "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
      "MANAGE_PRODUCTS",
      "MANAGE_SETTINGS",
      "MANAGE_SHIPPING",
      "MANAGE_STAFF",
      "MANAGE_TRANSLATIONS",
      "MANAGE_USERS",
    ],
    appUrl: "http://localhost:3000/app",
    configurationUrl: `${baseUrl}/saleor/configuration/${tenantId}`,
    tokenTargetUrl: `${baseUrl}/api/saleor/register/${tenantId}`,
    dataPrivacy: "Lorem ipsum",
    dataPrivacyUrl: "http://localhost:3000/app-data-privacy",
    homepageUrl: "https://trieb.work",
    supportUrl: "http://localhost:3000/support",
  };

  ctx.logger.info("Manifest", { manifest });

  res.json(manifest);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET"] },
    request: requestValidation,
  },
});
