import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { VorkassePaymentService } from "@eci/pkg/integration-saleor-payment";
import { NextRequest } from "next/server";

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

const jsonResponseOk = (input: object) => {
  return new Response(JSON.stringify(input), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};

/**
 * The product data feed returns a google standard .csv file from products and
 * their attributes in your shop.#
 */
export default async function handler(req: NextRequest): Promise<Response> {
  const saleorEvent = req.headers.get("saleor-event") || "";

  const isPaymentWebhook = [
    "payment_list_gateways",
    "payment_process",
    "payment_confirm",
    "payment_capture",
    "payment_void",
  ].includes(saleorEvent);

  /**
   * We currently don't look-up the Webhook in the DB,
   * We always just respond with the vorkasse payment service
   */
  if (isPaymentWebhook) {
    const vorkassePaymentService = new VorkassePaymentService();
    if (saleorEvent === "payment_list_gateways") {
      const paymentGateways = await vorkassePaymentService.paymentListGateways(
        "EUR",
      );
      console.info(
        `Responding with payment gateway list. Config: ${JSON.stringify(
          paymentGateways[0].config,
        )}`,
      );
      return jsonResponseOk(paymentGateways);
    }
    if (saleorEvent === "payment_process") {
      const response = await vorkassePaymentService.paymentProcess();
      console.info("Responding with payment process answer");
      return jsonResponseOk(response);
    }
    if (saleorEvent === "payment_confirm") {
      const response = await vorkassePaymentService.paymentConfirm();
      console.info("Payment confirm request. Responding with confirmation");
      return jsonResponseOk(response);
    }
    if (saleorEvent === "payment_capture") {
      const response = await vorkassePaymentService.paymentCapture();
      console.info("Payment capture request. Responding with confirmation");
      return jsonResponseOk(response);
    }
    if (saleorEvent === "payment_void") {
      const response = await vorkassePaymentService.paymentVoid();
      console.info("Payment void request. Responding with confirmation");
      return jsonResponseOk(response);
    }
  }

  return jsonResponseOk({});
}

// export default handleWebhook({
//   webhook,
//   validation: {
//     http: { allowedMethods: ["POST"] },
//     request: requestValidation,
//   },
// });
