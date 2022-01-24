import { z } from "zod";
import { authorizeIntegration } from "@eci/pkg/webhook-context";
import { ElasticCluster, PrismaClient } from "@eci/pkg/prisma";
import { env } from "@eci/pkg/env";
// import grok from "node-grok-v2";
import { NextApiRequest, NextApiResponse } from "next";
import { Client as ElasticClient } from "@elastic/elasticsearch";
import { HttpError } from "@eci/pkg/errors";
import { createHmac } from "crypto";

// const vercelReportLogPattern =
// eslint-disable-next-line max-len
//   "REPORT RequestId: %{UUID:requestId}\\tDuration: %{NUMBER:duration} ms\\tBilled Duration: %{NUMBER:billedDuration} ms\\tMemory Size: %{NUMBER:memorySize} MB\\tMax Memory Used: %{NUMBER:maxMemoryUsed} MB";

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
            userAgent: z.array(z.string()),
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
  message?: string;
};
function formatLogs(raw: string): Log[] {
  const lines = raw
    .split("\n")
    .filter(
      (line) =>
        !line.startsWith("START") &&
        !line.startsWith("END") &&
        !line.startsWith("REPORT"),
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

  const lineRegex =
    // eslint-disable-next-line max-len, no-control-regex
    /[\d]{4}-[\d]{2}-[\d]{2}T[\d]{2}:[\d]{2}:[\d]{2}.[\d]+Z(?:\t|\\t)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\t|\\t)(\w+)(?:\t|\\t)(.*)/gim;
  const logs: {
    level?: string;
    message?: string;
  }[] =
    lines.length > 0
      ? lines.map((line) => {
          const match = lineRegex.exec(line);
          if (match) {
            return { level: match[1].toLowerCase(), message: match[2] };
          }
          return { message: line };
        })
      : [{ message: undefined }];
  return logs.map((log) => ({
    ...report,
    level: log.level ?? "info",
    message: log.message,
  }));
}

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

    console.log({ entrypoints: body.map((b) => b.entrypoint) });
    const prisma = new PrismaClient();

    let clusters = cache.get(webhookId);
    if (clusters.length === 0) {
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

      /**
       * Logging my own messages causes an infinite loop of nested messages.
       */
      const vercelUrl = env.require("VERCEL_URL");

      const index = cluster.index ?? "logs-vercel-logdrain";
      const bulkBody = body
        .filter((event) => event.host !== vercelUrl && event.source !== "build")
        .flatMap((event) => {
          const logs = event.message ? formatLogs(event.message) : [];

          return logs.map((log) => [
            {
              create: {
                _index: index,
              },
            },
            {
              message: log?.message ?? `No message (request log)`,
              log: {
                level: log?.level ?? "info",
              },
              "@timestamp": event.timestamp,
              trace: {
                id: log?.requestId,
              },
              event: {
                duration: log.duration,
              },
              cloud: {
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
            },
          ]);
        });
      if (bulkBody.length !== 0) {
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
