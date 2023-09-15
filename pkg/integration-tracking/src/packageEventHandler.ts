import { id } from "@eci/pkg/ids";
import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { EventSchemaRegistry, RuntimeContextHandler } from "@eci/pkg/events";
import { isValidTransition } from "./eventSorting";

export interface PackageEventHandlerConfig {
    db: PrismaClient;
    onSuccess: (
        ctx: Context,
        res: EventSchemaRegistry.PackageStateTransition["message"],
    ) => Promise<void>;
}

/**
 * Handles events sent from any parcel service.
 *
 * Different parcel services send us webhooks with package updates and we merge
 * those into a unified schema in the api. That unifiedm essage is then sent
 * over Kafka and will be processed here.
 *
 * Events are not guaranteed to be in chronological order and we simply create
 * a new entry in our `PackageEvent` table. The PackageEvents can be consumed
 * via graphql or in different eventHandlers.
 */
export class PackageEventHandler {
    private readonly db: PrismaClient;

    private readonly onSuccess: (
        ctx: Context,
        res: EventSchemaRegistry.PackageStateTransition["message"],
    ) => Promise<void>;

    constructor(config: PackageEventHandlerConfig) {
        this.db = config.db;
        this.onSuccess = config.onSuccess;
    }

    public async handleEvent(
        ctx: RuntimeContextHandler,
        event: EventSchemaRegistry.PackageUpdate["message"],
    ): Promise<void> {
        const logger = ctx.logger.with({ handler: "packageeventhandler" });
        logger.info(
            // eslint-disable-next-line max-len
            `Package Event Handler - new message. State: ${event.state} - Tracking Number: ${event.trackingId}`,
            {
                trackingId: event.trackingId,
            },
        );
        const storedPackage = await this.db.package.findFirst({
            where: {
                trackingId: event.trackingId,
            },
            include: {
                events: {
                    orderBy: {
                        time: "desc",
                    },
                },
                order: true,
            },
        });
        if (storedPackage == null) {
            logger.error(
                `No package found with tracking id: ${event.trackingId}`,
                {
                    trackingId: event.trackingId,
                },
            );
            /**
             * TODO: We return here, so that this message is not blocking the queue. Might be good here
             * to use a retry queue and try again in 20 mins, as the package often takes time to
             * be processed
             */
            return;
        }
        const currentState = storedPackage.state;

        const existingEvents = storedPackage.events;

        const eventDate = new Date(event.time * 1000);

        if (
            existingEvents &&
            existingEvents.some((e) => e.time === eventDate)
        ) {
            logger.info(`The current event date is the same as from an existing one in \
      our DB: ${eventDate}. Assuming, that we already have this event in our DB. Skipping..`);
            return;
        }

        const eventId = id.id("event");

        logger.info("Updating package state", {
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
                        time: eventDate,
                        state: event.state,
                        location: event.location,
                        message: event.message ?? null,
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
