import { QueueConfig } from "@eci/events-client";
export type { EntryEvent } from "./validation/entry";
export enum Topic {
  ENTRY_CREATE = "entry.create",
  ENTRY_UPDATE = "entry.update",
  ENTRY_DELETE = "entry.delete",
}
export type StrapiQueueConfig = Omit<QueueConfig, "name">;
