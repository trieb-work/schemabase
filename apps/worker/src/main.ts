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
  const zohoConfig = {
    zohoClientId: env.require("ZOHO_CLIENT_ID"),
    zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
    zohoOrgId: env.require("ZOHO_ORG_ID"),
  };
  const zoho = new ZohoClientInstance(zohoConfig);
  const strapiOrdersToZoho = await StrapiOrdersToZoho.new({
    zoho,
    logger,
  });

  const worker = new Worker({
    logger,
    sources: {
      strapi: {
        consumer: strapiConsumer,
        handlers: [
          {
            topic: strapi.Topic.ENTRY_UPDATE,
            handler: async (message) =>
              await strapiOrdersToZoho.syncOrders(
                message.payload as OrderEvent,
              ),
          },
          {
            topic: strapi.Topic.ENTRY_CREATE,
            handler: async (message) =>
              await strapiOrdersToZoho.syncOrders(
                message.payload as OrderEvent,
              ),
          },
        ],
      },
    },
  });
  worker.start();
}

main();
