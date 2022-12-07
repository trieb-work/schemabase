import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { VorkassePaymentService } from "@eci/pkg/integration-saleor-payment";
import { NoopLogger } from "@eci/pkg/logger";

/**
 * We use the edge runtime here. SOME THINGS MIGHT BREAK! TEST IT
 */
export const config = {
  runtime: "experimental-edge",
};

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  headers: z.object({
    "saleor-domain": z.string(),
    "saleor-event": z.enum([
      "payment_list_gateways",
      "payment_process",
      "payment_confirm",
      "payment_capture",
      "payment_void",
      "product_variant_out_of_stock",
    ]),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and
 * their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
}): Promise<void> => {
  const {
    headers: { "saleor-event": saleorEvent },
  } = req;

  const isPaymentWebhook = [
    "payment_list_gateways",
    "payment_process",
    "payment_confirm",
    "payment_capture",
    "payment_void",
  ].includes(saleorEvent);

  const noopLogger = new NoopLogger();

  /**
   * We currently don't look-up the Webhook in the DB,
   * We always just respond with the vorkasse payment service
   */
  if (isPaymentWebhook) {
    const vorkassePaymentService = new VorkassePaymentService({
      logger: noopLogger,
    });
    if (saleorEvent === "payment_list_gateways") {
      const paymentGateways = await vorkassePaymentService.paymentListGateways(
        "EUR",
      );
      noopLogger.info(
        `Responding with payment gateway list. Config: ${JSON.stringify(
          paymentGateways[0].config,
        )}`,
      );
      return res.json(paymentGateways);
    }
    if (saleorEvent === "payment_process") {
      const response = await vorkassePaymentService.paymentProcess();
      noopLogger.info("Responding with payment process answer");
      return res.json(response);
    }
    if (saleorEvent === "payment_confirm") {
      const response = await vorkassePaymentService.paymentConfirm();
      noopLogger.info("Payment confirm request. Responding with confirmation");
      return res.json(response);
    }
    if (saleorEvent === "payment_capture") {
      const response = await vorkassePaymentService.paymentCapture();
      noopLogger.info("Payment capture request. Responding with confirmation");
      return res.json(response);
    }
    if (saleorEvent === "payment_void") {
      const response = await vorkassePaymentService.paymentVoid();
      noopLogger.info("Payment void request. Responding with confirmation");
      return res.json(response);
    }
  }

  noopLogger.info(`Received a non payment webhook`);

  res.send(req);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
