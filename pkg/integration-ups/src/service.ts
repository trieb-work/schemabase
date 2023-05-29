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
import { subMonths, parse } from "date-fns";

interface UPSTrackingSyncServiceConfig {
  upsTrackingApp: UPSTrackingApp;
  db: PrismaClient;
  logger: ILogger;
  testMode?: boolean;
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
      // M Billing Information Received
      case "M":
        return PackageState.INFORMATION_RECEIVED;

      case "I":
        return PackageState.IN_TRANSIT;

      case "D":
        return PackageState.DELIVERED;

      // Delivered Origin CFS (Freight Only)
      case "DO":
        return PackageState.DELIVERED;

      //  Delivered Destination CFS (Freight Only)
      case "DD":
        return PackageState.DELIVERED;

      case "X":
        return PackageState.EXCEPTION;

      // P Pickup - package got picked-up
      case "P":
        return PackageState.DELIVERED;

      case "NA":
        return PackageState.PENDING;

      case "O":
        return PackageState.OUT_FOR_DELIVERY;

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

      const shipment = fullPackage?.trackResponse?.shipment[0]?.package?.[0];

      if (!shipment) {
        continue;
      }

      // The last = most recent package tracking update
      const lastState = shipment.activity[0];

      const internalState = this.parseState(lastState.status?.type);
      if (!internalState) {
        this.logger.error(
          `Could not parse package state ${lastState.status?.type}` +
            `to our internal package state for ${p.trackingId}`,
        );
        continue;
      }
      this.logger.debug(internalState);

      /**
       * The status message coming from UPS - like: "Processing at UPS Facility"
       */
      const statusMessage = lastState.status.description as string;

      // eslint-disable-next-line max-len
      const shipmentLocation = `${lastState.location.address.city}, ${lastState.location.address.stateProvince}, ${lastState.location.address.countryCode}`;

      if (!this.upsTrackingApp.trackingIntegrationId) {
        this.logger.info(
          `There is no tracking integration configured for UPS App ${this.upsTrackingApp.id}.` +
            "Not updating package state",
        );
        continue;
      }

      /**
       * Parse date & time - UPS gives us "localtime", so we might need to fix the timezone select
       */
      const time = parse(
        `${lastState.date} ${lastState.time}`,
        "yyyyMMdd HHMMSS",
        new Date(),
      );
      const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
        trackingId: p.trackingId,
        time: time.getTime() / 1000,
        location: shipmentLocation,
        state: internalState,
        trackingIntegrationId: this.upsTrackingApp.trackingIntegrationId,
        message: statusMessage,
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
