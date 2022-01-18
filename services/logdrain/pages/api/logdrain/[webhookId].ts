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
import { ElasticCluster } from "@prisma/client";
import { env } from "@eci/pkg/env";
const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.array(
    z
      .object({
        id: z.string(),
        message: z.string().optional(),
        timestamp: z.number().int(),
        requestId: z.string(),
        statusCode: z.number().int(),
        source: z.enum(["build", "static", "external", "lambda"]),
        projectId: z.string(),
        host: z.string(),
        // path: z.string(),
        /**
         * Don't care at this point
         */
        // proxy: z.object({
        //   timestamp: z.number().int(),
        //   method: z.string(),
        //   scheme: z.string(),
        //   host: z.string(),
        //   path: z.string(),
        //   userAgent: z.array(z.string()),
        //   referer: z.string(),
        //   statusCode: z.number().int(),
        //   clientIp: z.string(),
        //   region: z.string(),
        //   cacheId: z.string(),
        // }),
      })
      .passthrough(),
  ),
});
class ClusterCache {
  private cache: {
    [webhookId: string]: {
      clusters: ElasticCluster[];
      exp: number;
    };
  };
  constructor() {
    this.cache = {};
  }

  get(webhookId: string): ElasticCluster[] | null {
    const cached = this.cache[webhookId];

    if (!cached) {
      return null;
    }
    if (cached.exp > Date.now()) {
      delete this.cache[webhookId];
      return null;
    }
    return cached.clusters;
  }

  set(webhookId: string, clusters: ElasticCluster[]): void {
    this.cache[webhookId] = {
      clusters,
      exp: Date.now() + 5 * 60 * 1000,
    };
  }
}

const cache = new ClusterCache();

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

  let clusters = cache.get(webhookId);
  if (!clusters || clusters.length === 0) {
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
      throw new HttpError(400, "vercel log drain is not configured");
    }
    const { elasticLogDrainIntegrations } = vercelLogDrainApp;
    if (!elasticLogDrainIntegrations) {
      throw new HttpError(400, "Integration is not configured");
    }

    clusters = elasticLogDrainIntegrations.map((integration) => {
      /**
       * Ensure the elasticLogDrainIntegrations is enabled and payed for
       */
      authorizeIntegration(integration);

      const { elasticCluster } = integration;

      if (!elasticCluster) {
        throw new HttpError(400, "Elastic connection not found");
      }
      return elasticCluster;
    });
    cache.set(webhookId, clusters);
  }

  for (const cluster of clusters) {
    const elasticTransport = new ElasticsearchTransport({
      level: "info", // log info and above, not debug
      dataStream: true,
      index: cluster.index ?? "logs-vercel-logdrain",
      clientOpts: {
        node: cluster.endpoint,
        auth: {
          username: cluster.username,
          password: cluster.password,
        },
      },
    });
    const elasticLogger = winston.createLogger({
      transports: [elasticTransport],
      format: ecsFormat(),
    });

    /**
     * Logging my own messages causes an infinite loop of nested messages.
     */
    const vercelUrl = env.require("VERCEL_URL");
    for (const message of body) {
      if (message.host !== vercelUrl) {
        elasticLogger.log("info", JSON.stringify(message));
      }
    }
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
