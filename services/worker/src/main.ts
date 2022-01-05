import { Logger } from "@eci/pkg/logger";
import * as bulkorder from "@eci/pkg/integration-bulkorders";
import { env } from "@chronark/env";
import { strapiEntryCreate } from "./handler/strapiEntryCreate";
import { strapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  Signer,
  KafkaSubscriber,
  newKafkaClient,
  KafkaProducer,
} from "@eci/pkg/events";
import * as tracking from "@eci/pkg/integration-tracking";

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

  /**
   * Tracking
   */
  const trackingIntegration = new tracking.Tracking({
    db: prisma,
    eventProducer: await KafkaProducer.new({
      signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
    }),
    logger,
  });

  const trackingConsumer = await KafkaSubscriber.new<
    tracking.Topic,
    tracking.PackageEvent
  >({
    topics: [tracking.Topic.PACKAGE_UPDATE],
    signer,
    logger,
    groupId: "trackingHandler",
  });

  trackingConsumer.subscribe(async (message) => {
    await trackingIntegration.handlePackageEvent(
      { traceId: message.header.traceId },
      message.content,
    );
  });
}

main();
