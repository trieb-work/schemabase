import { IProducer, Message } from "@eci/events/client";
import { EntryEvent } from "./validation/entry";
import { Topic, QueueConfig } from "./types";
import { QueueManager } from "@eci/events/client";

type Payload = EntryEvent & { zohoAppId: string };
export class Producer implements IProducer<Message<Topic, Payload>> {
  private queueManager: QueueManager<Topic, Payload>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }

  /**
   * Create a new message and add it to the queue.
   */
  public async produce(message: Message<Topic, Payload>): Promise<void> {
    await this.queueManager.produce(message);
  }
}
