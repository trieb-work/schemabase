import { Queue } from "@eci/events-client";
import { EntryEvent } from "./validation/entry";
import { Topic, StrapiQueueConfig } from "./types";

/**
 * All this does it guarantee the name of the queue is always the same.
 */
export abstract class StrapiQueue {
  protected queue: Queue<Topic, EntryEvent>;
  constructor(config: StrapiQueueConfig) {
    this.queue = new Queue<Topic, EntryEvent>({
      name: "strapi",
      ...config,
    });
  }
}
