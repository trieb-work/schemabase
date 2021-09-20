import { Logger } from "@eci/util/logger";
import { IConsumer, Message } from "@eci/events-client";
import { Topic, EntryEvent } from "@eci/events/strapi";

export type EventSource<TTopic extends string, TMessage> = {
  consumer: IConsumer<TTopic, TMessage>;
  handler: [{ topic: TTopic; handler: (message: TMessage) => Promise<void> }];
};

export type WorkerConfig = {
  logger: Logger;

  sources: {
    strapi: EventSource<Topic, Message<EntryEvent>>;
  };
};

export class Worker {
  private logger: Logger;
  private readonly sources: {
    strapi: EventSource<Topic, Message<EntryEvent>>;
  };
  constructor(config: WorkerConfig) {
    this.logger = config.logger;
    this.sources = config.sources;
  }

  start() {
    for (const [name, source] of Object.entries(this.sources)) {
      for (const { topic, handler } of source.handler) {
        source.consumer.onReceive(topic, handler);
        this.logger.info(`${name}: Started listening for ${topic} events`);
      }
    }
  }
}
