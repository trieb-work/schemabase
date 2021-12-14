import { IProducer, QueueConfig } from "@eci/events/client";
import { Topic, PackageEvent } from "./types";
import { QueueManager } from "@eci/events/client";

export class Producer implements IProducer<Topic, PackageEvent> {
  private queueManager: QueueManager<Topic, PackageEvent>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }

  /**
   * Create a new message and add it to the queue.
   * @return The job id
   */
  public async produce(createMessage: {
    topic: Topic;
    payload: PackageEvent;
  }): Promise<string> {
    return await this.queueManager.produce(createMessage);
  }
}
