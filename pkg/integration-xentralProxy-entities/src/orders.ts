/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import {
  XentralRestClient,
  XentralRestNotFoundError,
} from "@eci/pkg/xentral/src/rest";
import { Auftrag } from "@eci/pkg/xentral/src/rest/types";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import {
  AuftragCreateRequest,
  AuftragCreateResponse,
} from "@eci/pkg/xentral/src/xml/types";
import { format } from "date-fns";

interface XentralProxyOrderSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  db: PrismaClient;
  logger: ILogger;
  warehouseId: string;
}

export class XentralProxyOrderSyncService {
  private readonly logger: ILogger;

  public readonly tenantId: string;

  public readonly warehouseId: string;

  public readonly xentralProxyApp: XentralProxyApp;

  private readonly db: PrismaClient;

  public constructor(config: XentralProxyOrderSyncServiceConfig) {
    this.logger = config.logger;
    this.tenantId = config.xentralProxyApp.tenantId;
    this.xentralProxyApp = config.xentralProxyApp;
    this.warehouseId = config.warehouseId;
    this.db = config.db;
  }

  public async syncFromECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);
    const orders = await this.db.order.findMany({
      where: {
        orderStatus: "confirmed",
        readyToFullfill: true,
        /**
         * only include orders which have not been transfered to the current xentral instance and
         * therefore have no xentralProxyAuftrag with the current xentral instance
         */
        xentralProxyAuftraege: {
          none: {
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
      },
      include: {
        /**
         * only include these lineItems for each order which are from the same warehouse as the
         * current xentral integration
         */
        orderLineItems: {
          where: {
            productVariant: {
              defaultWarehouseId: this.warehouseId,
            },
          },
          include: {
            productVariant: {
              include: {
                xentralArtikel: {
                  where: {
                    xentralProxyAppId: this.xentralProxyApp.id,
                  },
                },
              },
            },
          },
        },
        shippingAddress: true,
        xentralProxyAuftraege: true,
      },
    });
    for (const order of orders) {
      if (!order.shippingAddress) {
        this.logger.warn(
          "Skipping sync of Order because of missing shipping Address",
          {
            orderId: order.id,
            tenantId: this.tenantId,
            orderNumber: order.orderNumber,
          },
        );
        continue;
      }
      const auftrag: AuftragCreateRequest = {
        kundennummer: "NEW",
        name: order.shippingAddress?.fullname || "",
        strasse: order.shippingAddress?.street || "",
        plz: order.shippingAddress?.plz || "",
        ort: order.shippingAddress?.city || "",
        land: order.shippingAddress?.countryCode || "",
        ihrebestellnummer: order.orderNumber,
        // INFO: do not remove date otherwise search will not work anymore!
        datum: format(order.date, "dd.MM.yyyy"),
        artikelliste: {
          position: order.orderLineItems.map((lineItem) => {
            if (!lineItem.productVariant.xentralArtikel[0]) {
              throw new Error(
                `No matching xentral artikel for lineItem (${lineItem.sku}). Please sync new productVariants first to xentral artikel before creating an xentral auftrag.`,
              );
            }
            return {
              nummer: lineItem.productVariant.xentralArtikel[0].xentralNummer,
              preis: 0,
              waehrung: "EUR",
              projekt: this.xentralProxyApp.projectId,
              menge: lineItem.quantity,
            };
          }),
        },
      };
      const xentralAuftraegeWithSameDatePaginator =
        xentralRestClient.getAuftraege(
          {
            datum: format(order.date, "yyyy-MM-dd"),
          },
          1000,
        );
      let existingXentralAuftrag: Auftrag | undefined;
      try {
        for await (const xentralAuftrag of xentralAuftraegeWithSameDatePaginator) {
          if (xentralAuftrag.ihrebestellnummer === order.orderNumber) {
            existingXentralAuftrag = xentralAuftrag;
            break;
          }
        }
      } catch (error) {
        if (error instanceof XentralRestNotFoundError) {
          this.logger.debug(
            "No Xentral Auftrag found for the specified Date, therefore we assume that no Auftag exists with the same Ordernumber.",
          );
        } else {
          throw error;
        }
      }
      if (existingXentralAuftrag) {
        this.logger.error(
          `There already exist an Auftrag in Xentral for this ECI Order ${order.orderNumber}. ` +
            `We will try to attach this XentralProxyAuftrag to Order in ECI DB. Please check ` +
            `manually in your Xentral Account what could cause this out-of-sync.`,
          {
            orderId: order.id,
            tenantId: this.tenantId,
            orderNumber: order.orderNumber,
            xentralIhrebestellnr: existingXentralAuftrag.ihrebestellnummer,
            xentralAuftragId: existingXentralAuftrag.id,
            xentralAuftragBelegNr: existingXentralAuftrag.belegnr,
          },
        );
      }
      const resData: Auftrag | AuftragCreateResponse = existingXentralAuftrag
        ? existingXentralAuftrag
        : await xentralXmlClient.AuftragCreate(auftrag);
      const createdXentralAuftrag = await this.db.xentralProxyAuftrag.create({
        data: {
          id: resData.id.toString(),
          order: {
            connect: {
              id: order.id,
            },
          },
          xentralBelegNr: resData.belegnr,
          xentralId: resData.id,
          xentralProxyApp: {
            connect: {
              id: this.xentralProxyApp.id,
            },
          },
        },
      });
      this.logger.info(
        existingXentralAuftrag
          ? "Attached xentralProxyAuftrag to ECI Order."
          : "Created new xentralProxyAuftrag for current order",
        {
          orderId: order.id,
          tenantId: this.tenantId,
          orderNumber: order.orderNumber,
          xentralAuftragId: createdXentralAuftrag.xentralId,
          xentralAuftragBelegNr: createdXentralAuftrag.xentralBelegNr,
        },
      );
    }
  }
}
