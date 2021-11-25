/**
 * Message extended with metadata
 */
export type Message<TTopic, TPayload> = {
  header: Header<TTopic>;

  /**
   * The content of the message.
   * This must be json serializable
   */
  payload: TPayload;
};

/**
 * Additional meta information about the message
 */
type Header<TTopic> = {
  /**
   * Unique id for this messages
   */
  id: string;

  /**
   * The topic where this message is published
   */
  topic: TTopic;

  /**
   * Used to uniquely identify a distributed trace through a system
   */
  traceId: string;
};

/**
 * A signed message
 */
export type SignedMessage<TMessage> = {
  message: TMessage;
  /**
   * Siganture to verify the message comes from a trusted source
   */
  signature: string;
};
