import { Logger } from "@eci/pkg/logger";
import * as bulkorder from "@eci/pkg/integration-bulkorders";
import { env } from "@eci/pkg/env";
import { StrapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { StrapiEntryCreate } from "./handler/strapiEntryCreate";
import { PackageEventHandler } from "./handler/packageUpdate";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  Signer,
  KafkaSubscriber,
  newKafkaClient,
  KafkaProducer,
  Topic,
  onSuccess,
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
  logger.info("Connected to kafka");
  await kafka.disconnect();

  const signer = new Signer({ signingKey: env.require("SIGNING_KEY") });
  const prisma = new PrismaClient();
  const producer = await KafkaProducer.new({ signer });

  /**
   *  Strapi
   */
  const strapiEntryCreateConsumer = await KafkaSubscriber.new<
    bulkorder.EntryEvent & { zohoAppId: string }
  >({
    topic: Topic.STRAPI_ENTRY_CREATE,
    signer,
    logger,
    groupId: "strapiEntryCreateConsumer",
  });

  strapiEntryCreateConsumer.subscribe(
    new StrapiEntryCreate({
      prisma,
      logger,
      onSuccess: onSuccess(producer, Topic.BULKORDER_SYNCED),
    }),
  );

  const strapiEntryUpdateConsumer = await KafkaSubscriber.new<
    bulkorder.EntryEvent & { zohoAppId: string }
  >({
    topic: Topic.STRAPI_ENTRY_UPDATE,
    signer,
    logger,
    groupId: "strapiEntryUpdateConsumer",
  });
  strapiEntryUpdateConsumer.subscribe(
    new StrapiEntryUpdate({ prisma, logger }),
  );

  /**
   * Store package updates
   */

  const packageEventHandler = new PackageEventHandler({
    db: prisma,
    onSuccess: onSuccess(producer, Topic.PACKAGE_STATE_TRANSITION),
    logger,
  });

  const packageEventConsumer = await KafkaSubscriber.new<
    EventSchemaRegistry.PackageUpdate["message"]
  >({
    topic: Topic.PACKAGE_UPDATE,
    signer,
    logger,
    groupId: "packageEventHandler",
  });

  packageEventConsumer.subscribe(packageEventHandler);

  /**
   * Send emails when packages update
   */

  const customerNotifierSubscriber = await KafkaSubscriber.new<
    EventSchemaRegistry.PackageStateTransition["message"]
  >({
    topic: Topic.PACKAGE_STATE_TRANSITION,
    signer,
    logger,
    groupId: "customerNotifierSubscriber",
  });

  customerNotifierSubscriber.subscribe(
    new tracking.CustomerNotifier({
      db: prisma,
      onSuccess: onSuccess(producer, Topic.NOTIFICATION_EMAIL_SENT),
      logger,
      emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY")),
    }),
  );
}

main();
