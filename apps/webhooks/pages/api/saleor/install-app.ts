import { z } from "zod";
import { SaleorService } from "@eci/adapters/saleor";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  body: z.object({
    saleorUrl: z.string().url(),
    token: z.string(),
    tenantId: z.string().uuid(),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
}): Promise<void> => {
  const {
    body: { saleorUrl, token, tenantId },
  } = req;
  backgroundContext.logger.info("installing new app");
  const saleorClient = new SaleorService({
    traceId: backgroundContext.trace.id,
    graphqlEndpoint: saleorUrl,
    token,
  });
  await saleorClient.installApp(tenantId);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
