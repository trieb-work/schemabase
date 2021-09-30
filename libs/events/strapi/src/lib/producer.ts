import { IProducer, Message } from "@eci/events/client";
import { validation, EntryEvent } from "./validation/entry";
import { Topic, StrapiQueueConfig } from "./types";
import { QueueManager } from "@eci/events/client";
export class Producer implements IProducer<Topic, Message<EntryEvent>> {
  private queueManager: QueueManager<Topic, EntryEvent>;
  constructor(config: StrapiQueueConfig) {
    this.queueManager = new QueueManager({ ...config, name: "strapi" });
  }

  /**
   * Create a new message and add it to the queue.
   */
  public async produce(
    topic: Topic,
    message: Message<EntryEvent>,
  ): Promise<void> {
    validation[topic].parseAsync(message.payload).catch((err) => {
      throw new Error(`Trying to push malformed event: ${message}, ${err}`);
    });

    await this.queueManager.produce(topic, message);
  }
}
