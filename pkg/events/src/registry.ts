import { PackageState } from "@prisma/client";

export enum Topic {
  STRAPI_ENTRY_CREATE = "strapi.entry.create",
  STRAPI_ENTRY_UPDATE = "strapi.entry.update",
  PACKAGE_UPDATE = "tracking.package.update",
  PACKAGE_STATE_TRANSITION = "tracking.package.state.transition",
  NOTIFICATION_EMAIL_SENT = "tracking.package.notification.email.sent",
}

export type EventSchema<TTopic, TMessage> = {
  topic: TTopic;
  message: TMessage;
};

export namespace EventSchemaRegistry {
  export type StrapiEntryCreate = EventSchema<Topic.STRAPI_ENTRY_CREATE, {}>;
  export type StrapiEntryUpdate = EventSchema<Topic.STRAPI_ENTRY_UPDATE, {}>;

  export type PackageUpdate = EventSchema<
    Topic.PACKAGE_UPDATE,
    {
      trackingId: string;
      location: string;
      time: number;
      state: PackageState;
      message?: string;
      trackingIntegrationId: string;
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
    { emailId: string }
  >;
}
