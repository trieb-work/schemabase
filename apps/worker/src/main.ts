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
import { PrismaClient } from "@eci/data-access/prisma";

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

  const prisma = new PrismaClient();

  const worker = new Worker({
    logger,
    sources: {
      strapi: {
        consumer: strapiConsumer,
        handlers: [
          {
            topic: strapi.Topic.ENTRY_UPDATE,
            handler: async (message) => {
              const zohoApp = await prisma.zohoApp.findUnique({
                where: { id: message.payload.zohoAppId },
              });
              if (!zohoApp) {
                throw new Error(
                  `No zoho app found: ${message.payload.zohoAppId}`,
                );
              }

              const zoho = new ZohoClientInstance({
                zohoClientId: zohoApp.clientId,
                zohoClientSecret: zohoApp.clientSecret,
                zohoOrgId: zohoApp.orgId,
              });
              const strapiOrdersToZoho = await StrapiOrdersToZoho.new({
                zoho,
                logger,
              });

              await strapiOrdersToZoho.updateBulkOrders(
                message.payload as unknown as OrderEvent,
              );
            },
          },
          {
            topic: strapi.Topic.ENTRY_CREATE,
            handler: async (message) => {
              const zohoApp = await prisma.zohoApp.findUnique({
                where: { id: message.payload.zohoAppId },
              });
              if (!zohoApp) {
                throw new Error(
                  `No zoho app found: ${message.payload.zohoAppId}`,
                );
              }

              const zoho = new ZohoClientInstance({
                zohoClientId: zohoApp.clientId,
                zohoClientSecret: zohoApp.clientSecret,
                zohoOrgId: zohoApp.orgId,
              });
              const strapiOrdersToZoho = await StrapiOrdersToZoho.new({
                zoho,
                logger,
              });

              await strapiOrdersToZoho.createNewBulkOrders(
                message.payload as unknown as OrderEvent,
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
