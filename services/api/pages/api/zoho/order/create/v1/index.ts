import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import {
  authorizeIntegration,
  extendContext,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { HttpError } from "@eci/pkg/errors";
import { id } from "@eci/pkg/ids";
import { Carrier, Language, PackageState } from "@prisma/client";

const payloadValidation = z.object({
  salesorder: z.object({
    salesorder_id: z.string(),
    packages: z.array(
      z.object({
        tracking_number: z.string(),
        carrier: z.string(),
      }),
    ),
  }),
});

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.string(),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
  backgroundContext,
}): Promise<void> => {
  const {
    query: { webhookId },
    body,
  } = req;

  const payload = payloadValidation.parse(
    JSON.parse(decodeURIComponent(body.replace(/^JSONString=/, ""))),
  );
  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const webhook = await ctx.prisma.incomingWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      zohoApp: {
        include: {
          trackingIntegrations: {
            include: {
              subscription: true,
            },
          },
        },
      },
    },
  });

  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { zohoApp } = webhook;
  if (!zohoApp) {
    throw new HttpError(400, "zoho app is not configured");
  }
  const { trackingIntegrations } = zohoApp;
  if (!trackingIntegrations) {
    throw new HttpError(400, "Integration is not configured");
  }

  for (const integration of trackingIntegrations) {
    /**
     * Ensure the integration is enabled and payed for
     */
    authorizeIntegration(integration);

    await ctx.prisma.order.upsert({
      where: {
        externalOrderId: payload.salesorder.salesorder_id,
      },
      update: {},
      create: {
        id: id.id("order"),
        externalOrderId: payload.salesorder.salesorder_id,
        email: "andreas@trieb.work",
        language: Language.DE,
        packages: {
          connectOrCreate: payload.salesorder.packages.map((p) => {
            return {
              where: {
                trackingId: p.tracking_number,
              },
              create: {
                id: id.id("package"),
                trackingId: p.tracking_number,
                carrier: Carrier.DPD,
                state: PackageState.INIT,
                carrierTrackingUrl: "",
                events: [],
              },
            };
          }),
        },
      },
    });
  }
  res.json({
    status: "received",
    traceId: ctx.trace.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET", "OPTIONS"] },
    request: requestValidation,
  },
});
