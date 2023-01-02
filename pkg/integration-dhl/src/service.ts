import { CronStateHandler } from "@eci/pkg/cronstate";
import { ILogger } from "@eci/pkg/logger";
import { sleep } from "@eci/pkg/miscHelper/time";
import { DHLTrackingApp, PrismaClient } from "@eci/pkg/prisma";
import { subMonths } from "date-fns";
import { Configuration, DefaultApi } from "./typescript-axios-client";
import { RequiredError } from "./typescript-axios-client/base";

interface DHLTrackingSyncServiceConfig {
  dhlTrackingApp: DHLTrackingApp;
  db: PrismaClient;
  logger: ILogger;
}

export class DHLTrackingSyncService {
  private readonly logger: ILogger;

  public readonly dhlTrackingApp: DHLTrackingApp;

  private readonly db: PrismaClient;

  private readonly cronState: CronStateHandler;

  public constructor(config: DHLTrackingSyncServiceConfig) {
    this.logger = config.logger;
    this.dhlTrackingApp = config.dhlTrackingApp;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.dhlTrackingApp.tenantId,
      appId: this.dhlTrackingApp.id,
      db: this.db,
      syncEntity: "packageState",
    });
  }

  private createAPIClient(apiKey: string): DefaultApi {
    const conf = new Configuration({ apiKey });
    return new DefaultApi(conf, "https://api-eu.dhl.com/track");
  }

  public async syncToECI(): Promise<void> {
    const dhlClient = this.createAPIClient(this.dhlTrackingApp.apiKey);

    /// get all DHL packages, that are not delivered
    // with last status update older than 2 hours, to prevent too many API calls

    const dhlPackages = await this.db.package.findMany({
      where: {
        tenantId: this.dhlTrackingApp.tenantId,
        carrier: "DHL",
        state: {
          not: "DELIVERED",
        },
        trackingId: {
          not: null,
        },
        createdAt: {
          gt: subMonths(new Date(), 2),
        },
      },
    });

    this.logger.info(
      `Receiving ${dhlPackages.length} DHL packages, that we pull status updates from`,
    );

    for (const p of dhlPackages) {
      if (!p.trackingId) continue;
      this.logger.info(`Pulling package data from DHL for ${p.trackingId}`);

      const fullPackage = await dhlClient
        .shipmentsGet(
          p.trackingId,
          undefined,
          undefined,
          undefined,
          undefined,
          "en",
        )
        .catch((e) => {
          if ((e as any)?.response?.data?.status === 404) {
            this.logger.info(
              `No package with tracking Number ${p.trackingId} returned from DHL!`,
            );
          } else if ((e as any)?.response?.data?.status === 429) {
            this.logger.error(`Throttling Error from DHL: 429`);
          } else {
            this.logger.error(`Error pulling data from DHL:`, e);
          }
        });

      const shipment = fullPackage?.data?.shipments?.[0];

      if (!shipment) {
        continue;
      }
      this.logger.info(JSON.stringify(shipment.status));
      await sleep(2000);
    }
  }
}
