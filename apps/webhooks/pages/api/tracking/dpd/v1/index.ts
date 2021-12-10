import { handleWebhook, Webhook } from "@eci/http";

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<{ body: unknown; method: string }> = async ({
  backgroundContext: ctx,
  req,
  res,
}): Promise<void> => {
  ctx.logger.info("Incoming webhook from dpd", {
    method: req.method,
    body: req.body,
  });

  res.json({
    status: "received",
    traceId: ctx.trace.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET", "POST", "PUT", "OPTIONS"] },
  },
});
