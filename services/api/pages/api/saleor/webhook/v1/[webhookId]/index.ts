import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { VorkassePaymentService } from "@eci/pkg/integration-saleor-payment";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  headers: z.object({
    "saleor-domain": z.string(),
    "saleor-event": z.enum(["payment_list_gateways"]),
  }),
});

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
    headers: { "saleor-event": saleorEvent },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  ctx.logger.info(
    `Incoming saleor webhook: ${webhookId}, saleor-event: ${saleorEvent}`,
  );
  const webhook = await ctx.prisma.incomingWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      secret: true,
      installedSaleorApp: {
        include: { saleorApp: true },
      },
    },
  });

  if (webhook == null) {
    ctx.logger.error(`Webhook not found: ${webhookId}`);
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { installedSaleorApp } = webhook;

  if (installedSaleorApp == null) {
    ctx.logger.error("Saleor App is not configured");
    throw new HttpError(404, "Saleor App is not configured");
  }

  const { saleorApp } = installedSaleorApp;

  ctx.logger.info("Received valid saleor webhook");

  if (saleorEvent === "payment_list_gateways") {
    const vorkassePaymentService = new VorkassePaymentService({
      logger: ctx.logger.with({
        saleor: { domain: saleorApp.domain, channel: saleorApp.channelSlug },
      }),
    });
    const paymentGateways = await vorkassePaymentService.paymentListGateways(
      "EUR",
    );
    ctx.logger.info("Responding with payment gateway list");
    return res.json(paymentGateways);
  }

  res.send(req);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
