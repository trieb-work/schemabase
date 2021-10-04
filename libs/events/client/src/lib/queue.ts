import { env } from "@chronark/env";
import { Worker, Job, Queue } from "bullmq";
import { SignedMessage, Message } from "./message";

import { ISigner } from "./signature";
import { ILogger } from "@eci/util/logger";

export type QueueConfig = {
  name: string;

  signer: ISigner;

  logger: ILogger;

  /**
   * Redis connection
   *
   * If you leave this undefined, it will attempt to connect to localhost
   */
  connection: {
    host: string;
    port: string;
    password?: string;
  };
};

export interface IConsumer<TTopic, TMessage> {
  consume(topic: TTopic, process: (message: TMessage) => Promise<void>): void;
  /**
   * Stop receiving new tasks.
   * The current task will still be finished.
   */
  close(): Promise<void>;
}

export interface IProducer<TMessage> {
  produce: (message: TMessage) => Promise<void>;
}

/**
 * TTopic: strings that can be topics
 */
export class QueueManager<
  TTopic extends string,
  TPayload = Record<string, never>,
> implements
    IConsumer<TTopic, Message<TTopic, TPayload>>,
    IProducer<Message<TTopic, TPayload>>
{
  /**
   * Used to sign and verify messages
   */
  private readonly signer: ISigner;
  private readonly logger: ILogger;
  /**
   * The queue prefix.
   * Each topic will be a unique queue with this prefix and topic name.
   */
  private readonly prefix: string;

  private connection: {
    host: string;
    port: number;
    password?: string;
  };

  private workers: {
    [topic: string]: Worker<SignedMessage<Message<TTopic, TPayload>>>;
  };

  private queues: {
    [topic: string]: Queue<
      SignedMessage<Message<TTopic, TPayload>>,
      void,
      TTopic
    >;
  };
  constructor(
    { name, signer, logger, connection }: QueueConfig, // consume: (topic: TTopic, message: Message<TPayload>) => Promise<void>,
  ) {
    this.logger = logger;
    this.prefix = name;
    this.connection = {
      host: connection.host,
      port: parseInt(connection.port, 10),
      password: connection.password,
    };
    this.workers = {};
    this.queues = {};
    this.signer = signer;
  }

  private queueId(topic: TTopic): string {
    return ["eci", env.get("NODE_ENV", "development"), this.prefix, topic]
      .join(":")
      .toLowerCase();
  }

  public async close(): Promise<void> {
    await Promise.all(
      [...Object.values(this.queues), ...Object.values(this.workers)].map(
        async (q) => {
          await q.close();
          await q.disconnect();
        },
      ),
    );
  }

  public consume(
    topic: TTopic,
    receiver: (message: Message<TTopic, TPayload>) => Promise<void>,
  ): void {
    const id = this.queueId(topic);
    this.logger.info("Creating topic consumer", { topic: id });
    /**
     * Adding multiple workers to a single topic is probably a mistake
     * and can yield unexpected results.
     */
    if (topic in this.workers) {
      throw new Error(
        `A worker has already been assigned to handle ${topic} messages`,
      );
    }
    this.workers[topic] = new Worker(id, this.wrapReceiver(receiver), {
      connection: this.connection,
      sharedConnection: true,
    });

    /**
     * This logging might be overkill. We'll see
     */
    this.workers[topic].on("error", (job: Job, reason: string) => {
      this.logger.error("Job failed", { job, reason });
    });
    this.workers[topic].on("failed", (job: Job, reason: string) => {
      this.logger.error("Job failed", { job, reason });
    });
  }

  private wrapReceiver(
    handler: (message: Message<TTopic, TPayload>) => Promise<void>,
  ): (
    job: Job<SignedMessage<Message<TTopic, TPayload>>, void, TTopic>,
  ) => Promise<void> {
    return async ({ data }) => {
      try {
        this.logger.info("Received message", { message: data });
        this.signer.verify({ ...data, signature: undefined }, data.signature);
        await handler(data.message);
        this.logger.info("Processed message", { message: data });
      } catch (err) {
        this.logger.error("Error processing message", {
          message: data,
          error: err.message,
        });
      }
    };
  }

  /**
   * Send a message to the queue
   * a new traceId is generated if not provided
   */
  public async produce(message: Message<TTopic, TPayload>): Promise<void> {
    const signedMessage = {
      message,
      signature: this.signer.sign(message),
    };
    const topic = message.header.topic;
    /**
     * Create a new queue for this topic if necessary
     */
    if (!(topic in this.queues)) {
      const id = this.queueId(topic);
      this.logger.debug(`Creating new queue ${id}`);
      this.queues[topic] = new Queue(id, {
        connection: this.connection,
        sharedConnection: true,
      });
    }
    this.logger.debug("pushing message", { signedMessage });
    await this.queues[topic].add(topic, signedMessage, {
      // Keep only 1000 the last completed jobs in memory,
      removeOnComplete: 1000,
    });
    this.logger.debug("Pushed message", { signedMessage });
  }
}
