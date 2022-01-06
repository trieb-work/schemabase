import { KafkaProducer, Message } from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { PackageStateTransitionEvent, Topic } from "./types";
import { PackageEvent } from "./types";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { shouldNotify } from "./eventSorting";
// import { EmailTemplateSender } from "@eci/pkg/email/src/emailSender";

export type TrackingConfig = {
  db: PrismaClient;
  eventProducer: KafkaProducer<unknown>;
  logger: ILogger;
  // emailTemplateSender: EmailTemplateSender;
};

export class Tracking {
  private db: PrismaClient;

  private eventProducer: KafkaProducer<unknown>;

  private logger: ILogger;

  // private emailTemplateSender: EmailTemplateSender;

  constructor(config: TrackingConfig) {
    this.db = config.db;
    this.eventProducer = config.eventProducer;
    this.logger = config.logger;
    // this.emailTemplateSender = config.emailTemplateSender;
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
    const currentState = storedPackage.state;
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
      },
    });
    await this.db.package.update({
      where: {
        id: storedPackage.id,
      },
      data: {
        state: event.state,
      },
    });

    if (shouldNotify(currentState, event.state)) {
      const integration = await this.db.trackingIntegration.findUnique({
        where: {
          id: event.trackingIntegrationId,
        },
        include: {
          trackingEmailApp: true,
        },
      });
      if (!integration) {
        throw new Error(
          `No trackingIntegration found for id: ${event.trackingIntegrationId}`,
        );
      }
      // const templateId = integration.trackingEmailApp.
      // const { id: emailId } = await this.emailTemplateSender.sendEmail();
    }

    const message = new Message<PackageStateTransitionEvent>({
      header: {
        traceId: ctx.traceId,
      },
      content: {
        packageId: storedPackage.id,
        oldState: currentState,
        newState: event.state,
      },
    });

    await this.eventProducer.produce(Topic.PACKAGE_STATE_TRANSITION, message);
  }
}
