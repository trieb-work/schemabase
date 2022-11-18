/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import { arrayFromAsyncGenerator } from "@eci/pkg/miscHelper/array";
import { Carrier, PrismaClient, XentralCarrier, XentralProxyApp } from "@eci/pkg/prisma";
import {
  XentralRestClient,
  XentralRestNotFoundError,
} from "@eci/pkg/xentral/src/rest";
import { Auftrag } from "@eci/pkg/xentral/src/rest/types";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import {
  AuftragCreateRequest,
  AuftragCreateResponse,
  AuftragEditRequest,
  AuftragEditResponse,
} from "@eci/pkg/xentral/src/xml/types";
import { subDays } from "date-fns";

interface XentralProxyOrderSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  xentralXmlClient: XentralXmlClient;
  xentralRestClient: XentralRestClient;
  db: PrismaClient;
  logger: ILogger;
}

export class XentralProxyOrderSyncService {
  private readonly logger: ILogger;

  public readonly tenantId: string;

  public readonly warehouseId: string;

  public readonly xentralProxyApp: XentralProxyApp;

  public readonly xentralXmlClient: XentralXmlClient;

  public readonly xentralRestClient: XentralRestClient;

  private readonly db: PrismaClient;

  public xentralCarriers :XentralCarrier[] | undefined;

  public constructor(config: XentralProxyOrderSyncServiceConfig) {
    this.logger = config.logger;
    this.tenantId = config.xentralProxyApp.tenantId;
    this.xentralProxyApp = config.xentralProxyApp;
    this.warehouseId = config.xentralProxyApp.warehouseId;
    this.db = config.db;
    this.xentralXmlClient = config.xentralXmlClient;
    this.xentralRestClient = config.xentralRestClient;
  }

  /**
   * Returns either a custom carrier from our DB or the regular one
   * @param carrier 
   * @returns 
   */
  private async versandArt(carrier :Carrier) {

    /**
     * Pull all xentral carriers one time
     */
    if (!this.xentralCarriers) this.xentralCarriers = await this.db.xentralCarrier.findMany({
      where: {
        xentralProxyAppId: this.xentralProxyApp.id
      }
    })

    if (this.xentralCarriers.length > 0) {
      return this.xentralCarriers.find((x) => x.eciCarrier === carrier)?.name || carrier
    }
    return carrier;

  }

  /**
   * This Service syncs ECI Orders to Xentral Aufträge
   *
   */
  public async syncFromECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const orders = await this.db.order.findMany({
      where: {
        orderStatus: "confirmed",
        shipmentStatus: {
          in: ["pending", "partiallyShipped"],
        },
        readyToFullfill: true, // TODO: in zukunft wäre es auch möglich hier das shipment date

        /**
         * Filter out orders, that are already too old. In this time window, we want to update
         * all orders in Xentral, as we see them as "active"
         */
        updatedAt: {
          gt: subDays(new Date(), 5),
        },

        /**
         * only include orders which have not been transfered to the current xentral instance and
         * therefore have no xentralProxyAuftrag with the current xentral instance. We change this logic,
         * to sync all orders without packages, so that we can update or create orders older than ~2-3 days
         */
        // xentralProxyAuftraege: {
        //   none: {
        //     xentralProxyAppId: this.xentralProxyApp.id,
        //   },
        // },
        /**
         * Filter out all orders with packages.
         */
        // packages: {
        //   none: {},
        // },
        /**
         * only sync orders which have at least one lineitem for the specified warehouse
         */
        orderLineItems: {
          some: {
            productVariant: {
              defaultWarehouseId: this.warehouseId,
            },
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
      if (!order.shippingAddress && order.carrier !== "PICKUP") {
        // TODO add try/catch block from other services -> use Warning Class
        this.logger.warn(
          "Skipping sync of Order because of missing shipping Address and carrier not PICKUP",
          defaultLogFields,
        );
        continue;
      }
      /**
       * These checks are just needed, when the order is not a PICKUP order
       */
      if (order.carrier !== "PICKUP") {
        if (!order.shippingAddress?.fullname) {
          // TODO add try/catch block from other services -> use Error Class
          this.logger.error(
            "Skipping sync of Order because order.shippingAddress.fullname is empty. Please double check. " +
              "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
            defaultLogFields,
          );
          continue;
        }
        if (!order.shippingAddress?.street) {
          this.logger.error(
            "Skipping sync of Order because order.shippingAddress.street is empty. Please double check. " +
              "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
            defaultLogFields,
          );
          continue;
        }
        if (!order.shippingAddress?.plz) {
          this.logger.error(
            "Skipping sync of Order because order.shippingAddress.plz is empty. Please double check. " +
              "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
            defaultLogFields,
          );
          continue;
        }
        if (!order.shippingAddress?.city) {
          this.logger.error(
            "Skipping sync of Order because order.shippingAddress.city is empty. Please double check. " +
              "If you want to override this check please write a space/blank in this field via ECI Prisma DB Dashboard.",
            defaultLogFields,
          );
          continue;
        }
      }

      let existingXentralAuftrag: Auftrag | undefined;
      try {
        const xentralAuftraegeWithSameDate = await arrayFromAsyncGenerator(
          this.xentralRestClient.getAuftraege(
            {
              // datum_gte: subDays(order.date, 1).toJSON(),
              internet: order.orderNumber,
            },
            1000,
          ),
        );
        if (xentralAuftraegeWithSameDate.length === 0) {
          this.logger.debug(
            "No Xentral Auftrag found for the specified Date, therefore we assume that no Auftag exists with the same Ordernumber.",
          );
        }
        const xentralAuftraegeWithSameOrderNumber =
          xentralAuftraegeWithSameDate.filter(
            (xa) => xa.internet === order.orderNumber,
          );
        if (xentralAuftraegeWithSameOrderNumber.length === 0) {
          this.logger.debug(
            "No Xentral Auftrag exists with the same Ordernumber.",
          );
        } else {
          const xentralParentAuftraegeWithSameOrderNumber =
            xentralAuftraegeWithSameDate.filter(
              (xa) => xa.teillieferungvon === 0,
            );
          if (xentralParentAuftraegeWithSameOrderNumber.length === 0) {
            this.logger.error(
              "A Xentral Auftrag with the same Ordernumber exists but, no Xentral Parent Auftrag exists with the same Ordernumber. This should not happen therefore aborting sync.",
            );
            continue;
          } else if (xentralParentAuftraegeWithSameOrderNumber.length > 1) {
            this.logger.error(
              "Multiple Xentral Parent Auftraege with the same Ordernumber exists. This should not happen therefore aborting sync.",
            );
            continue;
          } else {
            existingXentralAuftrag =
              xentralParentAuftraegeWithSameOrderNumber?.[0];
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

      const versandart = order.carrier ?  await this.versandArt(order.carrier) : undefined;


      const auftrag: AuftragCreateRequest = {
        kundennummer: "NEW",
        /**
         * If we have a company, we set the fullname as ansprechpartner. If not,
         * the fullname ist just in the name field
         */
        ansprechpartner: order?.shippingAddress?.fullname || "",
        name:
          order?.shippingAddress?.company || order?.shippingAddress?.fullname || "",
        strasse: order?.shippingAddress?.street || "",
        adresszusatz: order.shippingAddress?.additionalAddressLine || "",
        plz: order?.shippingAddress?.plz || "",
        ort: order?.shippingAddress?.city || "",
        land: order?.shippingAddress?.countryCode || "DE", // TODO make default country a config option in tenant
        // Ihre Bestellnummer scheint eher für Dropshipping etc. verwendung zu finden
        // ihrebestellnummer: order.orderNumber,
        internet: order.orderNumber,
        projekt: String(this.xentralProxyApp.projectId),
        // email: order.mainContact.email // TODO disabled for now because we want to send tracking emails by our own, and do not want to risk that kramer sends some emails
        // INFO: do not remove date otherwise search will not work anymore!
        datum: order.date.toJSON(),
        lieferdatum: order.expectedShippingDate?.toJSON(),
        versandart,
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
              projekt: this.xentralProxyApp.projectId,
              menge: lineItem.quantity,
              preis: lineItem.totalPriceGross || lineItem.totalPriceNet || undefined,
            };
          }),
        },
      };
      // if (existingXentralAuftrag) {
      // this.logger.error(
      //   `There already exist an Auftrag in Xentral for this ECI Order ${order.orderNumber}. ` +
      //     `We will try to attach this XentralProxyAuftrag to Order in ECI DB. Please check ` +
      //     `manually in your Xentral Account what could cause this out-of-sync-issue.`,
      //   {
      //     orderId: order.id,
      //     tenantId: this.tenantId,
      //     orderNumber: order.orderNumber,
      //     xentralIhrebestellnr: existingXentralAuftrag.ihrebestellnummer,
      //     xentralInternet: existingXentralAuftrag.internet,
      //     xentralAuftragId: existingXentralAuftrag.id,
      //     xentralAuftragBelegNr: existingXentralAuftrag.belegnr,
      //   },
      // );
      // }
      if (
        !auftrag.artikelliste?.position ||
        auftrag.artikelliste?.position.length === 0
      ) {
        throw new Error("Can not sync an Auftrag with an empty artikelliste");
      }

      const createOrUpdateXentralAuftrag = async () => {
        if (existingXentralAuftrag) {
          if (existingXentralAuftrag.status === "abgeschlossen") {
            this.logger.info(`Existing Xentral Auftrag ${existingXentralAuftrag.id} - ${existingXentralAuftrag.internet} is already closed. Don't update anything`);
            return existingXentralAuftrag;
          }
          // TODO: maybe don't do anything if auftrag is not in status "freigegeben"
          this.logger.info(
            `Updating Existing Xentral Auftrag ${existingXentralAuftrag.id} - ${existingXentralAuftrag.internet}`,
          );
          // TODO: how to make sure, that the shipment status is correct? 
          const auftragsStatus = order.shipmentStatus === "shipped" ? "abgeschlossen" : existingXentralAuftrag.status;
          const auftragUpdate: AuftragEditRequest = {
            ...auftrag,
            status: auftragsStatus,
            kundennummer: parseInt(existingXentralAuftrag.kundennummer),
            id: existingXentralAuftrag.id,
          };
          return this.xentralXmlClient.AuftragEdit(auftragUpdate);
        } else {
          return this.xentralXmlClient.AuftragCreate(auftrag);
        }
      };

      const resData: AuftragEditResponse | AuftragCreateResponse =
        await createOrUpdateXentralAuftrag();
      const createdXentralAuftrag = await this.db.xentralProxyAuftrag.upsert({
        where: {
          id_xentralProxyAppId: {
            id: resData.id,
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
        create: {
          id: resData.id,
          order: {
            connect: {
              id: order.id,
            },
          },
          xentralBelegNr: resData.belegnr.toString(),
          xentralProxyApp: {
            connect: {
              id: this.xentralProxyApp.id,
            },
          },
        },
        update: {
          order: {
            connect: {
              id: order.id,
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
