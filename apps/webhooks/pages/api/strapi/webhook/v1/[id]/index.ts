import { setupPrisma, extendContext } from "@eci/context";
import crypto from "crypto";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";

import * as strapi from "@eci/events/strapi";
import { env } from "@chronark/env";
import { Signer } from "@eci/events-client";
import { idGenerator } from "@eci/util/ids";

const requestValidation = z.object({
  query: z.object({
    id: z.string(),
  }),
  headers: z.object({
    authorization: z.string(),
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
    query: { id },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  const app = await ctx.prisma.strapiApp.findFirst({
    where: { webhooks: { some: { id } } },
    include: { webhooks: { include: { secret: true } } },
  });
  if (!app) {
    throw new HttpError(404, `No webhook found: ${id}`);
  }

  if (
    crypto.createHash("sha256").update(authorization).digest("hex") !==
    app.webhooks.find((w) => w.id === id)?.secret.secret
  ) {
    throw new HttpError(403, "Authorization token invalid");
  }

  ctx.logger.info("Received valid webhook from strapi");

  const queue = new strapi.Producer({
    logger: ctx.logger,
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
    connection: {
      host: env.require("REDIS_HOST"),
      port: env.require("REDIS_PORT"),
      password: env.require("REDIS_PASSWORD"),
    },
  });

  const message = {
    payload: req.body,
    meta: {
      traceId: idGenerator.id("trace"),
    },
  };
  switch (req.body.event) {
    case "entry.create":
      await queue.produce(strapi.Topic.ENTRY_CREATE, message);
      break;
    case "entry.update":
      await queue.produce(strapi.Topic.ENTRY_UPDATE, message);
      break;
    case "entry.delete":
      await queue.produce(strapi.Topic.ENTRY_DELETE, message);
      break;

    default:
      break;
  }

  res.json({
    status: "received",
    traceId: ctx.trace.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
