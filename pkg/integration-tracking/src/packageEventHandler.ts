import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { EventSchemaRegistry } from "@eci/pkg/events";
import { isValidTransition } from "./eventSorting";

export interface PackageEventHandlerConfig {
  db: PrismaClient;
  onSuccess: (
    ctx: Context,
    res: EventSchemaRegistry.PackageStateTransition["message"],
  ) => Promise<void>;
  logger: ILogger;
}

export class PackageEventHandler {
  private readonly db: PrismaClient;

  private readonly onSuccess: (
    ctx: Context,
    res: EventSchemaRegistry.PackageStateTransition["message"],
  ) => Promise<void>;

  private readonly logger: ILogger;

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
    if (storedPackage == null) {
      throw new Error(`No package found with tracking id: ${event.trackingId}`);
    }
    const currentState = storedPackage.state;

    const eventId = id.id("event");

    this.logger.info("Updating package state", {
      trackingId: event.trackingId,
      state: event.state,
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
