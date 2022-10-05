import { z } from "zod";
import { authorizeIntegration } from "@eci/pkg/webhook-context";
import { ElasticCluster, PrismaClient } from "@eci/pkg/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Client as ElasticClient } from "@elastic/elasticsearch";
import { HttpError } from "@eci/pkg/errors";
import { createHmac } from "crypto";
import { sha256 } from "@eci/pkg/hash";
import { Logger } from "@eci/pkg/logger";

// const vercelReportLogPattern =
// eslint-disable-next-line max-len
//   "REPORT RequestId: %{UUID:requestId}\\tDuration: %{NUMBER:duration} ms\\tBilled Duration: %{NUMBER:billedDuration} ms\\tMemory Size: %{NUMBER:memorySize} MB\\tMax Memory Used: %{NUMBER:maxMemoryUsed} MB";
const logger = new Logger();

const verify = (
  body: z.infer<typeof requestValidation>["body"],
  signingKey: string,
  signature: string,
): boolean => {
  return (
    signature ===
    createHmac("sha1", signingKey).update(JSON.stringify(body)).digest("hex")
  );
};

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  headers: z.object({
    "x-vercel-signature": z.string(),
  }),
  body: z.array(
    z
      .object({
        id: z.string(),
        message: z.string().optional(),
        timestamp: z.number().int(),
        requestId: z.string().optional(),
        statusCode: z.number().int().optional(),
        source: z.enum(["build", "static", "external", "lambda"]),
        projectId: z.string(),
        deploymentId: z.string(),
        host: z.string(),
        path: z.string().optional(),
        entrypoint: z.string().optional(),

        proxy: z
          .object({
            timestamp: z.number().int(),
            method: z.string(),
            scheme: z.string(),
            host: z.string(),
            path: z.string(),
            userAgent: z.array(z.string()).optional(),
            referer: z.string().optional(),
            statusCode: z.number().int(),
            clientIp: z.string(),
            region: z.string(),
            cacheId: z.string().optional(),
          })
          .optional(),
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

  get(webhookId: string): ElasticCluster[] {
    const cached = this.cache[webhookId];

    if (!cached) {
      return [];
    }
    if (cached.exp > Date.now()) {
      delete this.cache[webhookId];
      return [];
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

interface Metadata {
  requestId?: string;
  // milliseconds
  duration?: number;
  billedDuration?: number;

  // Megabytes
  memorySize?: number;
  maxMemoryUsed?: number;
}
type Log = Metadata & {
  level?: string;
  message: string | unknown | null;
  timestamp?: number;
};
function formatLogs(raw: string): Log[] {
  const lines = raw
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("START") &&
        !line.startsWith("END") &&
        !line.startsWith("REPORT") &&
        line.length > 0,
    );
  const reportLine =
    raw.split("\n").find((line) => line.startsWith("REPORT")) ?? "";
  const reportRegex =
    // eslint-disable-next-line max-len
    /REPORT RequestId: ([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\t|\\t)Duration: (\d+\.\d+) ms(?:\t|\\t)Billed Duration: (\d+) ms(?:\t|\\t)Memory Size: (\d+) MB(?:\t|\\t)Max Memory Used: (\d+) MB/;
  const reportMatch = reportRegex.exec(reportLine);

  const report: {
    requestId?: string;
    duration?: number;
    billedDuration?: number;
    memorySize?: number;
    maxMemoryUsed?: number;
  } = {};
  if (reportMatch) {
    report.requestId = reportMatch[1];
    report.duration = parseFloat(reportMatch[2]);
    report.billedDuration = parseInt(reportMatch[3]);
    report.memorySize = parseInt(reportMatch[4]);
    report.maxMemoryUsed = parseInt(reportMatch[5]);
  }

  let logs: {
    level?: string;
    message: string | unknown | null;
    timestamp?: number;
  }[] = [];
  if (lines.length === 0) {
    logs.push({ message: null });
  } else {
    try {
      const message = JSON.parse(lines.join("\n"));
      logs.push(message);
    } catch {
      logs = lines.map((line) => {
        if (line === "") {
          return { message: null };
        }
        try {
          const split = line.split("\t");
          if (split.length === 4) {
            return {
              timestamp: new Date(split[0]).getTime(),
              level: split[2].toLowerCase(),
              message: split[3],
            };
          } else {
            return { message: JSON.parse(line) };
          }
        } catch {
          return { message: line };
        }
      });
    }
  }
  return logs.map((log) => ({
    ...report,
    ...log,
  }));
}
const prisma = new PrismaClient();

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const {
      query: { webhookId },
      body,
      headers: { "x-vercel-signature": signature },
    } = requestValidation.parse(req);
    // logger.info("body", { body });
    let clusters = cache.get(webhookId);
    if (clusters.length === 0) {
      logger.info(`Getting Webhook data from prisma. ID: ${webhookId}`);
      const webhook = await prisma.incomingWebhook.findUnique({
        where: {
          id: webhookId,
        },
        include: {
          secret: true,
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
      if (webhook == null) {
        throw new HttpError(404, `Webhook not found: ${webhookId}`);
      }
      if (webhook.secret == null) {
        throw new HttpError(400, "secret is not configured");
      }
      if (!verify(req.body, webhook.secret.secret, signature)) {
        throw new HttpError(403, "Signature does not match");
      }
      const { vercelLogDrainApp } = webhook;
      if (vercelLogDrainApp == null) {
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
      const elastic = new ElasticClient({
        node: cluster.endpoint,
        auth: {
          username: cluster.username,
          password: cluster.password,
        },
      });

      const bulkBody = body
        .filter((event) => event.source !== "build")
        .flatMap((event) => {
          const logs = event.message ? formatLogs(event.message) : [];

          const index = {
            create: {
              _index: cluster.index ?? "logs-vercel-logdrain",
            },
          };
          return logs.flatMap((log) => {
            // logger.info("log", { log });
            let payload = {
              message:
                typeof log?.message === "string" && log.message.length > 0
                  ? log.message
                  : `No message (request log)`,
              log: {
                level: log?.level,
              },
              "@timestamp": log.timestamp ?? event.timestamp,
              transaction: {
                id: event.requestId,
              },
              metrics: {
                duration: log.duration,
                billedDuration: log.billedDuration,
                memorySize: log.memorySize,
                maxMemoryUsed: log.maxMemoryUsed,
              },
              cloud: {
                instance: {
                  id: event.deploymentId,
                },
                project: {
                  id: event.projectId,
                  // name
                },
                provider: "vercel",
                service: {
                  name: event.source,
                },
                region: event.proxy?.region,
              },
              url: {
                path: event.path,
                original: event.proxy?.path,
              },
              host: {
                hostname: event.host,
              },
              http: {
                request: {
                  method: event.proxy?.method,
                  referrer: event.proxy?.referer,
                },
                response: {
                  status_code: event.statusCode,
                },
              },
              user_agent: {
                original: event.proxy?.userAgent,
              },
              client: {
                address: event.proxy?.clientIp
                  ? sha256(event.proxy?.clientIp)
                  : undefined,
              },
              cache: {
                id: event.proxy?.cacheId,
              },
            };
            if (typeof log?.message === "object") {
              payload = {
                ...payload,
                ...log.message,
              };
            }
            // logger.info("payload", { payload });

            return [index, payload];
          });
        });
      if (bulkBody.length > 0) {
        await elastic.bulk({
          body: bulkBody,
        });
      }

      res.send("ok");
    }
  } catch (err) {
    console.error(err);
    res.status(err instanceof HttpError ? err.statusCode : 500);
    res.send((err as Error).message);
  } finally {
    res.end();
  }
}
