import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { isValidTransition } from "./eventSorting";
import { EmailTemplateSender } from "@eci/pkg/email/src/emailSender";
import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";

export interface CustomerNotifierConfig {
  db: PrismaClient;
  onSuccess: OnSuccess<{ emailIds: string[] }>;
  logger: ILogger;
  emailTemplateSender: EmailTemplateSender;
}

export class CustomerNotifier
  implements
    EventHandler<EventSchemaRegistry.PackageStateTransition["message"]>
{
  private readonly db: PrismaClient;

  private readonly onSuccess: OnSuccess<{ emailIds: string[] }>;

  private readonly logger: ILogger;

  private readonly emailTemplateSender: EmailTemplateSender;

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
    if (packageEvent == null) {
      throw new Error(
        `No package event found with id: ${event.packageEventId}`,
      );
    }

    if (
      packageEvent.sentEmail == null &&
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
      if (integration == null) {
        throw new Error(
          `No trackingIntegration found for id: ${event.integrationId}`,
        );
      }
      const templates = integration.trackingEmailApp.sendgridTemplates.filter(
        (t) => t.packageState === packageEvent.state,
      );

      if (templates.length === 0) {
        throw new Error(`No matching template found for event: ${event}`);
      }
      const template =
        templates.find(
          (t) => t.language === packageEvent.package.order.language,
        ) ??
        templates.find(
          (t) => t.language === integration.trackingEmailApp.defaultLanguage,
        );

      if (template == null) {
        throw new Error("No matching language for this template found");
      }

      const emailIds = await Promise.all(
        packageEvent.package.order.emails.map(async (email) => {
          const res = await this.emailTemplateSender.sendTemplate(
            template.templateId,
            "test@trieb.work",
            {
              time: packageEvent.time.toString(),
              newState: packageEvent.state,
              message: packageEvent.message,
              location: packageEvent.location,
              trackingId: packageEvent.package.trackingId,
            },
          );

          await this.db.transactionalEmail.create({
            data: {
              id: id.id("email"),
              time: new Date(),
              email,
              packageEventId: event.packageEventId,
              sentEmailId: res.id,
            },
          });
          return res.id;
        }),
      );
      await this.onSuccess(ctx, { emailIds });
    }
  }
}
