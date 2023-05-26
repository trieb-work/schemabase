import { CronStateHandler } from "@eci/pkg/cronstate";
import { env } from "@eci/pkg/env";
import {
  EventSchemaRegistry,
  KafkaProducer,
  Message,
  Signer,
  Topic,
} from "@eci/pkg/events";
import upsApi from "ups-api";

import { id } from "@eci/pkg/ids";
import { ILogger } from "@eci/pkg/logger";
import { sleep } from "@eci/pkg/miscHelper/time";
import { UPSTrackingApp, PackageState, PrismaClient } from "@eci/pkg/prisma";
import { subMonths } from "date-fns";

interface UPSTrackingSyncServiceConfig {
  upsTrackingApp: UPSTrackingApp;
  db: PrismaClient;
  logger: ILogger;
}

export class UPSTrackingSyncService {
  private readonly logger: ILogger;

  public readonly upsTrackingApp: UPSTrackingApp;

  private readonly db: PrismaClient;

  private readonly cronState: CronStateHandler;

  public constructor(config: UPSTrackingSyncServiceConfig) {
    this.logger = config.logger;
    this.upsTrackingApp = config.upsTrackingApp;
    this.db = config.db;
    this.cronState = new CronStateHandler({
      tenantId: this.upsTrackingApp.tenantId,
      appId: this.upsTrackingApp.id,
      db: this.db,
      syncEntity: "packageState",
    });
  }

  parseState = (state: string): PackageState | null => {
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

  private createAPIClient(apiKey: string) {
    return new upsApi.API({
      license: apiKey,
    });
  }

  public async syncToECI(): Promise<void> {
    await this.cronState.get();
    const upsClient = this.createAPIClient(this.upsTrackingApp.accessKey);

    /// get all UPS packages, that are not delivered
    // with last status update older than 2 hours, to prevent too many API calls

    const upsPackages = await this.db.package.findMany({
      where: {
        tenantId: this.upsTrackingApp.tenantId,
        carrier: "UPS",
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
      `Receiving ${upsPackages.length} UPS packages, that we pull status updates from`,
    );

    for (const p of upsPackages) {
      if (!p.trackingId) continue;
      this.logger.info(`Pulling package data from UPS for ${p.trackingId}`);

      const fullPackage = await upsClient.getTrackingDetails(p.trackingId);

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

      if (!this.upsTrackingApp.trackingIntegrationId) {
        this.logger.info(
          `There is no tracking integration configured for UPS App ${this.upsTrackingApp.id}.` +
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
        trackingIntegrationId: this.upsTrackingApp.trackingIntegrationId,
      };

      const kafka = await KafkaProducer.new<
        EventSchemaRegistry.PackageUpdate["message"]
      >({
        signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
      });

      const message = new Message({
        header: {
          traceId: id.id("trace"),
        },
        content: packageEvent,
      });

      const { messageId } = await kafka.produce(Topic.PACKAGE_UPDATE, message);
      this.logger.info(`Created Kafka message with ID ${messageId}`);
      await sleep(5000);
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
