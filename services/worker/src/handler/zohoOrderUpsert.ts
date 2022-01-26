import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";

import { id } from "@eci/pkg/ids";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { PrismaClient, Language, PackageState, Carrier } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { env } from "@eci/pkg/env";
import { Context } from "@eci/pkg/context";
import { generateTrackingPortalURL } from "@eci/pkg/integration-tracking";

export class OrderUpdater
  implements EventHandler<EventSchemaRegistry.OrderUpdate["message"]>
{
  private readonly db: PrismaClient;

  private readonly logger: ILogger;

  private readonly onSuccess: OnSuccess<
    EventSchemaRegistry.BulkorderSynced["message"]
  >;

  constructor(config: {
    db: PrismaClient;
    logger: ILogger;
    onSuccess: OnSuccess<EventSchemaRegistry.BulkorderSynced["message"]>;
  }) {
    this.db = config.db;
    this.logger = config.logger;
    this.onSuccess = config.onSuccess;
  }

  private parseCarrier(carrier: string): Carrier | null {
    switch (carrier.toLowerCase()) {
      case "dpd":
        return Carrier.DPD;

      default:
        return null;
    }
  }

  private parseLanguage(language: string): Language | null {
    switch (language.toLowerCase()) {
      case "en":
        return Language.EN;
      case "de":
        return Language.DE;
      default:
        return null;
    }
  }

  public async handleEvent(
    ctx: Context,
    message: EventSchemaRegistry.OrderUpdate["message"],
  ) {
    const zohoApp = await this.db.zohoApp.findUnique({
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

    const contact = await zoho.contact.retrieve(message.customerId);
    if (contact == null) {
      throw new Error(`Unable to find zoho contact: ${message.customerId}`);
    }

    const language = this.parseLanguage(contact.language_code) ?? Language.DE;
    this.logger.info("Upserting order", {
      externalOrderId: message.externalOrderId,
    });

    const emails = message.emails.length > 0 ? message.emails : [contact.email];
    const order = await this.db.order.upsert({
      where: {
        externalOrderId: message.externalOrderId,
      },
      update: {},
      create: {
        id: id.id("order"),
        externalOrderId: message.externalOrderId,
        emails,
        language,
      },
    });

    for (const p of message.packages) {
      this.logger.info("Upserting package", {
        trackingId: p.trackingId,
      });

      if (p.carrier === "" || p.trackingId === "") {
        const packageResponse = await zoho.package.retrieve(p.packageId);
        if (!packageResponse) {
          throw new Error(`Unable to load package from zoho: ${p.packageId}`);
        }
        p.carrier = packageResponse.carrier;
        p.trackingId = packageResponse.tracking_number;
      }
      const carrier = this.parseCarrier(p.carrier);
      await this.db.package.upsert({
        where: {
          trackingId: p.trackingId,
        },
        update: {},
        create: {
          id: id.id("package"),
          trackingId: p.trackingId,
          carrier: carrier ?? Carrier.UNKNOWN,
          state: PackageState.INIT,
          carrierTrackingUrl: carrier
            ? generateTrackingPortalURL(carrier, language, p.trackingId)
            : undefined,
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });
    }

    await this.onSuccess(ctx, { orderId: order.id });
  }
}
