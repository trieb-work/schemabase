/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { ILogger } from "@eci/pkg/logger";
import { arrayFromAsyncGenerator } from "@eci/pkg/miscHelper/array";
import { Carrier, OrderShipmentStatus, PackageState, PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralRestClient, XentralRestNotFoundError } from "@eci/pkg/xentral/src/rest";
import { Auftrag, Lieferschein } from "@eci/pkg/xentral/src/rest/types";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import { AuftragCreateRequest, AuftragCreateResponse } from "@eci/pkg/xentral/src/xml/types";
import { id } from "@eci/pkg/ids";

interface XentralProxyLieferscheinSyncServiceConfig {
  xentralProxyApp: XentralProxyApp;
  xentralXmlClient: XentralXmlClient;
  xentralRestClient: XentralRestClient;
  db: PrismaClient;
  logger: ILogger;
}

export class XentralProxyLieferscheinSyncService {
  private readonly logger: ILogger;

  public readonly tenantId: string;

  public readonly xentralProxyApp: XentralProxyApp;

  public readonly xentralXmlClient: XentralXmlClient;

  public readonly xentralRestClient: XentralRestClient;

  private readonly db: PrismaClient;

  public constructor(config: XentralProxyLieferscheinSyncServiceConfig) {
    this.logger = config.logger;
    this.tenantId = config.xentralProxyApp.tenantId;
    this.xentralProxyApp = config.xentralProxyApp;
    this.db = config.db;
    this.xentralXmlClient = config.xentralXmlClient;
    this.xentralRestClient = config.xentralRestClient;
  }

  public async syncToECI(): Promise<void> {
    this.logger.info("Starting sync of ECI Orders to XentralProxy Aufträge");
    const orders = await this.db.order.findMany({
      where: {
        // TODO check which filters make sense?
        orderStatus: "confirmed",
        paymentStatus: "fullyPaid",
        shipmentStatus: {
          in: ["pending", "partiallyShipped"]
        },
        readyToFullfill: true,
        /**
         * only include orders which have already been transfered to the current xentral instance and
         * therefore have one xentralProxyAuftrag with the current xentral instance
         */
        xentralProxyAuftraege: {
          some: {
            xentralProxyAppId: this.xentralProxyApp.id,
          },
        },
      },
      include: {
        shippingAddress: true,
        xentralProxyAuftraege: {
          where: {
            xentralProxyAppId: this.xentralProxyApp.id
          }
        },
        orderLineItems: true,
      },
    });
    this.logger.info(`Will sync Xentral Lieferscheine to Packages for ${orders.length} Orders with Xentral.`);
    for (const order of orders) {
      // TODO add try/catch block from other services
      if (
        !order.xentralProxyAuftraege ||
        order.xentralProxyAuftraege.length === 0
      ) {
        throw new Warning(
          "No xentralProxyAuftraege set for this order. " +
            "Aborting sync of this order. Try again after xentral auftrag sync.",
        );
      }
      if (order.xentralProxyAuftraege.length > 1) {
        throw new Error(
          "Multiple xentralProxyAuftraege set for the mainContact of this order. " +
            "Aborting sync of this order.",
        );
      }
      // Main Auftrag
      const xentralParentAuftrag = order.xentralProxyAuftraege[0];
      // We need to fetch auftraege again because it could be that one Auftrag was splitted in two or more if it does not fit in one package.
      const xentralChildAndParentAuftraege = await arrayFromAsyncGenerator(this.xentralRestClient.getAuftraege({
        belegnr_startswith: xentralParentAuftrag.xentralBelegNr,
      }));
      const trackingnummern = await arrayFromAsyncGenerator(this.xentralRestClient.getTrackingnummern({
        belegnr_startswith: xentralParentAuftrag.xentralBelegNr,
      }));
      console.log("trackingnummern", trackingnummern);
      console.log("xentralChildAndParentAuftraege", xentralChildAndParentAuftraege, order);
      const packagedItems:{[sku: string]: number} = {}
      for(const auftrag of xentralChildAndParentAuftraege){
        const lieferscheine = await arrayFromAsyncGenerator(this.xentralRestClient.getLieferscheine({
          auftragid: auftrag.id,
          include: "positionen",
        }));
        if(lieferscheine.length > 1){
          this.logger.error("Xentral returned multiple lieferscheine for a lieferscheine search with an auftrag id", {
            xentralAuftragId: auftrag.id,
          });
          continue;
        }
        if(lieferscheine.length === 0){
          this.logger.info("Xentral returned no lieferscheine for a lieferscheine search with an auftrag id. Could be that logistics partner is still processing this Auftrag.", {
            xentralAuftragId: auftrag.id,
          });
          continue;
        }
        const lieferschein = lieferscheine[0];
        const matchingTrackingnummers = trackingnummern.filter((tr) => tr.auftrag === auftrag.belegnr && tr.lieferschein === lieferschein.belegnr);
        const loggingFields = {
          order: order.id,
          orderNumber: order.orderNumber,
          xentralAuftragId: auftrag.id,
          xentralAuftragBelegnr: auftrag.belegnr,
          xentralAuftragStatus: auftrag.status,
          xentralLieferscheinId: lieferschein.id,
          xentralLieferscheinBelegnr: lieferschein.belegnr,
          xentralLieferscheinStatus: lieferschein.status,
        }
        if(!lieferschein.positionen || lieferschein.positionen.length === 0){
          this.logger.error("Xentral returned a lieferschein without any positions. Aborting sync. Please check this order manually.", loggingFields);
          continue;
        }
        if(matchingTrackingnummers.length > 1){
          // TODO: possible workaround if kramer does this would be to create multiple packages but then we do not know how the positions are split up across
          // these packages so we have to split them up "randomly"
          this.logger.error("Xentral returned multiple trackingnummern for one lieferscheine. This is currently not supported. Please check this order manually", loggingFields);
          continue;
        }
        if(matchingTrackingnummers.length === 0){
          if(lieferschein.status === "versendet"){
            this.logger.error("Xentral returned no trackingnummer for this lieferscheine, but the lieferschein was in status versendet. Please contact logisitics partner and clarify if he forgot set the trackingnumber for this lieferschein.", loggingFields);
          } else {
            this.logger.warn("Xentral returned no trackingnummer for this lieferscheine. Could be that logistics partner is still processing this Lieferschein.", loggingFields);
          }
          continue;
        }
        const matchingTrackingnummer = matchingTrackingnummers[0];
        let carrier: Carrier = Carrier.UNKNOWN;
        if(lieferschein.versandart.toLowerCase().includes("dhl")){
          carrier = Carrier.DHL;
        } else if(lieferschein.versandart.toLowerCase().includes("dpd")){
          carrier = Carrier.DPD;
        } else if(lieferschein.versandart.toLowerCase().includes("ups")){
          carrier = Carrier.UPS;
        }
        const packageNumber = `LF-${lieferschein.belegnr}_TRN-${matchingTrackingnummer.tracking}`;
        const createdPackage = await this.db.package.create({
          data: {
            id: id.id("package"),
            order: {
              connect: {
                id: order.id,
              },
            },
            carrier,
            number: `LF-${lieferschein.belegnr}_TRN-${matchingTrackingnummer.tracking}`,
            tenant: {
              connect: {
                id: this.tenantId,
              }
            },
            trackingId: matchingTrackingnummer.tracking,
            packageLineItems: {
              createMany: {
                // skipDuplicates: true, // TODO check if this is needed?
                data: lieferschein.positionen.map((p) => ({
                  quantity: Number(p.menge),
                  id: id.id("packageLineItem"),
                  tenantId: this.tenantId,
                  sku: p.nummer,
                  uniqueString: `${packageNumber}${p.nummer}${Number(p.menge)}`
                })),
              },
            },
            xentralLieferschein: {
              connectOrCreate: {
                where: {
                  id_xentralProxyAppId: {
                    id: lieferschein.id,
                    xentralProxyAppId: this.xentralProxyApp.id,  
                  }
                },
                create: {
                  id: lieferschein.id,
                  status: lieferschein.status,
                  xentralBelegNr: lieferschein.belegnr,
                  xentralProxyApp: {
                    connect: {
                      id: this.xentralProxyApp.id,
                    }
                  }
                }
              },
            },
          },
        });
        for(const pos of lieferschein.positionen){
          if(!packagedItems[pos.nummer]){
            packagedItems[pos.nummer] = Number(pos.menge)
          } else {
            packagedItems[pos.nummer] += Number(pos.menge);
          }
        }
        this.logger.info(
          "Created new Package and XentralLieferschein for current order",
          {
            ...loggingFields,
            trackingnummer: matchingTrackingnummer.tracking,
          }
        );
      }
      // If there is a lineitem in the order which was not packaged (!packagedItems[li.sku]) or has less quantity packaged 
      const shipmentStatus = order.orderLineItems.some((li) => {
        if(!packagedItems[li.sku]){
          this.logger.info("The current order has a unpackaged line item",{
            sku: li.sku,
            orderNumber: order.orderNumber,
          })
          return true;
        } else if(packagedItems[li.sku] < li.quantity){
          this.logger.info("The current order has a underpackaged line item",{
            sku: li.sku,
            desiredQuantity: li.quantity,
            actualQuantity: packagedItems[li.sku],
            orderNumber: order.orderNumber,
          });
          return true;
        } else if(packagedItems[li.sku] > li.quantity){
          this.logger.info("The current order has a line item which have been shiped more than needed! Please check this Order manually.",{
            sku: li.sku,
            desiredQuantity: li.quantity,
            actualQuantity: packagedItems[li.sku],
            orderNumber: order.orderNumber,
          });
          return false;
        } else {
          return false;
        }
      }) ? OrderShipmentStatus.partiallyShipped : OrderShipmentStatus.shipped;
      this.db.order.update({
        where: {
          id: order.id
        },
        data: {
          shipmentStatus
        }
      })
    }
  }
}
