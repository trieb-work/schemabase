import { CronStateHandler } from "@eci/pkg/cronstate";
import {
  BullMQProducer,
  EventSchemaRegistry,
  Message,
  Topic,
} from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { sleep } from "@eci/pkg/miscHelper/time";
import { DHLTrackingApp, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { subMonths } from "date-fns";
import {
  Configuration,
  DefaultApi,
  SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum,
} from "./typescript-axios-client";

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

  parseState = (
    state: SupermodelIoLogisticsTrackingShipmentEventStatusCodeEnum,
  ): PackageState | null => {
    switch (state) {
      case "pre-transit":
        return PackageState.INFORMATION_RECEIVED;

      case "transit":
        return PackageState.IN_TRANSIT;

      case "delivered":
        return PackageState.DELIVERED;

      case "failure":
        return PackageState.EXCEPTION;

      default:
        return null;
    }
  };

  private createAPIClient(apiKey: string): DefaultApi {
    const conf = new Configuration({ apiKey });
    return new DefaultApi(conf, "https://api-eu.dhl.com/track");
  }

  public async syncToECI(): Promise<void> {
    await this.cronState.get();
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
      if (!shipment.status?.statusCode || !shipment?.status?.timestamp)
        continue;
      const internalState = this.parseState(shipment.status?.statusCode);
      if (!internalState) {
        this.logger.error(
          `Could not parse package state ${shipment.status?.statusCode}` +
            `to our internal package state for ${p.trackingId}`,
        );
        continue;
      }
      this.logger.info(internalState);

      if (!this.dhlTrackingApp.trackingIntegrationId) {
        this.logger.info(
          `There is no tracking integration configured for DHL App ${this.dhlTrackingApp.id}.` +
            "Not updating package state",
        );
        continue;
      }

      const time = new Date(shipment.status.timestamp as string);
      const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
        trackingId: p.trackingId,
        time: time.getTime() / 1000,
        location: shipment.status.location?.address?.addressLocality || "",
        state: internalState,
        trackingIntegrationId: this.dhlTrackingApp.trackingIntegrationId,
      };

      const bullmq = await BullMQProducer.new<
        EventSchemaRegistry.PackageUpdate["message"]
      >({
        topic: Topic.PACKAGE_UPDATE,
        tenantId: this.dhlTrackingApp.tenantId,
      });

      const message = new Message({
        header: {
          traceId: id.id("trace"),
        },
        content: packageEvent,
      });

      const { messageId } = await bullmq.produce(Topic.PACKAGE_UPDATE, message);
      this.logger.info(`Created bullmq message with ID ${messageId}`);
      await sleep(5000);
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
