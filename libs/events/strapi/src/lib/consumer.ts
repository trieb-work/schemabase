import { IConsumer, Message, QueueManager } from "@eci/events/client";
import {
  EntryCreateEvent,
  EntryDeleteEvent,
  EntryUpdateEvent,
  EntryEvent,
} from "./validation/entry";

import { Topic, StrapiQueueConfig } from "./types";

export class Consumer implements IConsumer<Topic, EntryEvent> {
  private queueManager: QueueManager<Topic, EntryEvent>;
  constructor(config: StrapiQueueConfig) {
    this.queueManager = new QueueManager({
      ...config,
      name: "strapi",
    });
  }
  public async close(): Promise<void> {
    return await this.queueManager.close();
  }

  public consume(
    topic: Topic,
    process: (message: Message<Topic, EntryEvent>) => Promise<void>,
  ): void {
    switch (topic) {
      case Topic.ENTRY_CREATE:
        return this.onEntryCreateEvent(process);
      case Topic.ENTRY_UPDATE:
        return this.onEntryUpdateEvent(process);
      case Topic.ENTRY_DELETE:
        return this.onEntryDeleteEvent(process);
    }
  }

  private onEntryCreateEvent(
    process: (message: Message<Topic, EntryCreateEvent>) => Promise<void>,
  ): void {
    this.queueManager.consume(
      Topic.ENTRY_CREATE,
      async (message) => await process(message),
    );
  }

  private onEntryUpdateEvent(
    process: (message: Message<Topic, EntryUpdateEvent>) => Promise<void>,
  ): void {
    this.queueManager.consume(
      Topic.ENTRY_UPDATE,
      async (message) => await process(message),
    );
  }

  private onEntryDeleteEvent(
    process: (message: Message<Topic, EntryDeleteEvent>) => Promise<void>,
  ): void {
    this.queueManager.consume(
      Topic.ENTRY_DELETE,
      async (message) => await process(message),
    );
  }
}
