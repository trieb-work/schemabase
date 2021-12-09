import { env } from "@chronark/env";
import { Worker, Job, Queue, QueueScheduler } from "bullmq";
import { SignedMessage, Message } from "./message";
import { ISigner } from "./signature";
import { ILogger } from "@eci/util/logger";
import { idGenerator } from "@eci/util/ids";

export type QueueConfig = {
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

export interface IProducer<TTopic, TPayload> {
  produce: (createMessage: {
    topic: TTopic;
    payload: TPayload;
    traceId?: string;
  }) => Promise<string>;
}

/**
 * TTopic: strings that can be topics
 */
export class QueueManager<
  TTopic extends string,
  TPayload = Record<string, never>,
> implements
    IConsumer<TTopic, Message<TTopic, TPayload>>,
    IProducer<TTopic, TPayload>
{
  /**
   * Used to sign and verify messages
   */
  private readonly signer: ISigner;
  private readonly logger: ILogger;

  private connection: {
    host: string;
    port: number;
    password?: string;
  };
  private scheduler: { [topic: string]: QueueScheduler };

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
    { signer, logger, connection }: QueueConfig, // consume: (topic: TTopic, message: Message<TPayload>) => Promise<void>,
  ) {
    this.logger = logger;
    this.connection = {
      host: connection.host,
      port: parseInt(connection.port, 10),
      password: connection.password,
    };
    this.workers = {};
    this.queues = {};
    this.signer = signer;
    this.scheduler = {};
  }

  static queueId(topic: string): string {
    return ["eci", env.require("ECI_ENV"), topic].join(":").toLowerCase();
  }

  public async close(): Promise<void> {
    await Promise.all(
      [
        ...Object.values(this.queues),
        ...Object.values(this.workers),
        ...Object.values(this.scheduler),
      ].map(async (q) => {
        await q.close();
        await q.disconnect();
      }),
    );
  }

  public async getJob(topic: string, jobId: string) {
    return this.queues[topic].getJob(jobId);
  }

  public consume(
    topic: TTopic,
    receiver: (message: Message<TTopic, TPayload>) => Promise<void>,
  ): void {
    const id = QueueManager.queueId(topic);
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
    });
    this.scheduler[topic] = new QueueScheduler(id, {
      connection: this.connection,
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
    job: Job<SignedMessage<Message<TTopic, TPayload>>, void, string>,
  ) => Promise<void> {
    return async (job) => {
      const { message, signature } = job.data;
      const logger = this.logger
        .with({ traceId: message.header.traceId })
        .withLogDrain({
          log: (s: string) => {
            job.log(s);
          },
        });
      try {
        logger.info("Received message", { messageId: message.header.id });
        this.signer.verify(message, signature);
        await handler(message);
        logger.info("Processed message", { messageId: message.header.id });
        await job.updateProgress(100);
        job.log("done");
      } catch (err) {
        job.log(JSON.stringify(err, null, 2));
        logger.error("Error processing message", {
          messageId: message.header.id,
          err,
        });
        throw err;
      }
    };
  }

  /**
   * Send a message to the queue
   * a new traceId is generated if not provided
   */
  public async produce(createMessage: {
    topic: TTopic;
    payload: TPayload;
    traceId?: string;
  }): Promise<string> {
    const { topic, payload, traceId } = createMessage;
    /**
     * By using a hash of the messsage we also deduplicate the message automatically
     */
    const message: Message<TTopic, TPayload> = {
      header: {
        topic,
        traceId: traceId ?? idGenerator.id("trace"),
        id: idGenerator.id("message"),
      },
      payload,
    };
    const logger = this.logger.with({
      traceId: message.header.traceId,
      messageId: message.header.id,
    });
    const signedMessage = {
      message,
      signature: this.signer.sign(message),
    };

    /**
     * Create a new queue for this topic if necessary
     */
    if (!(topic in this.queues)) {
      const id = QueueManager.queueId(topic);
      logger.info(`Creating new queue ${id}`);
      this.queues[topic] = new Queue(id, {
        connection: this.connection,
        sharedConnection: false,
        defaultJobOptions: {
          // Keep only the  last 1000 completed jobs in memory,
          removeOnComplete: 1000,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      });
    }
    await this.queues[topic].add(topic, signedMessage, {
      jobId: message.header.id,
    });

    return message.header.id;
  }
}
