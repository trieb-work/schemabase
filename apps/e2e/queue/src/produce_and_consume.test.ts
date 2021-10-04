import { QueueManager, Signer } from "@eci/events/client";
import { NoopLogger } from "@eci/util/logger";
import {idGenerator} from "@eci/util/ids"
describe("produce and consume over redis", () => {
  const logger = new NoopLogger();

  const topic = idGenerator.id("test");
  const queue = new QueueManager<string, { hello: string }>({
    name: "testQueue",
    signer: new Signer({ signingKey: "test" }),
    logger,
    connection: {
      host: "localhost",
      port: "6379",
    },
  });

  it("can send a message and receive it", async () => {
    const payload = { hello: "world" };

    queue.consume(topic, async (message) => {
      expect(message.payload).toEqual(payload);

      /**
       * This should allow the test to end
       */
      await queue.close();
    });

    await queue.produce(topic, {
      payload,
      meta: {
        traceId: "traceId",
      },
    });
  }, 20_000);
});
