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
import { AuftragCreateRequest, AuftragCreateResponse } from "@eci/pkg/xentral/src/xml/types";

interface XentralProxyOrderSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  xentralXmlClient: XentralXmlClient;
  xentralRestClient: XentralRestClient;
  db: PrismaClient;
  logger: ILogger;
  warehouseId: string;
}

export class XentralProxyOrderSyncService {
  private readonly logger: ILogger;

  public readonly tenantId: string;

  public readonly warehouseId: string;

  public readonly xentralProxyApp: XentralProxyApp;

  public readonly xentralXmlClient: XentralXmlClient;

  public readonly xentralRestClient: XentralRestClient;

  private readonly db: PrismaClient;

  public constructor(config: XentralProxyOrderSyncServiceConfig) {
    this.logger = config.logger;
    this.tenantId = config.xentralProxyApp.tenantId;
    this.xentralProxyApp = config.xentralProxyApp;
    this.warehouseId = config.warehouseId;
    this.db = config.db;
    this.xentralXmlClient = config.xentralXmlClient;
    this.xentralRestClient = config.xentralRestClient;
  }

  public async syncFromECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const orders = await this.db.order.findMany({
      where: {
        orderStatus: "confirmed",
        paymentStatus: "fullyPaid",
        shipmentStatus: {
          in: ["pending", "partiallyShipped"]
        },
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
        /**
         * only sync orders which have at least one lineitem for the specified warehouse
         */
        orderLineItems: {
          some: {
            productVariant: {
              defaultWarehouseId: this.warehouseId,
            }
          },
        }
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
    this.logger.info(`Will sync ${orders.length} Orders with Xentral.`);
    for (const order of orders) {
      // TODO add try/catch block from other services
      const defaultLogFields = {
        orderId: order.id,
        tenantId: this.tenantId,
        orderNumber: order.orderNumber,
      };
      if (!order.shippingAddress) {
        this.logger.warn("Skipping sync of Order because of missing shipping Address", defaultLogFields)
        continue;
      }
      if(!order.shippingAddress?.fullname){
        this.logger.error(
          "Skipping sync of Order because order.shippingAddress.fullname is empty. Please double check. "+
          "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
        defaultLogFields);
        continue;
      }
      if(!order.shippingAddress?.street){
        this.logger.error(
          "Skipping sync of Order because order.shippingAddress.street is empty. Please double check. "+
          "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
        defaultLogFields);
        continue;
      }
      if(!order.shippingAddress?.plz){
        this.logger.error(
          "Skipping sync of Order because order.shippingAddress.plz is empty. Please double check. "+
          "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
        defaultLogFields);
        continue;
      }
      if(!order.shippingAddress?.city){
        this.logger.error(
          "Skipping sync of Order because order.shippingAddress.city is empty. Please double check. "+
          "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
        defaultLogFields);
        continue;
      }
      const xentralAuftraegeWithSameDatePaginator = this.xentralRestClient.getAuftraege({
        // "datum": format(order.date, "yyyy-MM-dd"),
        "datum": order.date.toJSON(),
      }, 1000);
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
          this.logger.debug("No Xentral Auftrag found for the specified Date, therefore we assume that no Auftag exists with the same Ordernumber.");
        } else {
          throw error;
        }
      }
      if (existingXentralAuftrag) {
        this.logger.error(
          `There already exist an Auftrag in Xentral for this ECI Order ${order.orderNumber}. ` +
          `We will try to attach this XentralProxyAuftrag to Order in ECI DB. Please check ` +
          `manually in your Xentral Account what could cause this out-of-sync-issue.`, {
          orderId: order.id,
          tenantId: this.tenantId,
          orderNumber: order.orderNumber,
          xentralIhrebestellnr: existingXentralAuftrag.ihrebestellnummer,
          xentralAuftragId: existingXentralAuftrag.id,
          xentralAuftragBelegNr: existingXentralAuftrag.belegnr,
        });
      }
      const auftrag: AuftragCreateRequest = {
        kundennummer: "NEW",
        name: order.shippingAddress.fullname,
        strasse: order.shippingAddress.street || "",
        adresszusatz: order.shippingAddress?.additionalAddressLine || "",
        // email: order.mainContact.email // TODO disabled for now because we want to send tracking emails by our own, and do not want to risk that kramer sends some emails
        projekt: String(this.xentralProxyApp.projectId),
        // : order.shippingAddress.company || "", //TODO all missing other shippingaddr fields 
        plz: order.shippingAddress.plz || "",
        ort: order.shippingAddress.city || "",
        land: order.shippingAddress.countryCode || "DE", // TODO make default country a config option in tenant
        ihrebestellnummer: order.orderNumber,
        // INFO: do not remove date otherwise search will not work anymore!
        datum: order.date.toJSON(),
        artikelliste: {
          position: order.orderLineItems.map((lineItem) => {
            if (!lineItem?.productVariant?.xentralArtikel?.[0]?.xentralNummer) {
              throw new Error(
                `No matching xentral artikel for lineItem (${lineItem.sku}). Please sync new productVariants first to xentral artikel before creating an xentral auftrag.`,
              );
            }
            return {
              id: lineItem.productVariant.xentralArtikel[0].id,
              nummer: lineItem.productVariant.xentralArtikel[0].xentralNummer,
              // preis: 0,
              // waehrung: "EUR",
              projekt: this.xentralProxyApp.projectId,
              menge: lineItem.quantity,
            };
          }),
        },
      };
      if(!auftrag.artikelliste?.position || auftrag.artikelliste?.position.length === 0){
        throw new Error("Can not sync an Auftrag with an empty artikelliste");
      }
      const resData: Auftrag | AuftragCreateResponse = existingXentralAuftrag ? existingXentralAuftrag : await this.xentralXmlClient.AuftragCreate(auftrag);
      const createdXentralAuftrag = await this.db.xentralProxyAuftrag.create({
        data: {
          id: resData.id,
          order: {
            connect: {
              id: order.id,
            },
          },
          xentralBelegNr: resData.belegnr,
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
          xentralAuftragId: createdXentralAuftrag.id,
          xentralAuftragBelegNr: createdXentralAuftrag.xentralBelegNr,
        },
      );
    }
  }
}
