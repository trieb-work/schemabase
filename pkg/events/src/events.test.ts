// Test cases for the events class. We use a local redis in docker for testing. We test
// the creating and subscribing of bull events

import { AssertionLogger } from "@eci/pkg/logger";
import { BullMQProducer, BullMQSubscriber } from "./events";
import { Message } from "./message";
import { EventSchemaRegistry, Topic } from "./registry";
import { describe, expect, test } from "@jest/globals";
import { config } from "dotenv";

config({ path: ".env" });

describe("Events test cases", () => {
    test("it should work to create a new event", async () => {
        const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
            trackingId: "334455",
            time: new Date().getTime() / 1000,
            location: "",
            state: "DELIVERED",
            trackingIntegrationId: "12345",
        };

        const bullMQ = await BullMQProducer.new<
            EventSchemaRegistry.PackageUpdate["message"]
        >({
            topic: Topic.PACKAGE_UPDATE,
            tenantId: "test",
        });

        const message = new Message({
            header: {
                traceId: "12345",
            },
            content: packageEvent,
        });

        const { messageId } = await bullMQ.produce(
            Topic.PACKAGE_UPDATE,
            message,
        );
        expect(messageId).toBeDefined();
        await bullMQ.close();
    });

    test("It should work to describe to an event and consume the message", async () => {
        const packageEventConsumerBull = await BullMQSubscriber.new<
            EventSchemaRegistry.PackageUpdate["message"]
        >({
            topic: Topic.PACKAGE_UPDATE,
            logger: new AssertionLogger(),
            tenantId: "test",
        });
        packageEventConsumerBull.subscribe({
            handleEvent: async (ctx, event) => {
                expect(event.state).toEqual("DELIVERED");
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        packageEventConsumerBull.close();
    });
});
