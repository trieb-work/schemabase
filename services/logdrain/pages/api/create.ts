import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@eci/pkg/prisma";
import { authenticate } from "@eci/services/logdrain/pkg/authenticate";
import { createLogDrain } from "@eci/services/logdrain/pkg/logDrain";
import { NextApiRequest, NextApiResponse } from "next";

import { z } from "zod";
import { randomBytes } from "crypto";

const requestValidation = z.object({
  elastic: z.object({
    url: z.string(),
    username: z.string(),
    password: z.string(),
  }),
  vercel: z.object({
    configurationId: z.string(),
    projectId: z.string().optional(),
    teamId: z.string().optional(),
  }),
  code: z.string(),
});
export type CreateRequest = z.infer<typeof requestValidation>;

const prisma = new PrismaClient();
export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { vercel, elastic, code } = requestValidation.parse(req.body);

    const token = await authenticate(code);

    const cluster = await prisma.elasticCluster.create({
      data: {
        id: id.id("publicKey"),
        endpoint: elastic.url,
        username: elastic.username,
        password: elastic.password,
      },
    });

    const logdrain = await prisma.vercelLogDrainApp.create({
      data: {
        id: id.id("publicKey"),
        configurationId: vercel.configurationId,
        installationId: token.installation_id,
        projectId: vercel.projectId,
        teamId: token.team_id,
        userId: token.user_id,
      },
    });
    const tenantId = token.team_id ?? token.user_id;

    const tenant = await prisma.tenant.upsert({
      where: {
        id: tenantId,
      },
      update: {},
      create: {
        id: tenantId,
        name: "vercel logdrain integration",
      },
    });

    await prisma.elasticLogDrainIntegration.create({
      data: {
        id: id.id("publicKey"),
        tenant: {
          connect: {
            id: tenant.id,
          },
        },
        logDrainApp: {
          connect: {
            id: logdrain.id,
          },
        },
        elasticCluster: {
          connect: {
            id: cluster.id,
          },
        },
        subscription: {
          create: {
            id: id.id("publicKey"),
            payedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            tenant: {
              connect: {
                id: tenant.id,
              },
            },
          },
        },
      },
    });
    const secret = randomBytes(16).toString("base64url");
    const webhook = await prisma.incomingWebhook.create({
      data: {
        id: id.id("webhook"),
        vercelLogDrainApp: {
          connect: {
            id: logdrain.id,
          },
        },
        secret: {
          create: {
            id: id.id("secretKey"),
            secret,
          },
        },
      },
    });
    const host = req.headers.host ?? "https://logdrain-triebwork.vercel.app";

    await createLogDrain({
      token,
      teamId: vercel.teamId,
      name: "elastic",
      type: "json",
      url: `https://${host}/api/logdrain/${webhook.id}`,
      secret,
    }).catch((err) => {
      console.error("Unable to create logdrain", err);
      throw err;
    });
    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500);
    res.send((err as Error).message);
  }
}
