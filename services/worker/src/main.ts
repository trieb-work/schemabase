import { Logger } from "@eci/pkg/logger";
import * as bulkorder from "@eci/pkg/integration-bulkorders";
import { env } from "@eci/pkg/env";
import { strapiEntryCreate } from "./handler/strapiEntryCreate";
import { strapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  Signer,
  KafkaSubscriber,
  newKafkaClient,
  KafkaProducer,
  Message,
  Topic,
} from "@eci/pkg/events";
import * as tracking from "@eci/pkg/integration-tracking";
import { Sendgrid } from "@eci/pkg/email/src/emailSender";
import { EventSchemaRegistry } from "@eci/pkg/events";
async function main() {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
  });
  logger.info("Starting worker");

  let kafkaConnected = false;
  const kafka = newKafkaClient().admin();
  for (let i = 0; i <= 5; i++) {
    const timeout = 2 ** i;
    try {
      await kafka.connect();
      kafkaConnected = true;
      break;
    } catch (e) {
      logger.warn(`Failed to connect to kafka, retrying in ${timeout} seconds`);
    }

    // eslint-disable-next-line no-undef
    await new Promise((resolve) => setTimeout(resolve, 1000 * timeout));
  }
  if (!kafkaConnected) {
    throw new Error("Unable to connect to kafka");
  }
  await kafka.disconnect();

  const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });
  await kafka.disconnect();
  const prisma = new PrismaClient();

  const strapiEntryCreateConsumer = await KafkaSubscriber.new<
    bulkorder.Topic,
    bulkorder.EntryEvent & { zohoAppId: string }
  >({
    topics: [bulkorder.Topic.ENTRY_CREATE],
    signer,
    logger,
    groupId: "strapiEntryCreateConsumer",
  });

  strapiEntryCreateConsumer.subscribe(strapiEntryCreate({ prisma, logger }));

  const strapiEntryUpdateConsumer = await KafkaSubscriber.new<
    bulkorder.Topic,
    bulkorder.EntryEvent & { zohoAppId: string }
  >({
    topics: [bulkorder.Topic.ENTRY_UPDATE],
    signer,
    logger,
    groupId: "strapiEntryUpdateConsumer",
  });
  strapiEntryUpdateConsumer.subscribe(strapiEntryUpdate({ prisma, logger }));

  const producer = await KafkaProducer.new({ signer });

  logger.info("Starting tracking service");
  /**
   * Tracking
   */
  const packageEventHandler = new tracking.PackageEventHandler({
    db: prisma,
    onSuccess: async (ctx, res) => {
      await producer.produce(
        Topic.PACKAGE_STATE_TRANSITION,
        new Message({
          header: {
            traceId: ctx.traceId,
          },
          content: res,
        }),
      );
    },
    logger,
  });

  const packageEventConsumer = await KafkaSubscriber.new<
    string,
    EventSchemaRegistry.PackageUpdate["message"]
  >({
    topics: ["tracking.package.update"],
    signer,
    logger,
    groupId: "trackingHandler",
  });

  packageEventConsumer.subscribe(async (message) => {
    logger.info("New incoming update even", { message });
    await packageEventHandler.handleEvent(
      { traceId: message.header.traceId },
      message.content,
    );
  });

  const customerNotifier = new tracking.CustomerNotifier({
    db: prisma,
    onSuccess: async (ctx, res) => {
      await producer.produce(
        Topic.NOTIFICATION_EMAIL_SENT,
        new Message({
          header: {
            traceId: ctx.traceId,
          },
          content: res,
        }),
      );
    },
    logger,
    emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY")),
  });

  const customerNotifierSubscriber = await KafkaSubscriber.new<
    EventSchemaRegistry.PackageStateTransition["topic"],
    EventSchemaRegistry.PackageStateTransition["message"]
  >({
    topics: [Topic.PACKAGE_STATE_TRANSITION],
    signer,
    logger,
    groupId: "trackingHandler",
  });

  customerNotifierSubscriber.subscribe(async (message) => {
    await customerNotifier.handleEvent(
      { traceId: message.header.traceId },
      message.content,
    );
  });
}

main();
