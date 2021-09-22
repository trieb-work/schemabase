import { IConsumer, Message } from "@eci/events-client";
import {
  EntryCreateEvent,
  EntryDeleteEvent,
  EntryUpdateEvent,
  EntryEvent,
} from "./validation/entry";

import { Topic, StrapiQueueConfig } from "./types";
import { StrapiQueue } from "./strapi_queue";

export class Consumer
  extends StrapiQueue
  implements IConsumer<Topic, EntryEvent>
{
  constructor(config: StrapiQueueConfig) {
    super(config);
  }

  public async pause(): Promise<void> {
    await this.queue.pause();
  }

  public async resume(): Promise<void> {
    await this.queue.resume();
  }

  public onReceive(
    topic: Topic,
    process: (message: Message<EntryEvent>) => Promise<void>,
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
    process: (message: Message<EntryCreateEvent>) => Promise<void>,
  ): void {
    this.queue.onReceive(
      Topic.ENTRY_CREATE,
      async (message) => await process(message),
    );
  }

  private onEntryUpdateEvent(
    process: (message: Message<EntryUpdateEvent>) => Promise<void>,
  ): void {
    this.queue.onReceive(
      Topic.ENTRY_UPDATE,
      async (message) => await process(message),
    );
  }

  private onEntryDeleteEvent(
    process: (message: Message<EntryDeleteEvent>) => Promise<void>,
  ): void {
    this.queue.onReceive(
      Topic.ENTRY_DELETE,
      async (message) => await process(message),
    );
  }
}
