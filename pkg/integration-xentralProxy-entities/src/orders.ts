/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralClient } from "@eci/pkg/xentral";
import { AuftragCreateRequest } from "@eci/pkg/xentral/src/types";

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
    const xentralClient = new XentralClient(this.xentralProxyApp);
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
            warehouseId: this.warehouseId,
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
      if (!order.shippingAddress) continue;
      const auftrag: AuftragCreateRequest = {
        kundennummer: "NEW",
        name: order.shippingAddress?.fullname || "",
        strasse: order.shippingAddress?.street || "",
        plz: order.shippingAddress?.plz || "",
        ort: order.shippingAddress?.city || "",
        land: order.shippingAddress?.countryCode || "",
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
      const xentralResData = await xentralClient.AuftragCreate(auftrag);
      const createdXentralAuftrag = await this.db.xentralProxyAuftrag.create({
        data: {
          id: xentralResData.id.toString(),
          order: {
            connect: {
              id: order.id,
            },
          },
          xentralBelegNr: xentralResData.belegnr,
          xentralId: xentralResData.id,
          xentralProxyApp: {
            connect: {
              id: this.xentralProxyApp.id,
            },
          },
        },
      });
      this.logger.info("Created new xentralAuftrag for current order", {
        orderId: order.id,
        tenantId: this.tenantId,
        orderNumber: order.orderNumber,
        xentralAuftragId: createdXentralAuftrag.xentralId,
        xentralAuftragBelegNr: createdXentralAuftrag.xentralBelegNr,
      });
    }
  }
}
