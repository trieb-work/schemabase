import { Logger } from "@eci/util/logger";
import { IConsumer, Message } from "@eci/events-client";
import { Topic, EntryEvent } from "@eci/events/strapi";

export type EventSource<TTopic extends string, TMessage> = {
  consumer: IConsumer<TTopic, TMessage>;
  handlers: [{ topic: TTopic; handler: (message: TMessage) => Promise<void> }];
};

export type WorkerConfig = {
  logger: Logger;

  sources: {
    [name: string]: EventSource<Topic, Message<EntryEvent>>;
  };
};

export class Worker {
  private logger: Logger;
  private readonly sources: Record<
    string,
    EventSource<Topic, Message<EntryEvent>>
  >;

  constructor(config: WorkerConfig) {
    this.logger = config.logger;
    this.sources = config.sources;
  }

  start() {
    this.logger.info("Worker starting");
    for (const [name, source] of Object.entries(this.sources)) {
      for (const { topic, handler } of source.handlers) {
        source.consumer.consume(topic, handler);
        this.logger.info(`${name}: Started listening for ${topic} events`);
      }
    }
  }
}
