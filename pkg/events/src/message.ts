import { id } from "@eci/pkg/ids";

// /**
//  * Additional meta information about the message
//  */
export type Header = {
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
  public readonly header: Header;

  public readonly content: TContent;

  constructor(message: {
    header: OptionalKey<Header, "id">;
    content: TContent;
  }) {
    this.header = Object.freeze({
      id: message.header.id ?? id.id("message"),
      ...message.header,
    });
    this.content = Object.freeze(message.content);
  }

  public serialize(): Buffer {
    return Buffer.from(
      JSON.stringify({
        header: this.header,
        content: this.content,
      }),
    );
  }

  static deserialize<TContent>(buf: Buffer): Message<TContent> {
    const message = JSON.parse(buf.toString()) as Message<TContent>;

    return new Message(message);
  }
}
