import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { shouldNotify } from "./eventSorting";
import { EmailTemplateSender } from "@eci/pkg/email/src/emailSender";
import { EventSchemaRegistry } from "@eci/pkg/events/src/registry";

export type CustomerNotifierConfig = {
  db: PrismaClient;
  onSuccess: (ctx: Context, res: { emailId: string }) => Promise<void>;
  logger: ILogger;
  emailTemplateSender: EmailTemplateSender;
};

export class CustomerNotifier {
  private db: PrismaClient;

  private onSuccess: (ctx: Context, res: { emailId: string }) => Promise<void>;

  private logger: ILogger;

  private emailTemplateSender: EmailTemplateSender;

  constructor(config: CustomerNotifierConfig) {
    this.db = config.db;
    this.onSuccess = config.onSuccess;
    this.logger = config.logger;
    this.emailTemplateSender = config.emailTemplateSender;
  }

  public async handleEvent(
    ctx: Context,
    event: EventSchemaRegistry.PackageStateTransition["message"],
  ): Promise<void> {
    const packageEvent = await this.db.packageEvent.findUnique({
      where: {
        id: event.packageEventId,
      },
      include: {
        sentEmail: true,
        package: {
          include: { order: true, events: true },
        },
      },
    });
    if (!packageEvent) {
      throw new Error(
        `No package event found with id: ${event.packageEventId}`,
      );
    }

    if (
      !packageEvent.sentEmail &&
      shouldNotify(event.previousState, packageEvent.state)
    ) {
      const integration = await this.db.trackingIntegration.findUnique({
        where: {
          id: event.integrationId,
        },
        include: {
          trackingEmailApp: {
            include: {
              sendgridTemplates: true,
            },
          },
        },
      });
      if (!integration) {
        throw new Error(
          `No trackingIntegration found for id: ${event.integrationId}`,
        );
      }
      const templates = integration.trackingEmailApp.sendgridTemplates;
      const template = templates.find(
        (t) => t.packageState === packageEvent.state,
      );
      if (!template) {
        throw new Error(`No matching template found for event: ${event}`);
      }
      const { id } = await this.emailTemplateSender.sendTemplate(
        template.templateId,
        packageEvent.package.order.email,
        {
          time: packageEvent.time.toString,
          newState: packageEvent.state,
          message: packageEvent.message,
          location: packageEvent.location,
        },
      );
      this.logger.info("Email id", { id });
      await this.onSuccess(ctx, { emailId: id });
    }
  }
}
