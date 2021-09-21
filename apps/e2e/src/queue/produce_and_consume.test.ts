import { Queue, Signer } from "@eci/events-client";
import { NoopLogger } from "@eci/util/logger";
import { randomUUID } from "crypto";
describe("produce and consume over redis", () => {
  const logger = new NoopLogger();

  const topic = randomUUID();
  const queue = new Queue<string, { hello: string }>({
    name: "testQueue",
    signer: new Signer(logger),
    logger,
    redis: {
      host: "localhost",
      port: "6379",
    },
  });

  it("can send a message and receive it", async () => {
    const payload = { hello: "world" };

    queue.onReceive(topic, async (message) => {
      expect(message.payload).toEqual(payload);

      /**
       * This should allow the test to end
       */
      await queue.pause();
    });

    await queue.produce(topic, {
      payload,
      meta: {
        traceId: "traceId",
      },
    });
  }, 20_000);
});
