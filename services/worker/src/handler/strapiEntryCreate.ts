import { Message, KafkaProducer, Signer } from "@eci/pkg/events";
import {
  EntryEvent,
  OrderEvent,
  StrapiOrdersToZoho,
} from "@eci/pkg/integration-bulkorders";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { env } from "@eci/pkg/env";
export const strapiEntryCreate =
  ({ prisma, logger }: { prisma: PrismaClient; logger: ILogger }) =>
  async (
    message: Message<EntryEvent & { zohoAppId: string }>,
  ): Promise<void> => {
    const zohoApp = await prisma.zohoApp.findUnique({
      where: { id: message.content.zohoAppId },
    });
    if (!zohoApp) {
      throw new Error(`No zoho app found: ${message.content.zohoAppId}`);
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
      message.content as unknown as OrderEvent,
    );
    const producer = await KafkaProducer.new({
      signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
    });

    await producer.produce("bulkorder.synced", message);
    await producer.close();
  };
