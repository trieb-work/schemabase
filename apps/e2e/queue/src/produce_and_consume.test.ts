import { KafkaProducer, KafkaSubscriber, Signer } from "@eci/events";
import { NoopLogger } from "@eci/util/logger";
import { idGenerator } from "@eci/util/ids";

describe("produce and consume over redis", () => {
  it("can send a message and receive it", async () => {
    const topic = idGenerator.id("test");
    const signer = new Signer({ signingKey: "test" });
    const producer = await KafkaProducer.new({ signer });
    const consumer = await KafkaSubscriber.new({
      topics: [topic],
      groupId: "test",
      signer,
      logger: new NoopLogger(),
    });

    const content = { hello: "world" };

    consumer.subscribe( async (message) => {
      expect(message.content).toEqual(content);

      /**
       * This should allow the test to end
       */
      await consumer.close();
    });

    await producer.produce({
      headers: {
        topic,
        traceId: "traceId"
      },
      content: {
        hello: "world",
      },
    });

    await producer.close();
  }, 20_000);
});
