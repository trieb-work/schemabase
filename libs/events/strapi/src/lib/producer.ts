import { Message } from "@eci/events-client";
import { entryValidation, EntryEvent } from "./validation/entry";
import { Topic, StrapiQueueConfig } from "./types";
import { StrapiQueue } from "./strapi_queue";

export class Producer extends StrapiQueue {
  constructor(config: StrapiQueueConfig) {
    super(config);
  }

  /**
   * Create a new message and add it to the queue.
   */
  public async produce(
    topic: Topic,
    message: Message<EntryEvent>,
  ): Promise<void> {
    const payload = await entryValidation
      .parseAsync(message.payload)
      .catch((err) => {
        throw new Error(`Trying to push malformed event: ${message}, ${err}`);
      });

    if (payload.event !== topic) {
      throw new Error(
        `The topic does not match the event name: ${topic} - ${message}`,
      );
    }

    await this.queue.produce(topic, message);
  }
}
