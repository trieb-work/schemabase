import { QueueConfig } from "@eci/events/client";
export type { EntryEvent } from "./validation/entry";
export enum Topic {
  ENTRY_CREATE = "strapi.entry.create",
  ENTRY_UPDATE = "strapi.entry.update",
  ENTRY_DELETE = "strapi.entry.delete",
}
export type StrapiQueueConfig = Omit<QueueConfig, "name">;
