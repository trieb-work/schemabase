// track and trace class using prisma and logger
// in constructor and afterwards scheduling per tenant the track and trace
// jobs
import { Sendgrid } from "@eci/pkg/email/src/emailSender";
import {
  BullMQProducer,
  BullMQSubscriber,
  EventSchemaRegistry,
  Topic,
  publishSuccess,
} from "@eci/pkg/events";
import { PackageEventHandler } from "@eci/pkg/integration-tracking";
import { ILogger } from "@eci/pkg/logger";
import { RedisConnection } from "@eci/pkg/scheduler/scheduler";
import { PrismaClient } from "@prisma/client";
import * as tracking from "@eci/pkg/integration-tracking";
import { env } from "@eci/pkg/env";

interface TrackTraceConfig {
  logger: ILogger;
  db: PrismaClient;
  redisConnection: RedisConnection;
}

export class TrackTrace {
  private readonly logger: ILogger;

  private readonly db: PrismaClient;

  constructor(config: TrackTraceConfig) {
    this.logger = config.logger;
    this.db = config.db;
  }

  public async schedule(): Promise<void> {
    const tenants = await this.db.tenant.findMany();
    for (const tenant of tenants) {
      this.logger.info(`Scheduling track and trace for tenant ${tenant.id}`);
      /**
       * Store package updates
       */
      const packageHandlerBull = new PackageEventHandler({
        db: this.db,
        onSuccess: publishSuccess(
          await BullMQProducer.new({
            topic: Topic.PACKAGE_STATE_TRANSITION,
            tenantId: tenant.id,
          }),
          Topic.PACKAGE_STATE_TRANSITION,
        ),
        logger: this.logger,
      });
      const packageEventConsumerBull = await BullMQSubscriber.new<
        EventSchemaRegistry.PackageUpdate["message"]
      >({
        topic: Topic.PACKAGE_UPDATE,
        logger: this.logger,
        tenantId: tenant.id,
      });
      packageEventConsumerBull.subscribe(packageHandlerBull);

      /**
       * Send emails when packages update
       */
      const customerNotifierSubscriber = await BullMQSubscriber.new<
        EventSchemaRegistry.PackageStateTransition["message"]
      >({
        topic: Topic.PACKAGE_STATE_TRANSITION,
        logger: this.logger,
        tenantId: tenant.id,
      });

      customerNotifierSubscriber.subscribe(
        new tracking.CustomerNotifier({
          db: this.db,
          onSuccess: publishSuccess(
            await BullMQProducer.new({
              topic: Topic.NOTIFICATION_EMAIL_SENT,
              tenantId: tenant.id,
            }),
            Topic.NOTIFICATION_EMAIL_SENT,
          ),
          logger: this.logger,
          emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY"), {
            logger: this.logger,
          }),
        }),
      );
    }
  }
}
