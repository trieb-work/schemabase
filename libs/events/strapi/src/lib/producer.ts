import { IProducer } from "@eci/events/client";
import { EntryEvent } from "./validation/entry";
import { Topic, QueueConfig } from "./types";
import { QueueManager } from "@eci/events/client";

type Payload = EntryEvent & { zohoAppId: string };
export class Producer implements IProducer<Topic, Payload> {
  private queueManager: QueueManager<Topic, Payload>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }

  /**
   * Create a new message and add it to the queue.
   * @return The job id
   */
  public async produce(createMessage: {
    topic: Topic;
    payload: Payload;
  }): Promise<string> {
    return await this.queueManager.produce(createMessage);
  }
}
