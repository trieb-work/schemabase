import { setupPrisma, extendContext, authorizeIntegration } from "@eci/context";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";
import { createHash } from "crypto";
import { env } from "@chronark/env";
import { Signer } from "@eci/events";
import { KafkaProducer } from "@eci/events";

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

  // const queue = new strapi.Producer({
  //   logger: ctx.logger,
  //   signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
  //   connection: {
  //     host: env.require("REDIS_HOST"),
  //     port: env.require("REDIS_PORT"),
  //     password: env.get("REDIS_PASSWORD"),
  //   },
  // });

  // let topic: strapi.Topic;
  // switch (body.event) {
  //   case "entry.create":
  //     topic = strapi.Topic.ENTRY_CREATE;
  //     break;
  //   case "entry.update":
  //     topic = strapi.Topic.ENTRY_UPDATE;
  //     break;
  //   case "entry.delete":
  //     topic = strapi.Topic.ENTRY_DELETE;
  //     break;

  //   default:
  //     throw new Error(`Invalid strapi event: ${body.event}`);
  // }
  // const jobId = await queue.produce({
  //   topic,
  //   payload: {
  //     ...req.body,
  //     zohoAppId: integration.zohoApp.id,
  //   },
  // });

  const kafka = await KafkaProducer.new({
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
  });
  const { messageId, partition, offset } = await kafka.produce({
    topic: `strapi.${body.event}`,
    payload: {
      ...req.body,
      zohoAppId: integration.zohoApp.id,
    },
    traceId: ctx.trace.id,
  });
  ctx.logger.info("Queued new event", { messageId });
  await kafka.close();

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
