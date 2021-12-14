import {
  IConsumer,
  Message,
  QueueManager,
  QueueConfig,
} from "@eci/events/client";

import { Topic, PackageEvent } from "./types";

export class Consumer
  implements IConsumer<Topic, Message<Topic, PackageEvent>>
{
  private queueManager: QueueManager<Topic, PackageEvent>;
  constructor(config: QueueConfig) {
    this.queueManager = new QueueManager(config);
  }
  public async close(): Promise<void> {
    return await this.queueManager.close();
  }

  public consume(
    topic: Topic,
    process: (message: Message<Topic, PackageEvent>) => Promise<void>,
  ): void {
    return this.queueManager.consume(topic, process);
  }
}
