import { extendContext, setupPrisma, setupSaleor } from "@eci/context";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    tenantId: z.string(),
  }),
  headers: z.object({
    "x-saleor-domain": z.string(),
  }),
  body: z.object({
    app_token: z.string(),
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
  try {
    const ctx = await extendContext<"prisma" | "saleor">(
      backgroundContext,
      setupPrisma(),
      setupSaleor({ traceId: backgroundContext.trace.id }),
    );

    const {
      headers: { "x-saleor-domain": domain },
      body: { app_token: appToken },
      query: { tenantId },
    } = req;

    await ctx.prisma.saleorApp.upsert({
      where: { domain },
      update: {},
      create: {
        tenantId,
        name: "",
        domain,
        appToken,
        channelSlug: "",
      },
    });

    res.status(200);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
