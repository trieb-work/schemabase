import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { isValidTransition } from "./eventSorting";
import { EmailTemplateSender } from "@eci/pkg/email/src/emailSender";
import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";

export type CustomerNotifierConfig = {
  db: PrismaClient;
  onSuccess: OnSuccess<{ emailId: string }>;
  logger: ILogger;
  emailTemplateSender: EmailTemplateSender;
};

export class CustomerNotifier
  implements
    EventHandler<EventSchemaRegistry.PackageStateTransition["message"]>
{
  private db: PrismaClient;

  private onSuccess: OnSuccess<{ emailId: string }>;

  private logger: ILogger;

  private emailTemplateSender: EmailTemplateSender;

  constructor(config: CustomerNotifierConfig) {
    this.db = config.db;
    this.onSuccess = config.onSuccess;
    this.logger = config.logger.with({ handler: "customernotifier" });
    this.emailTemplateSender = config.emailTemplateSender;
  }

  public async handleEvent(
    ctx: Context,
    event: EventSchemaRegistry.PackageStateTransition["message"],
  ): Promise<void> {
    this.logger.debug("New event", { event });
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
      isValidTransition(event.previousState, packageEvent.state)
    ) {
      this.logger.info("Sending transactional email", {
        packageEventId: packageEvent.id,
        state: packageEvent.state,
      });
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
      const res = await this.emailTemplateSender.sendTemplate(
        template.templateId,
        packageEvent.package.order.email,
        {
          time: packageEvent.time.toString,
          newState: packageEvent.state,
          message: packageEvent.message,
          location: packageEvent.location,
        },
      );

      await this.db.transactionalEmail.create({
        data: {
          id: id.id("email"),
          time: new Date(),
          email: packageEvent.package.order.email,
          packageEventId: event.packageEventId,
          sentEmailId: res.id,
        },
      });
      await this.onSuccess(ctx, { emailId: res.id });
    }
  }
}
