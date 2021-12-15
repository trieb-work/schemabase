/**
 * Message extended with metadata
 */
export type Message<TPayload> = {
  headers: Headers;

  /**
   * The content of the message.
   * This must be json serializable
   */
  payload: TPayload;
};

/**
 * Additional meta information about the message
 */
type Headers = {
  /**
   * Unique id for this messages
   */
  id: string;

  /**
   * The topic where this message is published
   */
  topic: string;

  /**
   * Used to uniquely identify a distributed trace through a system
   */
  traceId: string;

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
