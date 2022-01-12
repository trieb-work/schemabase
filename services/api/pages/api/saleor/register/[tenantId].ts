import {
  extendContext,
  newSaleorClient,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { z } from "zod";
import { id } from "@eci/pkg/ids";
import { env } from "@eci/pkg/env";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { HttpError } from "@eci/pkg/errors";
import { WebhookEventTypeEnum } from "@eci/pkg/saleor";

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
          id: id.id("publicKey"),
          name: "Catch all",
          secret: {
            create: {
              id: id.id("publicKey"),
              secret: id.id("secretKey"),
            },
          },
        },
      },
      saleorApp: {
        create: {
          id: id.id("publicKey"),
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
  const saleorWebhook = await saleorClient.webhookCreate({
    input: {
      targetUrl: `${env.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${
        app.webhooks[0].id
      }`,
      events: [WebhookEventTypeEnum.AnyEvents],
      secretKey: app.webhooks[0].secret!.secret,
      isActive: true,
      name: app.webhooks[0].name,
      app: app.id,
    },
  });
  ctx.logger.info("Added webhook to saleor", { saleorWebhook });

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
