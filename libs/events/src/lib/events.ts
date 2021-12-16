import { env } from "@chronark/env";
import { ISigner } from "@eci/events";
import { idGenerator } from "@eci/util/ids";
import { ILogger } from "@eci/util/logger";
import * as kafka from "kafkajs";
import { Signed, Message } from "./message";

export interface EventProducer<TContent> {
  produce: (
    createMessage: Message<TContent>,
  ) => Promise<{ messageId: string; partition: number; offset?: string }>;

  /**
   * disconnect
   */
  close(): Promise<void>;
}

const newKafkaClient = (): kafka.Kafka => {
  return new kafka.Kafka({
    brokers: [env.require("KAFKA_BROKER_URL")],

    // sasl: {
    //   mechanism: "scram-sha-256",
    //   username: env.require("KAFKA_USERNAME"),
    //   password: env.require("KAFKA_PASSWORD"),
    // },
    // ssl: true,
  });
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
    message: Message<TContent>,
  ): Promise<{ messageId: string; partition: number; offset?: string }> {
    const serialized = message.serialize();
    const signature = this.signer.sign(serialized);
    const messages = [
      {
        headers: {
          signature,
        },
        value: serialized,
      },
    ];
    const res = await this.producer.send({
      topic: message.headers.topic,
      messages,
    });
    return {
      messageId: message.headers.id,
      partition: res[0].partition,
      offset: res[0].offset,
    };
  }
  public async close(): Promise<void> {
    this.producer.disconnect();
  }
}

export interface EventSubscriber<TContent> {
  subscribe(process: (message: Message<TContent>) => Promise<void>): void;
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

  private errorProducer: KafkaProducer<TContent>;

  private constructor(config: {
    errorProducer: KafkaProducer<TContent>;
    consumer: kafka.Consumer;
    signer: ISigner;
    logger: ILogger;
  }) {
    this.consumer = config.consumer;
    this.signer = config.signer;
    this.logger = config.logger;
    this.errorProducer = config.errorProducer;
  }

  static async new<TTopic extends string, TContent>(config: {
    topics: TTopic[];
    groupId: string;
    signer: ISigner;
    logger: ILogger;
  }): Promise<KafkaSubscriber<TContent>> {
    const k = newKafkaClient();
    const consumer = k.consumer({
      groupId: config.groupId,
    });
    await consumer.connect();
    for (const topic of config.topics) {
      await consumer.subscribe({ topic });
    }

    const errorProducer = await KafkaProducer.new<TContent>({
      signer: config.signer,
    });

    return new KafkaSubscriber({
      consumer,
      errorProducer,
      signer: config.signer,
      logger: config.logger,
    });
  }

  public async close(): Promise<void> {
    await Promise.all([this.consumer.disconnect(), this.errorProducer.close()]);
  }

  public async subscribe(
    process: (message: Message<TContent>) => Promise<void>,
  ): Promise<void> {
    this.consumer.run({
      eachMessage: async (payload) => {
        if (!payload.message.value) {
          throw new Error(`Kafka did not return a message value`);
        }
        if (!payload.message.headers){
          throw new Error(`Kafka did not return a message header`);
        }
        if (!payload.message.headers["signature"]) {
          throw new Error(`Kafka did not return a signature header`)
        }
        
        const message = Message.deserialize<TContent>(payload.message.value);

        
        const signature =  typeof payload.message.headers["signature"] === "string"
            ? payload.message.headers["signature"]
            : payload.message.headers["signature"].toString()
          

        this.signer.verify(message.serialize(), signature);

        try {
          this.logger.info("Incoming message", {
            time: payload.message.timestamp,
          });
          if (!payload.message.value) {
            throw new Error(`Kafka did not return a message value`);
          }

          await process(message);
        } catch (err) {
          this.logger.error("Unable to process message", {
            headers: message.headers,
            err: err.message,
          });

          message.headers.errors = [
            ...(message.headers.errors ?? []),
            err.message,
          ];

          await this.errorProducer.produce(message);
        }
      },
    });
  }
}
