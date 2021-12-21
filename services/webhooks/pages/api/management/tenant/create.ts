import { extendContext, setupPrisma } from "@eci/webhook-context";
import { z } from "zod";
import { id } from "@eci/ids";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    name: z.string(),
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
  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const {
    query: { name },
  } = requestValidation.parse(req);

  const tenant = await ctx.prisma.tenant.create({
    data: {
      id: id.id("publicKey"),
      name,
    },
  });

  ctx.logger.info("New tenant created", { name });
  res.json({
    status: "created",
    traceId: ctx.trace.id,
    tenant: tenant.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
