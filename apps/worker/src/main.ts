import { Signer } from "@eci/events-client";
import { Logger } from "@eci/util/logger";
import { Worker } from "./service";
import { config } from "dotenv";
import * as strapi from "@eci/events/strapi";
config({ path: ".env.local" });

async function main() {
  const logger = new Logger({
    meta: {
      traceId: "",
    },
    enableElastic: false,
  });

  const signer = new Signer(logger);

  const strapiConsumer = new strapi.Consumer({
    signer,
    logger,
  });

  const worker = new Worker({
    logger,
    sources: {
      strapi: {
        consumer: strapiConsumer,
        handler: [
          {
            topic: strapi.Topic.ENTRY_CREATE,
            handler: async (message) => {
              console.log(message);
            },
          },
        ],
      },
    },
  });
  worker.start();
}
main();
