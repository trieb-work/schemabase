import { IProducer, Message } from "@eci/events/client";
import { EntryEvent } from "./validation/entry";
import { Topic, QueueConfig } from "./types";
import { QueueManager } from "@eci/events/client";
export class Producer implements IProducer<Message<Topic, EntryEvent>> {
  private queueManager: QueueManager<Topic, EntryEvent>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }

  /**
   * Create a new message and add it to the queue.
   */
  public async produce(message: Message<Topic, EntryEvent>): Promise<void> {
    await this.queueManager.produce(message);
  }
}
