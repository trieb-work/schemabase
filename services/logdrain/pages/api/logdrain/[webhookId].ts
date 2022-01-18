import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import winston from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import ecsFormat from "@elastic/ecs-winston-format";
import {
  authorizeIntegration,
  extendContext,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { HttpError } from "@eci/pkg/errors";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.any(),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
  backgroundContext,
}): Promise<void> => {
  const {
    query: { webhookId },
    body,
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());
  ctx.logger.info("Raw body", { body });
  const webhook = await ctx.prisma.incomingWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      vercelLogDrainApp: {
        include: {
          elasticLogDrainIntegrations: {
            include: {
              subscription: true,
              elasticCluster: true,
            },
          },
        },
      },
    },
  });

  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { vercelLogDrainApp } = webhook;
  if (!vercelLogDrainApp) {
    throw new HttpError(400, "strapi app is not configured");
  }
  const { elasticLogDrainIntegrations } = vercelLogDrainApp;
  if (!elasticLogDrainIntegrations) {
    throw new HttpError(400, "Integration is not configured");
  }
  for (const integration of elasticLogDrainIntegrations) {
    /**
     * Ensure the elasticLogDrainIntegrations is enabled and payed for
     */
    authorizeIntegration(integration);

    const { elasticCluster } = integration;

    if (!elasticCluster) {
      throw new HttpError(400, "Elastic connection not found");
    }
    const elasticTransport = new ElasticsearchTransport({
      level: "info", // log info and above, not debug
      dataStream: true,
      clientOpts: {
        node: elasticCluster.endpoint,
        auth: {
          username: elasticCluster.username,
          password: elasticCluster.password,
        },
      },
    });
    const elasticLogger = winston.createLogger({
      transports: [new winston.transports.Console(), elasticTransport],
      format: ecsFormat(),
    });
    elasticLogger.log("info", "Hello from logdrain");
    await elasticTransport.flush();
    res.send("ok");
  }
};

export default handleWebhook({
  webhook,
  validation: {
    request: requestValidation,
  },
});
