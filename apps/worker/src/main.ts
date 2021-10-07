import { Signer } from "@eci/events/client";
import { Logger } from "@eci/util/logger";
import { Worker } from "./service";
import * as strapi from "@eci/events/strapi";
import { env } from "@chronark/env";
import {
  OrderEvent,
  StrapiOrdersToZoho,
} from "@eci/integrations/strapi-orders-to-zoho";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";

async function main() {
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

  const zoho = new ZohoClientInstance({
    zohoClientId: env.require("ZOHO_CLIENT_ID"),
    zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
    zohoOrgId: env.require("ZOHO_ORG_ID"),
  });
  logger.info("zoho", { zoho });

  const worker = new Worker({
    logger,
    sources: {
      strapi: {
        consumer: strapiConsumer,
        handlers: [
          {
            topic: strapi.Topic.ENTRY_UPDATE,
            handler: async (message) => {
              const strapiOrdersToZoho = await StrapiOrdersToZoho.new({
                zoho,
                strapiBaseUrl: message.payload["origin"],
                logger,
              });

              await strapiOrdersToZoho.syncOrders(
                message.payload as OrderEvent,
              );
            },
          },
        ],
      },
    },
  });
  worker.start();
}

main();
