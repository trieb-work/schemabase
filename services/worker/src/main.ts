import { Logger } from "@eci/pkg/logger";
import * as bulkorder from "@eci/pkg/integration-bulkorders";
import { env } from "@eci/pkg/env";
import { StrapiEntryUpdate } from "./handler/strapiEntryUpdate";
import { StrapiEntryCreate } from "./handler/strapiEntryCreate";
import { PackageEventHandler } from "@eci/pkg/integration-tracking";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  EventSchemaRegistry,
  KafkaProducer,
  KafkaSubscriber,
  newKafkaClient,
  publishSuccess,
  Signer,
  Topic,
} from "@eci/pkg/events";
import * as tracking from "@eci/pkg/integration-tracking";
import { Sendgrid } from "@eci/pkg/email/src/emailSender";
import { OrderUpdater } from "./handler/zohoOrderUpsert";
import { CronTable } from "./crontable";

async function main() {
  const logger = new Logger({
    meta: {
      env: env.require("ECI_ENV"),
    },
    enableElasticLogDrain: env.get("ECI_ENV") === "production",
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
  const redisConnection = {
    host: env.require("REDIS_HOST"),
    port: parseInt(env.require("REDIS_PORT")),
    password: env.require("REDIS_PASSWORD"),
  };
  const crontable = new CronTable({ prisma, logger, redisConnection });

  await crontable.scheduleTenantWorkflows();

  /**
   *  Strapi
   */
  const strapiEntryCreateConsumer = await KafkaSubscriber.new<
    bulkorder.EntryEvent & { zohoAppId: string }
  >({
    topic: Topic.STRAPI_ENTRY_CREATE, // bei bullmq der message name
    signer,
    logger,
    groupId: "strapiEntryCreateConsumer", // bei bullmq nicht benötigt
  });

  strapiEntryCreateConsumer.subscribe(
    // hier wird der message handler registriert
    new StrapiEntryCreate({
      prisma,
      logger,
      onSuccess: publishSuccess(producer, Topic.BULKORDER_SYNCED),
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
    onSuccess: publishSuccess(producer, Topic.PACKAGE_STATE_TRANSITION),
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
      onSuccess: publishSuccess(producer, Topic.NOTIFICATION_EMAIL_SENT),
      logger,
      emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY"), {
        logger,
      }),
    }),
  );

  /**
   * A new order was created in zoho and we received that event via webhooks.
   * Now we need to sync our database and create or edit the order
   */
  const zohoOrderUpserter = await KafkaSubscriber.new<
    EventSchemaRegistry.OrderUpdate["message"]
  >({
    topic: Topic.ORDER_UPDATE,
    signer,
    logger,
    groupId: "zohoOrderUpserter",
  });

  zohoOrderUpserter.subscribe(
    new OrderUpdater({
      db: prisma,
      onSuccess: publishSuccess(producer, Topic.ORDER_UPDATE_COMPLETE),
      logger,
    }),
  );
}

main().catch((err) => {
  const logger = new Logger(/* TODO: */);
  logger.error("Main process failed", err);
  console.error(err);
  process.exit(1);
});
