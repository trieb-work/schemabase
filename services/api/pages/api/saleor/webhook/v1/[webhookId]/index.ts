import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { VorkassePaymentService } from "@eci/pkg/integration-saleor-payment";
import { IncomingWebhook, SecretKey } from "@eci/pkg/prisma";
import { NoopLogger } from "@eci/pkg/logger";

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
 * Cache responses from Prisma to only query Webhook Metadata for this
 * webhook once per running lambda.
 */
const webhookCache: {
  [webhookId: string]:
    | (IncomingWebhook & {
        secret: SecretKey | null;
        installedSaleorApp: {
          id: string;
          channelSlug: string | null;
          saleorApp: {
            id: string;
            domain: string;
          };
        } | null;
      })
    | null;
} = {};

/**
 * The product data feed returns a google standard .csv file from products and
 * their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  const {
    query: { webhookId },
    headers: { "saleor-event": saleorEvent, "saleor-domain": saleorDomain },
  } = req;

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
    const noopLogger = new NoopLogger();
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

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  ctx.logger.info(
    `Incoming saleor webhook: ${webhookId}, saleor-event: ${saleorEvent}.` +
      `Saleor Domain: ${saleorDomain}`,
  );

  const webhook =
    webhookCache?.[webhookId] ||
    (await ctx.prisma.incomingWebhook.findUnique({
      where: {
        id: webhookId,
      },
      include: {
        secret: true,
        installedSaleorApp: {
          select: {
            id: true,
            channelSlug: true,
            saleorApp: { select: { id: true, domain: true } },
          },
        },
      },
    }));

  if (webhook == null) {
    ctx.logger.error(`Webhook not found: ${webhookId}`);
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  webhookCache[webhookId] = webhook;

  const { installedSaleorApp } = webhook;

  if (installedSaleorApp == null) {
    ctx.logger.error("Saleor App is not configured");
    throw new HttpError(404, "Saleor App is not configured");
  }

  const { saleorApp } = installedSaleorApp;

  ctx.logger.info(`Received valid saleor webhook ${saleorApp.id}`);

  res.send(req);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
