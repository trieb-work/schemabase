import {
  setupPrisma,
  extendContext,
  authorizeIntegration,
} from "@eci/pkg/webhook-context";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { createHash } from "crypto";
import { env } from "@chronark/env";
import { KafkaProducer, Message, Signer } from "@eci/pkg/events";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  headers: z.object({
    authorization: z.string().nonempty(),
  }),
  body: z.object({
    event: z.enum(["entry.create", "entry.update", "entry.delete"]),
    created_at: z.string(),
    model: z.string(),
    entry: z.object({
      id: z.number().int(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
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
  const {
    headers: { authorization },
    query: { webhookId },
    body,
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  ctx.logger.info("Incoming webhook from strapi");

  const webhook = await ctx.prisma.incomingStrapiWebhook.findUnique({
    where: { id: webhookId },
    include: {
      secret: true,
      strapiApp: {
        include: {
          integration: {
            include: {
              zohoApp: true,
              subscription: true,
            },
          },
        },
      },
    },
  });
  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  if (
    createHash("sha256").update(authorization).digest("hex") !==
    webhook.secret.secret
  ) {
    throw new HttpError(403, "Authorization token invalid");
  }
  const { strapiApp } = webhook;
  if (!strapiApp) {
    throw new HttpError(400, "strapi app is not configured");
  }
  const { integration } = strapiApp;
  if (!integration) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  if (req.body.model !== integration.strapiContentType) {
    ctx.logger.info("Content type does not match, I'll do nothing", {
      received: req.body.model,
      expected: integration.strapiContentType,
    });
    return res.json({
      status: "received",
      traceId: ctx.trace.id,
    });
  }

  const kafka = await KafkaProducer.new({
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
  });

  const message = new Message({
    header: {
      traceId: ctx.trace.id,
    },
    content: {
      ...req.body,
      zohoAppId: integration.zohoApp.id,
    },
  });

  const { messageId, partition, offset } = await kafka.produce(
    `strapi.${body.event}`,
    message,
  );
  ctx.logger.info("Queued new event", { messageId });

  res.json({
    status: "received",
    traceId: ctx.trace.id,
    messageId,
    partition,
    offset,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
