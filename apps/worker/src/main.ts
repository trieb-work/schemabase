import { Signer } from "@eci/events/client";
import { Logger } from "@eci/util/logger";
import { Worker } from "./service";
import * as strapi from "@eci/events/strapi";
import { env } from "@chronark/env";
import {
  OrderEvent,
  StrapiOrdersToZoho,
} from "@eci/integrations/strapi-orders-to-zoho";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { PrismaClient } from "@eci/data-access/prisma";

async function main() {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
  });

  const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });

  const strapiConsumer = new strapi.Consumer({
    signer,
    logger,
    connection: {
      host: env.require("REDIS_HOST"),
      port: env.require("REDIS_PORT"),
      password: env.get("REDIS_PASSWORD"),
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
              const cookies = env.get("ZOHO_COOKIES");
              const zoho = new Zoho(
                cookies
                  ? await ZohoApiClient.fromCookies({
                      orgId: zohoApp.orgId,
                      cookie: cookies,
                      zsrfToken: env.require("ZOHO_ZCSRF_TOKEN"),
                    })
                  : await ZohoApiClient.fromOAuth({
                      orgId: zohoApp.orgId,
                      client: {
                        id: zohoApp.clientId,
                        secret: zohoApp.clientSecret,
                      },
                    }),
              );
              const strapiOrdersToZoho = new StrapiOrdersToZoho({
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

              const cookies = env.get("ZOHO_COOKIES");
              const zoho = new Zoho(
                cookies
                  ? await ZohoApiClient.fromCookies({
                      orgId: zohoApp.orgId,
                      cookie: cookies,
                      zsrfToken: env.require("ZOHO_ZCSRF_TOKEN"),
                    })
                  : await ZohoApiClient.fromOAuth({
                      orgId: zohoApp.orgId,
                      client: {
                        id: zohoApp.clientId,
                        secret: zohoApp.clientSecret,
                      },
                    }),
              );
              const strapiOrdersToZoho = new StrapiOrdersToZoho({
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
