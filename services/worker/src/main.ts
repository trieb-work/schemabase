// import * as bulkorder from "@eci/pkg/integration-bulkorders";
import { env } from "@eci/pkg/env";
// import { StrapiEntryUpdate } from "./handler/strapiEntryUpdate";
// import { StrapiEntryCreate } from "./handler/strapiEntryCreate";
import { PackageEventHandler } from "@eci/pkg/integration-tracking";
import { PrismaClient } from "@eci/pkg/prisma";
import {
  BullMQProducer,
  BullMQSubscriber,
  EventSchemaRegistry,
  publishSuccess,
  Topic,
} from "@eci/pkg/events";
import * as tracking from "@eci/pkg/integration-tracking";
import { Sendgrid } from "@eci/pkg/email/src/emailSender";
import { CronTable } from "./crontable";
import { LoggerWithElastic } from "@eci/pkg/logger/src/loggerWithElastic";

async function main() {
  const logger = new LoggerWithElastic({
    meta: {
      env: env.require("ECI_ENV"),
    },
    enableElasticLogDrain: false,
  }).with({ "service.name": "eci" });

  logger.info("Starting worker");

  const prisma = new PrismaClient();

  const redisConnection = {
    host: env.require("REDIS_HOST"),
    port: parseInt(env.require("REDIS_PORT")),
    password: env.require("REDIS_PASSWORD"),
  };
  const crontable = new CronTable({ prisma, logger, redisConnection });

  await crontable.scheduleTenantWorkflows();

  /**
   * Store package updates
   */
  const packageHandlerBull = new PackageEventHandler({
    db: prisma,
    onSuccess: publishSuccess(
      await BullMQProducer.new({ topic: Topic.PACKAGE_STATE_TRANSITION }),
      Topic.PACKAGE_STATE_TRANSITION,
    ),
    logger,
  });
  const packageEventConsumerBull = await BullMQSubscriber.new<
    EventSchemaRegistry.PackageUpdate["message"]
  >({
    topic: Topic.PACKAGE_UPDATE,
    logger,
  });
  packageEventConsumerBull.subscribe(packageHandlerBull);

  /**
   * Send emails when packages update
   */
  const customerNotifierSubscriber = await BullMQSubscriber.new<
    EventSchemaRegistry.PackageStateTransition["message"]
  >({
    topic: Topic.PACKAGE_STATE_TRANSITION,
    logger,
  });

  customerNotifierSubscriber.subscribe(
    new tracking.CustomerNotifier({
      db: prisma,
      onSuccess: publishSuccess(
        await BullMQProducer.new({ topic: Topic.NOTIFICATION_EMAIL_SENT }),
        Topic.NOTIFICATION_EMAIL_SENT,
      ),
      logger,
      emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY"), {
        logger,
      }),
    }),
  );
}

main().catch((err) => {
  const logger = new LoggerWithElastic(/* TODO: */);
  logger.error("Main process failed", err);
  console.error(err);
  process.exit(1);
});
