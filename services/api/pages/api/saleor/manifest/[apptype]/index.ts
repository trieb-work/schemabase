import { z } from "zod";
import packageJson from "../../../../../../../package.json";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { AppManifest } from "@saleor/app-sdk/types";
import { IncomingHttpHeaders } from "http";
import { getBaseUrl } from "@eci/services/api/lib/getBaseUrl";
import { prepayment } from "@eci/services/api/lib/manifests/prepayment";
import { entitysync } from "@eci/services/api/lib/manifests/entitysync";
const requestValidation = z.object({
  headers: z.any(),
  query: z.object({
    tenantId: z.string().optional(),
    /**
     * The schemabase saleor app type - we install individual
     * apps for different saleor use-cases
     */
    apptype: z.enum(["entitysync", "prepayment"]),
  }),
});

/**
 * Return an app manifest including the tenantId
 * Following different apps:
 * Orders / Users / Shipments -> apptype "entitysync"
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

  const { host, "x-forwarded-proto": protocol = "http" } =
    req.headers as IncomingHttpHeaders;

  ctx.logger.debug(
    `Middleware called with host: ${host}, protocol ${protocol}`,
  );

  const baseUrl = getBaseUrl(req.headers);

  const activeManifestType = apptype === "entitysync" ? entitysync : prepayment;

  const manifest: AppManifest = {
    id: `schemabase-${apptype}`,
    version: packageJson.version,
    name: activeManifestType.getName(),
    about:
      "schemabase is your e-commerce datahub, powering the world of composable commerce",
    author: "trieb.work OHG",
    permissions: activeManifestType.getPermissions(),
    appUrl: baseUrl,
    configurationUrl: baseUrl,
    tokenTargetUrl: `${baseUrl}/api/saleor/register?tenantId=${tenantId ?? ""}`,
    dataPrivacyUrl: "https://trieb.work/privacy-policy",
    homepageUrl: "https://trieb.work",
    supportUrl: "https://trieb.work/contact",
    webhooks: activeManifestType.getWebhookManifest(baseUrl),
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
