import type { Context } from "@eci/pkg/context";
import { KafkaProducer } from "./events";
import { Message } from "./message";
import { Topic } from "./registry";

export interface EventHandler<TEvent> {
  handleEvent: (ctx: Context, event: TEvent) => Promise<void>;
}

export function onSuccess<TEvent>(
  producer: KafkaProducer<TEvent>,
  topic: Topic,
): OnSuccess<TEvent> {
  return async (ctx: Context, content: TEvent): Promise<void> => {
    await producer.produce(
      topic,
      new Message({
        header: {
          traceId: ctx.traceId,
        },
        content,
      }),
    );
  };
}

export type OnSuccess<TEvent> = (ctx: Context, event: TEvent) => Promise<void>;
