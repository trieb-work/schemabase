import { handleWebhook, Webhook } from "@eci/pkg/http";
import { z } from "zod";

const requestValidation = z.object({
  query: z.object({
    pushid: z.string().optional(),
  }),
  header: z.object({
    "x-real-ip": z.string().optional(),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext: ctx,
  req,
  res,
}): Promise<void> => {
  const {
    query: { pushid },
  } = req;

  ctx.logger.info("Incoming webhook from dpd", {
    ip: req.header["x-real-ip"],
    pushid,
  });

  if (pushid) {
    res.setHeader("Content-Type", "application/xml");
    res.send(`<push><pushid>${pushid}</pushid><status>OK</status></push>`);
  }
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET", "POST", "PUT", "OPTIONS"] },
  },
});
