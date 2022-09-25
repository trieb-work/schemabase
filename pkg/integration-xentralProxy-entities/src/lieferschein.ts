/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import { XentralRestClient, XentralRestNotFoundError } from "@eci/pkg/xentral/src/rest";
import { Auftrag, Lieferschein } from "@eci/pkg/xentral/src/rest/types";
import { XentralXmlClient } from "@eci/pkg/xentral/src/xml";
import { AuftragCreateRequest, AuftragCreateResponse } from "@eci/pkg/xentral/src/xml/types";

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
        // orderStatus: "confirmed",
        // paymentStatus: "fullyPaid",
        // shipmentStatus: {
        //   in: ["pending", "partiallyShipped"]
        // },
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
      const xentralAuftrag = order.xentralProxyAuftraege[0];
      const xentralLieferscheinGenerator = this.xentralRestClient.getLieferscheine({
        // TODO: this will not work if auftrag is splitted in two!!
        auftragid: Number(xentralAuftrag.id), //TODO fix type in priscma schema
      });
      let xentralLieferschein: Lieferschein | undefined;
      for await(const lieferscheinTemp of xentralLieferscheinGenerator){
        if(lieferscheinTemp) {
          // TODO: this will not work if auftrag is splitted in two!!
          throw new Error("Search for xentral lieferschein with auftragsId returned multiple ")
        }
        xentralLieferschein = lieferscheinTemp;
      }
      console.log("xentralLieferschein", xentralLieferschein, order)
      // const createdXentralAuftrag = await this.db.xentralProxyAuftrag.create({
      //   data: {
      //     id: resData.id.toString(),
      //     order: {
      //       connect: {
      //         id: order.id,
      //       },
      //     },
      //     xentralBelegNr: resData.belegnr,
      //     xentralId: resData.id,
      //     xentralProxyApp: {
      //       connect: {
      //         id: this.xentralProxyApp.id,
      //       },
      //     },
      //   },
      // });
      // this.logger.info(
      //   existingXentralAuftrag ? "Attached xentralProxyAuftrag to ECI Order." : "Created new xentralProxyAuftrag for current order",
      //   {
      //     orderId: order.id,
      //     tenantId: this.tenantId,
      //     orderNumber: order.orderNumber,
      //     xentralAuftragId: createdXentralAuftrag.xentralId,
      //     xentralAuftragBelegNr: createdXentralAuftrag.xentralBelegNr,
      //   }
      // );
    }
  }
}
