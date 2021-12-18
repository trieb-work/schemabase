import { setupPrisma, extendContext } from "@eci/webhook-context";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/http";

import { id } from "@eci/ids";

const requestValidation = z.object({
  query: z.object({
    logisticsAppId: z.string(),
  }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  const {
    query: { logisticsAppId },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const webhook = await ctx.prisma.incomingLogisticsWebhook.create({
    data: {
      id: id.id("publicKey"),
      logisticsApp: {
        connect: {
          id: logisticsAppId,
        },
      },
    },
  });

  res.json({
    status: "received",
    traceId: ctx.trace.id,
    webhookId: webhook.id,
    path: `/api/zoho/logistics/v1/${webhook.id}`,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
