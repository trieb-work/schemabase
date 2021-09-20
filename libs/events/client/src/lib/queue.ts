import Bull from "bull";
import { env } from "@chronark/env";
import { Signer } from "./signature";
import { Logger } from "@eci/util/logger";

export interface IProducer<TTopic, TMessage> {
  produce: (topic: TTopic, message: TMessage) => Promise<void>;
}
export interface IConsumer<TTopic, TMessage> {
  onReceive: (
    topic: TTopic,
    process: (message: TMessage) => Promise<void>,
  ) => void;
}

/**
 * Message extended with metadata
 */
export type Message<TPayload> = {
  /**
   * The content of the message.
   * This must be json serializable
   */
  payload: TPayload;

  /**
   * Additional meta information about the message
   */
  meta: {
    /**
     * Used to uniquely identify a distributed trace through a system
     */
    traceId: string;
  };
};

/**
 * A signed message
 */
export type MessageWithSignature<TPayload> = Message<TPayload> & {
  /**
   * Siganture to verify the message comes from a trusted source
   */
  signature: string;
};

export type QueueConfig = {
  name: string;

  signer: Signer;

  logger: Logger;

  redis?: {
    host?: string;
    port?: string;
    password?: string;
  };
};

/**
 * TTopic: strings that can be topics
 */
export class Queue<TTopic extends string, TPayload = Record<string, never>>
  implements
    IProducer<TTopic, Message<TPayload>>,
    IConsumer<TTopic, Message<TPayload>>
{
  private queue: Bull.Queue<MessageWithSignature<TPayload>>;
  /**
   * Used to sign and verify messages
   */
  private readonly signer: Signer;
  private readonly logger: Logger;

  constructor({ name, signer, logger, redis }: QueueConfig) {
    this.queue = new Bull(name, {
      prefix: this.prefix(name),
      redis: redis
        ? {
            ...redis,
            port: redis.port ? parseInt(redis.port, 10) : undefined,
          }
        : undefined,
    });
    this.signer = signer;
    this.logger = logger;
  }

  /**
   * Create a prefix for the queue
   */
  private prefix(name: string): string {
    return `${["ECI", env.get("NODE_ENV"), name].join("_")}_`;
  }

  /**
   * Send a message to the queue
   * a new traceId is generated if not provided
   */
  public async produce(
    topic: TTopic,
    message: Message<TPayload>,
  ): Promise<void> {
    const signedMessage = {
      ...message,
      signature: this.signer.sign(message),
    };
    this.logger.info("pushing message", { signedMessage });
    await this.queue.add(topic, signedMessage);
    this.logger.info("Pushed message", { signedMessage });
  }

  public onReceive(
    topic: TTopic,
    process: (message: Message<TPayload>) => Promise<void>,
  ): void {
    this.queue.process(topic, async ({ data }) => {
      try {
        this.logger.info("Received message", { message: data });
        this.signer.verify(data, data.signature);
        await process(data);
        this.logger.info("Processed message", { message: data });
      } catch (err) {
        this.logger.error("Error processing message", {
          message: data,
          error: err.message,
        });
      }
    });
  }
}
