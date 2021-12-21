import { id } from "@eci/pkg/ids";

// /**
//  * Additional meta information about the message
//  */
export type Headers = {
  /**
   * Unique id for this messages
   */
  id: string;
  /**
   * Used to uniquely identify a distributed trace through a system
   */
  traceId: string;
  /**
   * Attach errors to this message for tracing
   */
  errors?: string[];
  retry?: {
    remaining: number;
    notBefore: number;
  };
};

/**
 * A signed message
 */
export type Signed<TMessage> = {
  message: TMessage;
  /**
   * Siganture to verify the message comes from a trusted source
   */
  signature: string;
};

type OptionalKey<T, O extends keyof T> = Omit<T, O> & Partial<Pick<T, O>>;

export class Message<TContent> {
  public readonly headers: Headers;
  public readonly content: TContent;

  constructor(message: {
    headers: OptionalKey<Headers, "id">;
    content: TContent;
  }) {
    this.headers = Object.freeze({
      id: message.headers.id ?? id.id("message"),
      ...message.headers,
    });
    this.content = Object.freeze(message.content);
  }

  public serialize(): Buffer {
    return Buffer.from(
      JSON.stringify({
        headers: this.headers,
        content: this.content,
      }),
    );
  }

  static deserialize<TContent>(buf: Buffer): Message<TContent> {
    const message = JSON.parse(buf.toString()) as Message<TContent>;

    return new Message(message);
  }
}
