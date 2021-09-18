import Bull from "bull";
import { env } from "@chronark/env";
import { Signer } from "./signature";
import { Logger } from "@eci/util/logger";

export interface QueuePusher<TMessage> {
  push: (message: TMessage) => Promise<void>;
}
export interface QueueReceiver<TMessage> {
  onReceive: (process: (message: TMessage) => Promise<void>) => void;
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

export type QueueOptions = {
  name: string;

  signer: Signer;

  logger: Logger;
};

export class Queue<TPayload>
  implements QueuePusher<Message<TPayload>>, QueueReceiver<Message<TPayload>>
{
  private queue: Bull.Queue<MessageWithSignature<TPayload>>;
  /**
   * Used to sign and verify messages
   */
  private readonly signer: Signer;
  private readonly logger: Logger;

  constructor({ name, signer, logger }: QueueOptions) {
    this.queue = new Bull(name, {
      prefix: this.prefix(name),
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
  public async push(msg: Message<TPayload>): Promise<void> {
    const message = {
      ...msg,
      signature: this.signer.sign(msg),
    };
    this.logger.info("pushing message", { msg: message });
    await this.queue.add(message);
    this.logger.info("Pushed message", { msg: message });
  }

  public onReceive(
    process: (message: Message<TPayload>) => Promise<void>,
  ): void {
    this.queue.process(async ({ data }) => {
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
