import { KafkaProducer, Message } from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { PackageUpdateDoneEvent, Topic } from "..";
import { PackageEvent } from "./types";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";

export type TrackingConfig = {
  db: PrismaClient;
  eventProducer: KafkaProducer<unknown>;
  logger: ILogger;
};

export class Tracking {
  private db: PrismaClient;

  private eventProducer: KafkaProducer<unknown>;

  private logger: ILogger;

  constructor(config: TrackingConfig) {
    this.db = config.db;
    this.eventProducer = config.eventProducer;
    this.logger = config.logger;
  }

  public async handlePackageEvent(
    ctx: Context,
    event: PackageEvent,
  ): Promise<void> {
    const storedPackage = await this.db.package.findUnique({
      where: {
        trackingId: event.trackingId,
      },
      include: {
        events: true,
      },
    });
    if (!storedPackage) {
      throw new Error(`No package found with tracking id: ${event.trackingId}`);
    }
    this.logger.info("packageEvent", {
      event,
      storedPackage,
    });
    await this.db.packageEvent.create({
      data: {
        id: id.id("event"),
        time: new Date(event.time * 1000),
        state: event.state,
        location: event.location,
        message: event.message ?? "No message",
        packageId: storedPackage.id,
        // package: {
        //   connect: {
        //     id: storedPackage.id,
        //   },
        // },
      },
    });

    const message = new Message<PackageUpdateDoneEvent>({
      header: {
        traceId: ctx.traceId,
      },
      content: {
        packageId: storedPackage.id,
        shouldSendEmail: true,
      },
    });

    await this.eventProducer.produce(Topic.PACKAGE_UPDATE_DONE, message);
  }
}
