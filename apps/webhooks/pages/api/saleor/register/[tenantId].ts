import { extendContext, newSaleorClient, setupPrisma } from "@eci/context";
import { z } from "zod";
import { idGenerator } from "@eci/util/ids";
import { env } from "@chronark/env";
import { handleWebhook, Webhook } from "@eci/http";

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
    headers: { "x-saleor-domain": domain },
    body: { auth_token: appToken },
  } = req;
  try {
    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());
    ctx.logger = ctx.logger.with({ tenantId, saleor: domain });
    ctx.logger.info("Registering app");

    const app = await ctx.prisma.saleorApp.create({
      data: {
        id: idGenerator.id("publicKey"),
        name: "eCommerce Integration",
        channelSlug: "",
        tenantId,
        domain,
        appToken,
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
      },
      include: {
        webhooks: {
          include: { secret: true },
        },
      },
    });
    const saleorClient = newSaleorClient(ctx, domain, appToken);

    await saleorClient.webhookCreate({
      input: {
        targetUrl: `${env.require("ECI_BASE_URL")}/api/saleor/webhook/v1/${
          app.webhooks[0].id
        }`,
        secretKey: app.webhooks[0].secret.secret,
      },
    });

    res.status(200);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
