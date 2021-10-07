import { IConsumer, Message, QueueManager } from "@eci/events/client";
import { EntryEvent } from "./validation/entry";

import { Topic, QueueConfig } from "./types";

export class Consumer implements IConsumer<Topic, Message<Topic, EntryEvent>> {
  private queueManager: QueueManager<Topic, EntryEvent>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }
  public async close(): Promise<void> {
    return await this.queueManager.close();
  }

  public consume(
    topic: Topic,
    process: (message: Message<Topic, EntryEvent>) => Promise<void>,
  ): void {
    return this.queueManager.consume(topic, process);
  }
}
