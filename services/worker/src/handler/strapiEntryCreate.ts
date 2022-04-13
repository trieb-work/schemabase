import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";
import {
  OrderEvent,
  StrapiOrdersToZoho,
} from "@eci/pkg/integration-bulkorders";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { env } from "@eci/pkg/env";
import { Context } from "@eci/pkg/context";

/**
 * Strapi 2 Zoho bulk order create
 * A strapi entry create event was received by our webhook api and forwarded via kafka.
 * The bulkorder integration then creates  orders and customers in zoho.
 *
 * This way of defining the event handler is deprecated, please combine the integration
 * with the event handler into one class (See `.github/README.md)
 */
export class StrapiEntryCreate
  implements EventHandler<EventSchemaRegistry.StrapiEntryCreate["message"]>
{
  private readonly prisma: PrismaClient;

  private readonly logger: ILogger;

  private readonly onSuccess: OnSuccess<
    EventSchemaRegistry.BulkorderSynced["message"]
  >;

  constructor(config: {
    prisma: PrismaClient;
    logger: ILogger;
    onSuccess: OnSuccess<EventSchemaRegistry.BulkorderSynced["message"]>;
  }) {
    this.prisma = config.prisma;
    this.logger = config.logger;
    this.onSuccess = config.onSuccess;
  }

  public async handleEvent(
    ctx: Context,
    message: EventSchemaRegistry.StrapiEntryCreate["message"],
  ) {
    const zohoApp = await this.prisma.zohoApp.findUnique({
      where: { id: message.zohoAppId },
    });
    if (zohoApp == null) {
      throw new Error(`No zoho app found: ${message.zohoAppId}`);
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
      logger: this.logger,
    });

    await strapiOrdersToZoho.createNewBulkOrders(
      message as unknown as OrderEvent,
    );

    await this.onSuccess(ctx, { orderId: message.entry.id.toString() });
  }
}
