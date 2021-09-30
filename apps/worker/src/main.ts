import { Signer } from "@eci/events-client";
import { Logger } from "@eci/util/logger";
import { Worker } from "./service";
import * as strapi from "@eci/events/strapi";
import { env } from "@chronark/env";

const logger = new Logger({
  meta: {
    traceId: "",
  },
  enableElastic: false,
});

const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });

const strapiConsumer = new strapi.Consumer({
  signer,
  logger,
  connection: {
    host: env.require("REDIS_HOST"),
    port: env.require("REDIS_PORT"),
  },
});

const worker = new Worker({
  logger,
  sources: {
    strapi: {
      consumer: strapiConsumer,
      handlers: [
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
