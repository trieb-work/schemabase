import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";

// import { id } from "@eci/pkg/ids";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts";
import {
  PrismaClient,
  Language,
  // PackageState,
  // Carrier,
  Order,
} from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";
import { env } from "@eci/pkg/env";
import { Context } from "@eci/pkg/context";
// import { generateTrackingPortalURL } from "@eci/pkg/integration-tracking";
// import { CustomFieldLabel } from "@eci/pkg/zoho-custom-fields/src/registry";

/**
 * OrderUpdater is responsible for updating our internal database with new orders/packages.
 * The original event originates from zoho, and we forward it through kafka to this integration.
 *
 * Unfortunately zoho doesn't send us all the information we need, so we make a request to zoho
 * to get the missing data and then upsert orders and packages in our database for later use.
 *
 * Ie the tracking integration requires orders and packages to be setup in order to attach package
 * events correctly.
 */
export class OrderUpdater
  implements EventHandler<EventSchemaRegistry.OrderUpdate["message"]>
{
  private readonly db: PrismaClient;

  private readonly logger: ILogger;

  private readonly onSuccess: OnSuccess<
    EventSchemaRegistry.OrderUpdateComplete["message"]
  >;

  constructor(config: {
    db: PrismaClient;
    logger: ILogger;
    onSuccess: OnSuccess<EventSchemaRegistry.OrderUpdateComplete["message"]>;
  }) {
    this.db = config.db;
    this.logger = config.logger;
    this.onSuccess = config.onSuccess;
  }

  // private parseCarrier(carrier: string): Carrier | null {
  //   switch (carrier.toLowerCase()) {
  //     case "dpd":
  //       return Carrier.DPD;

  //     default:
  //       return null;
  //   }
  // }

  public parseLanguage(language: string | undefined): Language | null {
    if (!language) {
      return null;
    }
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
      include: {
        tenant: true,
      },
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

    // const salesorder = salesorders[0];

    // const language = this.parseLanguage(
    //   salesorder.custom_fields?.find(
    //     (field) => field.label === CustomFieldLabel.PREFERRED_LANGUAGE,
    //   )?.value as string | undefined,
    // );

    this.logger.info("Upserting order", {
      emails: message.emails,
    });

    let order: Order | undefined;
    for (const email of message.emails) {
      console.log(email);
      // const existingContact = await this.db.contact.findFirst({
      //   where: {
      //     email,
      //     tenantId: zohoApp.tenantId,
      //   },
      // });
    }

    if (!order) throw new Error("Order is undefined! Can't proceed");

    for (const p of message.packages) {
      this.logger.info("Upserting package", {
        trackingId: p.trackingId,
      });

      if (p.carrier === "" || p.trackingId === "") {
        const packageResponse = await zoho.package.get(p.packageId);
        if (!packageResponse) {
          throw new Error(`Unable to load package from zoho: ${p.packageId}`);
        }
        p.carrier = packageResponse.carrier;
        p.trackingId = packageResponse.tracking_number;
      }
      // const carrier = this.parseCarrier(p.carrier);
      // await this.db.package.upsert({
      //   where: {
      //     trackingId: p.trackingId,
      //   },
      //   update: {},
      //   create: {
      //     id: id.id("package"),
      //     trackingId: p.trackingId,
      //     carrier: carrier ?? Carrier.UNKNOWN,
      //     state: PackageState.INIT,
      //     events: {
      //       create: [
      //         {
      //           id: id.id("event"),
      //           state: PackageState.INIT,
      //           time: new Date(),
      //         },
      //       ],
      //     },
      //     carrierTrackingUrl: carrier
      //       ? generateTrackingPortalURL(
      //           carrier,
      //           language ?? message.defaultLanguage,
      //           p.trackingId,
      //         )
      //       : undefined,
      //     order: {
      //       connect: {
      //         id: order.id,
      //       },
      //     },
      //   },
      // });
    }

    await this.onSuccess(ctx, { orderId: order.id });
  }
}
