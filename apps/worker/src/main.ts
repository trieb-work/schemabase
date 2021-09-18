import { Signer, Queue } from "@eci/queue";
import { Logger } from "@eci/util/logger";
import { Worker } from "./service";
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const logger = new Logger({
    meta: {
      traceId: "",
    },
    enableElastic: false,
  });

  const signer = new Signer(logger);

  const strapiQueue = new Queue<{ eventId: string }>({
    name: "strapiQueue",
    signer,
    logger,
  });
  await strapiQueue.push({ meta: { traceId: "1" }, payload: { eventId: "1" } });
  logger.info("Hello");
  new Worker({
    logger,
    sources: {
      strapi: {
        receiver: strapiQueue,
        handler: async (message) => {
          console.log(message);
        },
      },
    },
  });
  // worker.start();
}
main();
