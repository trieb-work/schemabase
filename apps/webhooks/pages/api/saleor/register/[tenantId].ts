import { extendContext, newSaleorClient, setupPrisma } from "@eci/context";
import { z } from "zod";
import { idGenerator } from "@eci/util/ids";
import { env } from "@chronark/env";
import { handleWebhook, Webhook } from "@eci/http";
import { HttpError } from "@eci/util/errors";

const requestValidation = z.object({
  query: z.object({
    tenantId: z.string(),
  }),
  headers: z.object({
    "x-saleor-domain": z.string(),
  }),
  body: z.object({
    auth_token: z.string(),
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
    query: { tenantId },
    headers,
    body: { auth_token: token },
  } = req;
  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  /**
   * Saleor in a container will not have a real domain, so we override it here :/
   * see https://github.com/trieb-work/eci/issues/88
   */
  const domain = headers["x-saleor-domain"].replace("localhost", "saleor.eci");

  ctx.logger = ctx.logger.with({ tenantId, saleor: domain });
  ctx.logger.info("Registering app");

  const saleorClient = newSaleorClient(ctx, domain, token);

  const idResponse = await saleorClient.app();
  ctx.logger.info("app", { idResponse });
  if (!idResponse.app?.id) {
    throw new HttpError(500, "No app found");
  }

  const app = await ctx.prisma.installedSaleorApp.create({
    data: {
      id: idResponse.app.id,
      token,
      webhooks: {
        create: {
          id: idGenerator.id("publicKey"),
          secret: {
            create: {
              id: idGenerator.id("publicKey"),
              secret: idGenerator.id("secretKey"),
            },
          },
        },
      },
      saleorApp: {
        create: {
          id: idGenerator.id("publicKey"),
          name: "eCommerce Integration",
          // channelSlug: "",
          tenantId,
          domain,
        },
      },
    },
    include: {
      saleorApp: true,
      webhooks: {
        include: { secret: true },
      },
    },
  });

  ctx.logger.info("Added app to db", { app });
  const webhook = await saleorClient.webhookCreate({
    input: {
      targetUrl: `${env.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${
        app.webhooks[0].id
      }`,
      secretKey: app.webhooks[0].secret.secret,
    },
  });
  ctx.logger.info("Added webhook to saleor", { webhook });

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
