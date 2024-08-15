import { extendContext, setupPrisma } from "@eci/pkg/webhook-context";
import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import {
    RedisConnection,
    WorkflowScheduler,
} from "@eci/pkg/scheduler/scheduler";
import { env } from "@eci/pkg/env";
import { SaleorCustomerSyncWf } from "@eci/services/worker/src/workflows/saleorCustomerSync";
import { SaleorOrderSyncWf } from "@eci/services/worker/src/workflows/saleorOrderSync";
import { SaleorPaymentSyncWf } from "@eci/services/worker/src/workflows/saleorPaymentSync";

const requestValidation = z.object({
    headers: z.object({
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

const redisConnection: RedisConnection = {
    host: env.require("REDIS_HOST"),
    port: parseInt(env.require("REDIS_PORT")),
    password: env.require("REDIS_PASSWORD"),
};
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

    const saleorApp = await ctx.prisma.saleorApp.findFirst({
        where: { domain: saleorDomain },
        include: { installedSaleorApps: { where: { type: "entitysync" } } },
    });

    if (!saleorApp) {
        ctx.logger.error("Saleor App not found", { saleorDomain });
        res.status(404).send({ error: "Saleor App not found" });
        return;
    }
    if (!saleorApp.installedSaleorApps.length) {
        ctx.logger.error("No installed entitysync app found", { saleorDomain });
        res.status(404).send({ error: "No installed apps found" });
        return;
    }

    if (!saleorApp.tenantId) {
        ctx.logger.error("TenantId not found", { saleorDomain });
        res.status(404).send({ error: "TenantId not found" });
        return;
    }

    const workflowScheduler = new WorkflowScheduler({
        logger: ctx.logger,
        redisConnection: redisConnection,
    });

    const installedSaleorApp = saleorApp.installedSaleorApps[0];

    if (saleorEvent === "order_created") {
        const commonQueueName = [
            saleorApp.tenantId.substring(0, 5),
            installedSaleorApp.id.substring(0, 7),
        ];
        /**
         * Promote the customer, order and payment workflow. Should be improved
         * to a new ad-hoc job type, that is also having the dependencies
         */
        await workflowScheduler.promoteJob(
            commonQueueName,
            SaleorCustomerSyncWf.name,
        );
        // wait 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await workflowScheduler.promoteJob(
            commonQueueName,
            SaleorOrderSyncWf.name,
        );
        // wait 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await workflowScheduler.promoteJob(
            commonQueueName,
            SaleorPaymentSyncWf.name,
        );
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
