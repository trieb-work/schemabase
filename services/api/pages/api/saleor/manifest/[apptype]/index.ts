import { z } from "zod";
import { env } from "@eci/pkg/env";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { AppManifest } from "@saleor/app-sdk/types";
const requestValidation = z.object({
  query: z.object({
    tenantId: z.string().optional(),
    apptype: z.enum(["sync", "prepayment"]),
  }),
});

/**
 * Return an app manifest including the tenantId
 * TODO: we should offer different manifests for different services.
 * Following different apps:
 * Orders / Users / Shipments -> apptype "sync"
 * Payment Gateway pre-payment -> apptype "prepayment"
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext: ctx,
  req,
  res,
}): Promise<void> => {
  const {
    query: { tenantId, apptype },
  } = req;
  ctx.logger = ctx.logger.with({ tenantId });
  ctx.logger.info(`Saleor app manifest requested. App type: ${apptype}`);
  console.log(req)

  const baseUrl = env.require("ECI_BASE_URL");

  const manifest: AppManifest = {
    id: "schemabase",
    version: "0.1.0",
    name: "schemabase",
    about: "ECI is cool",
    author: "trieb.work OHG",
    permissions: [
      "HANDLE_PAYMENTS",
      "HANDLE_CHECKOUTS",
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
