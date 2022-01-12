import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { createHash } from "crypto";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";

import { id } from "@eci/pkg/ids";

const requestValidation = z.object({
  query: z.object({
    strapiId: z.string(),
  }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  const {
    query: { strapiId },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const secret = id.id("secretKey");
  const webhook = await ctx.prisma.incomingWebhook.create({
    data: {
      id: id.id("publicKey"),
      strapiApp: {
        connect: {
          id: strapiId,
        },
      },
      secret: {
        create: {
          id: id.id("publicKey"),
          secret: createHash("sha256").update(secret).digest("hex"),
        },
      },
    },
  });

  res.json({
    status: "received",
    traceId: ctx.trace.id,
    webhookId: webhook.id,
    webhookSecret: secret,
    path: `/api/strapi/webhook/${webhook.id}`,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
