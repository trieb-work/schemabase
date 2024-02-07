import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { IncomingWebhook, KencoveApiApp, SecretKey } from "@eci/pkg/prisma";

const requestValidation = z.object({
    query: z.object({
        webhookId: z.string(),
    }),
    headers: z.any(),
});

/**
 * Cache responses from Prisma to only query Webhook Metadata for this
 * webhook once per running lambda.
 */
const webhookCache: {
    [webhookId: string]:
        | (IncomingWebhook & {
              secret: SecretKey | null;
              kencoveApiApp: KencoveApiApp | null;
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
    } = req;

    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

    ctx.logger.info(`Incoming odoo webhook: ${webhookId},`);

    const wh =
        webhookCache?.[webhookId] ||
        (await ctx.prisma.incomingWebhook.findUnique({
            where: {
                id: webhookId,
            },
            include: {
                secret: true,
                kencoveApiApp: true,
            },
        }));

    if (wh == null) {
        ctx.logger.error(`Webhook not found: ${webhookId}`);
        throw new HttpError(404, `Webhook not found: ${webhookId}`);
    }

    webhookCache[webhookId] = wh;

    const { kencoveApiApp } = wh;

    if (kencoveApiApp == null) {
        ctx.logger.error("Saleor App is not configured");
        throw new HttpError(404, "Saleor App is not configured");
    }

    ctx.logger.info(`Received valid odoo webhook ${kencoveApiApp.id}`);

    res.send(req);
};

export default handleWebhook({
    webhook,
    validation: {
        http: { allowedMethods: ["POST"] },
        request: requestValidation,
    },
});
