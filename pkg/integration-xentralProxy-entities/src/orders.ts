/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
  PrismaClient, XentralProxyApp,
} from "@eci/pkg/prisma";
import { XentralClient } from "@eci/pkg/xentral";
import { AuftragCreateRequest } from "@eci/pkg/xentral/src/types";
import { id } from "@eci/pkg/ids";

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
            xentralProxyAppId: this.xentralProxyApp.id
          }
        }
      },
      include: {
        /**
         * only include these lineItems for each order which are from the same warehouse as the 
         * current xentral integration
         */
        lineItems: {
          where: {
            warehouseId: this.warehouseId,
          },
        },
        xentralProxyAuftraege: true
      },
    })
    for (const order of orders) {
      const auftrag: AuftragCreateRequest = {
        kundennummer: "NEW",
        artikelliste: {
          position: order.lineItems.map((lineItem) => ({
            artikel: lineItem.sku,
            menge: lineItem.quantity,
          }))
        }
      }
      const xentralResData = await xentralClient.AuftragCreate(auftrag);
      const createdXentralAuftrag = await this.db.xentralProxyAuftrag.create({
        data: {
          createdAt: new Date(),
          updatedAt: new Date(),
          id: id.id("xentralAuftrag"),
          order: {
            connect: {
              id: order.id
            }
          },
          xentralBelegNr: xentralResData.belegnr,
          xentralId: xentralResData.id,
          xentralProxyApp: {
            connect: {
              id: this.xentralProxyApp.id,
            }
          },
        }
      });
      this.logger.info("Created new xentralAuftrag for current order", {
        orderId: order.id,
        tenantId: this.tenantId,
        orderNumber: order.orderNumber,
        xentralAuftragId: createdXentralAuftrag.xentralId,
        xentralAuftragBelegNr: createdXentralAuftrag.xentralBelegNr,
      })
    }
  }
}
