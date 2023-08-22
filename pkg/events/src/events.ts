import { env } from "@eci/pkg/env";
import { ISigner } from "./signature";
import { ILogger } from "@eci/pkg/logger";
import * as kafka from "kafkajs";
import { Message } from "./message";
import { Topic } from "./registry";
import { EventHandler } from "./handler";
import { Job, Queue, Worker } from "bullmq";

export interface EventProducer<TContent> {
  produce: (
    /**
     * The topic is not needed when using Bull, as it is set
     * on the queue level. For Kafka on message level
     */
    topic: string,
    message: Message<TContent>,
    opts?: { key?: string; headers?: Record<string, string> },
  ) => Promise<{ messageId: string; partition?: number; offset?: string }>;

  /**
   * disconnect
   */
  close: () => Promise<void>;
}
const redisConnection = {
  host: env.require("REDIS_HOST"),
  port: parseInt(env.require("REDIS_PORT")),
  password: env.require("REDIS_PASSWORD"),
};

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
  private readonly producer: kafka.Producer;

  private readonly signer: ISigner;

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
    topic: string, // TODO: string[] und in alle messages reinschreiben
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

// the bullmq producer class works similar than the kafka producer class,
// but uses BullMQ instead of Kafka. In Kafka we use topics, in BullMQ we use queues.
// The topic name is the queue name, prefixed with "eci:"
export class BullMQProducer<TContent> implements EventProducer<TContent> {
  private readonly producer: Queue;

  private constructor(config: { producer: Queue; topic: string }) {
    this.producer = config.producer;
  }

  static async new<TContent>(config: {
    topic: string;
  }): Promise<BullMQProducer<TContent>> {
    const queueName = ["eci", config.topic].join(":");
    const producer = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 3,
        backoff: { type: "exponential", delay: 80000 },
      },
    });
    return new BullMQProducer({
      producer,
      topic: config.topic,
    });
  }

  public async produce(
    topic: string, // TODO: string[] und in alle messages reinschreiben
    message: Message<TContent>,
    opts?: { key?: string; headers?: Record<string, string> },
  ): Promise<{ messageId: string }> {
    const serialized = message.serialize();
    const jobData = {
      key: opts?.key,
      headers: {
        ...opts?.headers,
      },
      value: serialized,
    };
    await this.producer.add(topic, jobData, {
      jobId: message.header.id,
    });
    return {
      messageId: message.header.id,
    };
  }

  public async close(): Promise<void> {
    this.producer.close();
  }
}

export interface EventSubscriber<TContent> {
  subscribe: (handler: EventHandler<TContent>) => Promise<void>;
  /**
   * Stop receiving new tasks.
   * The current task will still be finished.
   */
  close: () => Promise<void>;
}

/**
 * The Kafka subscribe class - process messages from a Kafka topic
 */
export class KafkaSubscriber<TContent> implements EventSubscriber<TContent> {
  private readonly consumer: kafka.Consumer;

  private readonly signer: ISigner;

  private readonly logger: ILogger;

  private readonly errorProducer: kafka.Producer;

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

  /**
   * Subscribe to a topic and process incoming messages using the EventHandler
   * @param handler
   */
  public async subscribe(handler: EventHandler<TContent>): Promise<void> {
    this.consumer.run({
      eachMessage: async (payload) => {
        try {
          if (payload.message.value == null) {
            throw new Error("Kafka did not return a message value");
          }
          const message = Message.deserialize<TContent>(payload.message.value);
          const { headers } = payload.message;

          if (headers == null || !headers.signature) {
            throw new Error("Kafka message does not have signature header");
          }

          const signature =
            typeof headers.signature === "string"
              ? headers.signature
              : headers.signature.toString();

          this.signer.verify(message.serialize(), signature);

          this.logger.info("Incoming message from live worker queue");
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
          if (payload.message.headers) {
            payload.message.headers.error = err.message;
          }
          await this.errorProducer.send({
            topic: "UNHANDLED_EXCEPTION",
            messages: [payload.message],
          });
        }
      },
    });
  }
}

/**
 * The BullMQ subscribe class - process jobs from the bullmq EVENTS queue.
 * In comparison to Kafka, we don't need a errorProducer here - errors are handled in the
 * queue directly and get retried automatically. A kafka consumer is a bull worker.
 */
export class BullMQSubscriber<TContent> implements EventSubscriber<TContent> {
  private readonly topic: Topic;

  private readonly logger: ILogger;

  /**
   * We initialize a fake worker here, so that
   * we can call close() on it later.
   */
  private consumer: Worker = {} as Worker;

  private constructor(config: { logger: ILogger; topic: Topic }) {
    this.logger = config.logger;
    this.topic = config.topic;
  }

  static async new<TContent>(config: {
    topic: Topic;
    logger: ILogger;
  }): Promise<BullMQSubscriber<TContent>> {
    return new BullMQSubscriber({
      topic: config.topic,
      logger: config.logger,
    });
  }

  /**
   * Subscribe to the events queue and process incoming messages using the EventHandler
   * @param handler
   */
  public async subscribe(handler: EventHandler<TContent>): Promise<void> {
    const queueName = ["eci", this.topic].join(":");
    this.consumer = new Worker(
      queueName,
      async (job: Job) => {
        const logger = this.logger
          .withLogDrain({
            log: (message: string) => {
              job.log(message);
            },
          })
          .with({
            jobId: job.id,
            queueName,
          });
        const message = Message.deserialize<TContent>(job.data.value);

        logger.info("Incoming message from events queue");
        logger.debug(JSON.stringify(message));
        const runtimeContext = {
          logger,
          job,
          traceId: message.header.traceId,
        };

        await handler.handleEvent(runtimeContext, message.content);
      },
      {
        connection: redisConnection,
      },
    );
  }

  public async close(): Promise<void> {
    await this.consumer.close();
  }
}
