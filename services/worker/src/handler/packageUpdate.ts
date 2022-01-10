import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { EventHandler, OnSuccess, EventSchemaRegistry } from "@eci/pkg/events";

export type PackageEventHandlerConfig = {
  db: PrismaClient;
  logger: ILogger;
  onSuccess: OnSuccess<EventSchemaRegistry.PackageStateTransition["message"]>;
};

export class PackageEventHandler
  implements EventHandler<EventSchemaRegistry.PackageUpdate["message"]>
{
  private db: PrismaClient;

  private onSuccess: OnSuccess<
    EventSchemaRegistry.PackageStateTransition["message"]
  >;

  private logger: ILogger;

  constructor(config: PackageEventHandlerConfig) {
    this.db = config.db;
    this.logger = config.logger;
    this.onSuccess = config.onSuccess;
  }

  public async handleEvent(
    ctx: Context,
    event: EventSchemaRegistry.PackageUpdate["message"],
  ): Promise<void> {
    this.logger.info("New event", { event });
    const storedPackage = await this.db.package.findUnique({
      where: {
        trackingId: event.trackingId,
      },
      include: {
        events: true,
        order: true,
      },
    });
    if (!storedPackage) {
      throw new Error(`No package found with tracking id: ${event.trackingId}`);
    }
    this.logger.info("Found matching package", { storedPackage });
    const currentState = storedPackage.state;

    const eventId = id.id("event");
    await this.db.package.update({
      where: {
        id: storedPackage.id,
      },
      data: {
        state: event.state,
        events: {
          create: {
            id: eventId,
            time: new Date(event.time * 1000),
            state: event.state,
            location: event.location,
            message: event.message ?? "No message",
          },
        },
      },
    });

    await this.onSuccess(ctx, {
      packageEventId: eventId,
      previousState: currentState,
      integrationId: event.trackingIntegrationId,
    });
  }
}
