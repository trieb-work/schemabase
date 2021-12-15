import { env } from "@chronark/env";
import { ISigner } from "@eci/events";
import { idGenerator } from "@eci/util/ids";
import { ILogger } from "@eci/util/logger";
import * as kafka from "kafkajs";
import { Signed, Message } from "./message";

// export interface Serializer {
//   serialize: () => string;
// }
// export interface Deserializer<T> {
//   deserialize: (s: string) => T;
// }

// export class Message<T> implements Serializer, Deserializer<T> {
//   public serialize(): string {
//     return "";
//   }

//   public deserialize(_s: string): T {
//     return {} as T;
//   }
// }

export interface EventProducer<TTopic, TPayload> {
  produce: (createMessage: {
    topic: TTopic;
    payload: TPayload;
    traceId: string;
  }) => Promise<{ messageId: string; partition: number; offset?: string }>;

  /**
   * disconnect
   */
  close(): Promise<void>;
}

const newKafkaClient = (): kafka.Kafka => {
  return new kafka.Kafka({
    brokers: [env.require("KAFKA_BROKER_URL")],

    sasl: {
      mechanism: "scram-sha-256",
      username: env.require("KAFKA_USERNAME"),
      password: env.require("KAFKA_PASSWORD"),
    },
    ssl: true,
  });
};

export class KafkaProducer<TTopic extends string, TPayload>
  implements EventProducer<TTopic, TPayload>
{
  private producer: kafka.Producer;
  private signer: ISigner;
  private constructor(config: { producer: kafka.Producer; signer: ISigner }) {
    this.producer = config.producer;
    this.signer = config.signer;
  }

  static async new<TTopic extends string, TPayload>(config: {
    signer: ISigner;
  }): Promise<KafkaProducer<TTopic, TPayload>> {
    const k = newKafkaClient();

    const producer = k.producer();
    await producer.connect();
    return new KafkaProducer({ producer, signer: config.signer });
  }

  public async produce({
    topic,
    payload,
    traceId,
  }: {
    topic: TTopic;
    payload: TPayload;
    traceId: string;
  }): Promise<{ messageId: string; partition: number; offset?: string }> {
    const message: Message<TPayload> = {
      headers: {
        id: idGenerator.id("message"),
        traceId,
        topic,
      },
      payload,
    };

    const signedMessage: Signed<Message<TPayload>> = {
      message,
      signature: this.signer.sign(message),
    };
    const messages = [
      {
        value: JSON.stringify(signedMessage),
      },
    ];
    const res = await this.producer.send({
      topic,
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

export interface EventSubscriber<TPayload> {
  subscribe(process: (message: Message<TPayload>) => Promise<void>): void;
  /**
   * Stop receiving new tasks.
   * The current task will still be finished.
   */
  close(): Promise<void>;
}

export class KafkaSubscriber<TPayload> implements EventSubscriber<TPayload> {
  private consumer: kafka.Consumer;
  private signer: ISigner;
  private logger: ILogger;

  private constructor(config: {
    consumer: kafka.Consumer;
    signer: ISigner;
    logger: ILogger;
  }) {
    this.consumer = config.consumer;
    this.signer = config.signer;
    this.logger = config.logger;
  }

  static async new<TTopic extends string, TPayload>(config: {
    topics: TTopic[];
    groupId: string;
    signer: ISigner;
    logger: ILogger;
  }): Promise<KafkaSubscriber<TPayload>> {
    const k = newKafkaClient();
    const consumer = k.consumer({
      groupId: config.groupId,
    });
    await consumer.connect();
    for (const topic of config.topics) {
      await consumer.subscribe({ topic });
    }

    return new KafkaSubscriber({
      consumer,
      signer: config.signer,
      logger: config.logger,
    });
  }

  public async subscribe(
    process: (message: Message<TPayload>) => Promise<void>,
  ): Promise<void> {
    this.consumer.run({
      eachMessage: async ({ message }) => {
        this.logger.info("Incoming message", { time: message.timestamp });
        const { value } = message;
        if (!value) {
          throw new Error(`Empty message`);
        }

        const signedMessage = JSON.parse(value.toString()) as Signed<
          Message<TPayload>
        >;

        this.signer.verify(signedMessage.message, signedMessage.signature);
        await process(signedMessage.message);
      },
    });
  }

  async close(): Promise<void> {
    await this.consumer.disconnect();
  }
}
