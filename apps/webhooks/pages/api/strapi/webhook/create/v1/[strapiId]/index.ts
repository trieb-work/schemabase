import { setupPrisma, extendContext } from "@eci/context";
import { createHash } from "crypto";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/http";

import { idGenerator } from "@eci/util/ids";

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

  const secret = idGenerator.id("secretKey");
  const webhook = await ctx.prisma.incomingWebhook.create({
    data: {
      id: idGenerator.id("publicKey"),
      strapi: {
        connect: {
          id: strapiId,
        },
      },
      secret: {
        create: {
          id: idGenerator.id("publicKey"),
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
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
