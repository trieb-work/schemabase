import { PackageState } from "@eci/pkg/prisma";
export enum Topic {
    PACKAGE_UPDATE = "t&t.update",
    PACKAGE_STATE_TRANSITION = "t&t.state.transition",
    NOTIFICATION_EMAIL_SENT = "t&t.notification.email.sent",
}

export interface EventSchema<TTopic, TMessage> {
    topic: TTopic;
    message: TMessage;
}

export namespace EventSchemaRegistry {
    export type PackageUpdate = EventSchema<
        Topic.PACKAGE_UPDATE,
        {
            trackingId: string;
            location: string;
            /**
             * Timestamp in epoch: (new Date()).getTime() / 1000
             */
            time: number;
            state: PackageState;
            message?: string;
            trackingIntegrationId: string;
            packageId: string;
        }
    >;

    export type PackageStateTransition = EventSchema<
        Topic.PACKAGE_STATE_TRANSITION,
        {
            packageEventId: string;
            previousState: PackageState;
            integrationId: string;
        }
    >;

    export type NotificationEmailSent = EventSchema<
        Topic.NOTIFICATION_EMAIL_SENT,
        { emailIds: string[] }
    >;
}
