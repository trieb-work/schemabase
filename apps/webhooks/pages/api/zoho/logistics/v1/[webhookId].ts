import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/http";
import { authorizeIntegration, extendContext, setupPrisma } from "@eci/context";
import { HttpError } from "@eci/util/errors";
import { LogisticStats } from "@eci/integrations/zoho/logistics";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  method: z.string(),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
  backgroundContext,
}): Promise<void> => {
  const {
    query: { webhookId },
    method,
  } = req;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  // pre-flight requests get return
  if (method.toUpperCase() === "OPTIONS") return res.end();

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const webhook = await ctx.prisma.incomingLogisticsWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      logisticsApp: {
        include: {
          integration: {
            include: {
              subscription: true,
              zohoApp: true,
            },
          },
        },
      },
    },
  });

  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { logisticsApp } = webhook;
  if (!logisticsApp) {
    throw new HttpError(400, "strapi app is not configured");
  }
  const { integration } = logisticsApp;
  if (!integration) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  const zohoApp = webhook.logisticsApp?.integration?.zohoApp;

  if (!zohoApp) {
    throw new HttpError(400, "Zoho connection not enabled");
  }

  const zoho = new ZohoClientInstance({
    zohoClientId: zohoApp.clientId,
    zohoClientSecret: zohoApp.clientSecret,
    zohoOrgId: zohoApp.orgId,
  });
  const customFields = {
    currentOrdersReadyToFulfill: webhook.logisticsApp.currentOrdersCustomViewId,
    nextFiveDaysOrders: webhook.logisticsApp.nextFiveDaysBulkOrdersCustomViewId,
    currentBulkOrders: webhook.logisticsApp.currentBulkOrdersCustomViewId,
    nextFiveDaysBulkOrders:
      webhook.logisticsApp.nextFiveDaysBulkOrdersCustomViewId,
  };
  const handleRequest = await LogisticStats.new({
    zoho,
    logger: ctx.logger,
    customFields,
  });

  const responseData = await handleRequest.getCurrentPackageStats();

  const now = new Date().getHours();
  const cacheMaxAge = now >= 8 && now <= 17 ? 900 : 3600;

  res.setHeader(
    "Cache-Control",
    `s-maxage=${cacheMaxAge}, stale-while-revalidate`,
  );

  res.json(responseData);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET", "OPTIONS"] },
    request: requestValidation,
  },
});
