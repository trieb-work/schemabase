import { IConsumer, Message, QueueManager } from "@eci/events/client";
import { EntryEvent } from "./validation/entry";

import { Topic, QueueConfig } from "./types";

type Payload = EntryEvent & { zohoAppId: string };

export class Consumer implements IConsumer<Topic, Message<Topic, Payload>> {
  private queueManager: QueueManager<Topic, Payload>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }
  public async close(): Promise<void> {
    return await this.queueManager.close();
  }

  public consume(
    topic: Topic,
    process: (message: Message<Topic, Payload>) => Promise<void>,
  ): void {
    return this.queueManager.consume(topic, process);
  }
}
