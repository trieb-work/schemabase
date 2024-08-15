import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";

const requestValidation = z.object({
    headers: z.object({
        "x-schemabase-id": z.string(),
        "saleor-domain": z.string(),
        "saleor-event": z.enum([
            "payment_list_gateways",
            "payment_process",
            "payment_confirm",
            "payment_capture",
            "payment_void",
            "product_variant_out_of_stock",
            "product_deleted",
            "product_variant_deleted",
            "order_created",
        ]),
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
        headers: { "saleor-event": saleorEvent, "saleor-domain": saleorDomain },
    } = req;

    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

    ctx.logger.info(
        `Incoming saleor webhook: saleor-event: ${saleorEvent}.` +
            `Saleor Domain: ${saleorDomain}`,
    );

    ctx.logger.info(JSON.stringify(req.headers));

    res.send(req);
};

export default handleWebhook({
    webhook,
    validation: {
        http: { allowedMethods: ["POST"] },
        request: requestValidation,
    },
});
