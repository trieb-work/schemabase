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

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
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
  const webhook = await ctx.prisma.incomingStrapiWebhook.create({
    data: {
      id: idGenerator.id("publicKey"),
      strapiApp: {
        connect: {
          id: strapiId,
        },
      },
      secret: {
        create: {
          id: idGenerator.id("publicKey"),
          secret: createHash("256").update(secret).digest("hex"),
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
