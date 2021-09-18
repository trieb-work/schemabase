import { Logger } from "@eci/util/logger";
import { QueueReceiver } from "@eci/queue";

export type EventSource<TMessage> = {
  receiver: QueueReceiver<TMessage>;
  handler: (message: TMessage) => Promise<void>;
};

export type WorkerConfig = {
  logger: Logger;

  sources: {
    strapi: EventSource<unknown>;
  };
};

export class Worker {
  private logger: Logger;
  private readonly sources: {
    strapi: EventSource<unknown>;
  };
  constructor(config: WorkerConfig) {
    this.logger = config.logger;
    this.sources = config.sources;
  }

  start() {
    for (const [name, source] of Object.entries(this.sources)) {
      source.receiver.onReceive(source.handler);
      this.logger.info(`Started listening for ${name} events`);
    }
  }
}
