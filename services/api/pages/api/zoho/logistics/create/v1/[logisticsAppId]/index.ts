import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";

import { id } from "@eci/pkg/ids";

const requestValidation = z.object({
    query: z.object({
        logisticsAppId: z.string(),
    }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
    backgroundContext,
    req,
    res,
}): Promise<void> => {
    const {
        query: { logisticsAppId },
    } = req;

    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

    const wh = await ctx.prisma.incomingWebhook.create({
        data: {
            id: id.id("publicKey"),
            logisticsApp: {
                connect: {
                    id: logisticsAppId,
                },
            },
        },
    });

    res.json({
        status: "received",
        traceId: ctx.trace.id,
        webhookId: wh.id,
        path: `/api/zoho/logistics/v1/${wh.id}`,
    });
};

export default handleWebhook({
    webhook,
    validation: {
        http: { allowedMethods: ["POST"] },
        request: requestValidation,
    },
});
