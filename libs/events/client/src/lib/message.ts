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
export type SignedMessage<TPayload> = Message<TPayload> & {
  /**
   * Siganture to verify the message comes from a trusted source
   */
  signature: string;
};
