import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/http";
import { env } from "@chronark/env";
import { QueueManager } from "@eci/events/client";
import { Queue } from "bullmq";
import { Topic } from "@eci/events/strapi";

const requestValidation = z.object({
  query: z.object({
    jobId: z.string(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    topic: z.enum(Object.values(Topic)),
  }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
}): Promise<void> => {
  const {
    query: { jobId, topic },
  } = req;

  const queue = new Queue(QueueManager.queueId(topic), {
    connection: {
      host: env.require("REDIS_HOST"),
      port: Number.parseInt(env.require("REDIS_PORT")),
      password: env.get("REDIS_PASSWORD"),
    },
  });

  const job = await queue.getJob(jobId);

  const isCompleted = (await job?.isCompleted()) ?? false;
  await queue.close();
  res.json({
    isCompleted,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["GET"] },
    request: requestValidation,
  },
});
