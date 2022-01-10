import { handleWebhook, Webhook } from "@eci/pkg/http";
import { z } from "zod";

const requestValidation = z.any();

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext: ctx,
  req,
  res,
}): Promise<void> => {
  ctx.logger.info("Incoming webhook from zoho", {
    req,
  });

  res.json({
    status: "received",
    traceId: ctx.trace.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
  },
});
