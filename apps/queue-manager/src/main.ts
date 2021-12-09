import { env } from "@chronark/env";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue, QueueScheduler } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { HapiAdapter } from "@bull-board/hapi";
import hapi from "@hapi/hapi";

async function main() {
  const port = env.require("PORT");
  const connection = {
    host: env.require("REDIS_HOST"),
    port: Number.parseInt(env.require("REDIS_PORT")),
    password: env.get("REDIS_PASSWORD"),
  };

  const queueNames = [
    "eci:development:strapi.entry.create",
    "eci:development:strapi.entry.update",
    "eci:development:strapi.entry.delete",
  ];

  const scheduler = new QueueScheduler("queueScheduler", { connection });
  await scheduler.waitUntilReady();

  const server = hapi.server({
    port,
    host: "0.0.0.0",
  });

  const serverAdapter = new HapiAdapter();

  createBullBoard({
    queues: queueNames.map(
      (name) => new BullMQAdapter(new Queue(name, { connection })),
    ),
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");
  await server.register(serverAdapter.registerPlugin(), {
    routes: { prefix: "/ui" },
  });

  server.route({
    method: ["GET"],
    path: "/",
    handler: (_req, res) => {
      return res.redirect("/ui");
    },
  });

  await server.start().catch((e: Error) => {
    console.error(e);
    process.exit(1);
  });
  console.log(`Running on port ${port}...`);
}

main();
