import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { EventSchemaRegistry } from "@eci/pkg/events";
import { isValidTransition } from "./eventSorting";

export type PackageEventHandlerConfig = {
  db: PrismaClient;
  onSuccess: (
    ctx: Context,
    res: EventSchemaRegistry.PackageStateTransition["message"],
  ) => Promise<void>;
  logger: ILogger;
};

export class PackageEventHandler {
  private db: PrismaClient;

  private onSuccess: (
    ctx: Context,
    res: EventSchemaRegistry.PackageStateTransition["message"],
  ) => Promise<void>;

  private logger: ILogger;

  constructor(config: PackageEventHandlerConfig) {
    this.db = config.db;
    this.onSuccess = config.onSuccess;
    this.logger = config.logger;
  }

  public async handleEvent(
    ctx: Context,
    event: EventSchemaRegistry.PackageUpdate["message"],
  ): Promise<void> {
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
    const currentState = storedPackage.state;

    const eventId = id.id("event");

    const shouldUpdateState = isValidTransition(currentState, event.state);

    this.logger.info("decition", {
      currentState,
      nextState: event.state,
      shouldUpdateState,
    });

    await this.db.package.update({
      where: {
        id: storedPackage.id,
      },
      data: {
        state: isValidTransition(currentState, event.state)
          ? event.state
          : undefined,
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
