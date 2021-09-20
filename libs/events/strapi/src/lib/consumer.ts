import { IConsumer, Message } from "@eci/events-client";
import { entryValidation, EntryEvent } from "./validation/entry";
import { Topic, StrapiQueueConfig } from "./types";
import { StrapiQueue } from "./strapi_queue";

export class Consumer
  extends StrapiQueue
  implements IConsumer<Topic, Message<EntryEvent>>
{
  constructor(config: StrapiQueueConfig) {
    super(config);
  }

  public async onReceive(
    topic: Topic,
    process: (message: Message<EntryEvent>) => Promise<void>,
  ): Promise<void> {
    this.queue.onReceive(topic, async (message) => {
      await entryValidation.parseAsync(message).catch((err) => {
        throw new Error(`Invalid object received: ${err}`);
      });
      await process(message);
    });
  }
}
