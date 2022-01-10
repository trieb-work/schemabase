import { env } from "@eci/pkg/env";
import { ISigner } from "./signature";
import { ILogger } from "@eci/pkg/logger";
import * as kafka from "kafkajs";
import { Message } from "./message";
import { Topic } from "./registry";
import { EventHandler } from "./handler";

export interface EventProducer<TContent> {
  produce: (
    topic: string,
    message: Message<TContent>,
    opts?: { key?: string; headers?: Record<string, string> },
  ) => Promise<{ messageId: string; partition: number; offset?: string }>;

  /**
   * disconnect
   */
  close(): Promise<void>;
}

export const newKafkaClient = (): kafka.Kafka => {
  const config: kafka.KafkaConfig = {
    brokers: [env.require("KAFKA_BROKER_URL")],
    logLevel: 1,
  };
  if (env.get("KAFKA_SASL_MECHANISM")?.toLowerCase() === "scram-sha-256") {
    config.sasl = {
      mechanism: "scram-sha-256",
      username: env.require("KAFKA_USERNAME"),
      password: env.require("KAFKA_PASSWORD"),
    };
    config.ssl = true;
  }

  return new kafka.Kafka(config);
};

export class KafkaProducer<TContent> implements EventProducer<TContent> {
  private producer: kafka.Producer;

  private signer: ISigner;

  private constructor(config: { producer: kafka.Producer; signer: ISigner }) {
    this.producer = config.producer;
    this.signer = config.signer;
  }

  static async new<TContent>(config: {
    signer: ISigner;
  }): Promise<KafkaProducer<TContent>> {
    const k = newKafkaClient();

    const producer = k.producer();
    await producer.connect();
    return new KafkaProducer({ producer, signer: config.signer });
  }

  public async produce(
    topic: string,
    message: Message<TContent>,
    opts?: { key?: string; headers?: Record<string, string> },
  ): Promise<{ messageId: string; partition: number; offset?: string }> {
    const serialized = message.serialize();
    const signature = this.signer.sign(serialized);
    const messages = [
      {
        key: opts?.key,
        headers: {
          ...opts?.headers,
          signature,
        },
        value: serialized,
      },
    ];
    const res = await this.producer.send({
      topic,
      messages,
    });
    return {
      messageId: message.header.id,
      partition: res[0].partition,
      offset: res[0].offset,
    };
  }

  public async close(): Promise<void> {
    this.producer.disconnect();
  }
}

export interface EventSubscriber<TContent> {
  subscribe: (handler: EventHandler<TContent>) => Promise<void>;
  /**
   * Stop receiving new tasks.
   * The current task will still be finished.
   */
  close(): Promise<void>;
}

export class KafkaSubscriber<TContent> implements EventSubscriber<TContent> {
  private consumer: kafka.Consumer;

  private signer: ISigner;

  private logger: ILogger;

  private errorProducer: kafka.Producer;

  private constructor(config: {
    errorProducer: kafka.Producer;
    consumer: kafka.Consumer;
    signer: ISigner;
    logger: ILogger;
  }) {
    this.consumer = config.consumer;
    this.signer = config.signer;
    this.logger = config.logger;
    this.errorProducer = config.errorProducer;
  }

  static async new<TContent>(config: {
    topic: Topic;
    groupId: string;
    signer: ISigner;
    logger: ILogger;
  }): Promise<KafkaSubscriber<TContent>> {
    const k = newKafkaClient();
    const consumer = k.consumer({
      groupId: config.groupId,
    });
    await consumer.connect();

    await consumer.subscribe({ topic: config.topic });

    const errorProducer = k.producer();
    await errorProducer.connect();

    return new KafkaSubscriber({
      consumer,
      errorProducer,
      signer: config.signer,
      logger: config.logger,
    });
  }

  public async close(): Promise<void> {
    await Promise.all([
      this.consumer.disconnect(),
      this.errorProducer.disconnect(),
    ]);
  }

  public async subscribe(handler: EventHandler<TContent>): Promise<void> {
    this.consumer.run({
      eachMessage: async (payload) => {
        try {
          if (!payload.message.value) {
            throw new Error("Kafka did not return a message value");
          }
          const message = Message.deserialize<TContent>(payload.message.value);
          const { headers } = payload.message;

          if (!headers || !headers["signature"]) {
            throw new Error("Kafka message does not have signature header");
          }

          const signature =
            typeof headers["signature"] === "string"
              ? headers["signature"]
              : headers["signature"].toString();

          this.signer.verify(message.serialize(), signature);

          this.logger.info("Incoming message", {
            time: payload.message.timestamp,
          });
          if (!payload.message.value) {
            throw new Error("Kafka did not return a message value");
          }

          await handler.handleEvent(
            { traceId: message.header.traceId },
            message.content,
          );
        } catch (error) {
          const err = error as Error;
          this.logger.error("Unable to process message", {
            err: err,
          });

          payload.message.headers ??= {};
          payload.message.headers["error"] = err.message;
          await this.errorProducer.send({
            topic: "UNHANDLED_EXCEPTION",
            messages: [payload.message],
          });
        }
      },
    });
  }
}
