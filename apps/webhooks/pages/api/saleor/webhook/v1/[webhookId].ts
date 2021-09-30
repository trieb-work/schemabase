import { setupPrisma, extendContext } from "@eci/context";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
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
    query: { webhookId },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  ctx.logger.info(`Incoming saleor webhook: ${webhookId}`);
  const webhook = await ctx.prisma.incomingSaleorWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      secret: true,
    },
  });

  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  ctx.logger.info("Received saleor webhook");

  res.send(req);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
