import { PrismaClient } from "@prisma/client";
import { Context } from "@eci/pkg/context";
import { ILogger } from "@eci/pkg/logger";
import { isValidTransition } from "./eventSorting";
import { EmailTemplateSender } from "@eci/pkg/email/src/emailSender";
import { EventHandler, EventSchemaRegistry, OnSuccess } from "@eci/pkg/events";
import { id } from "@eci/pkg/ids";

export interface CustomerNotifierConfig {
  db: PrismaClient;
  onSuccess: OnSuccess<{ emailId: string }>;
  logger: ILogger;
  emailTemplateSender: EmailTemplateSender;
}

/**
 * When we receive an OrderUpadteEvent from Zoho a different eventHandler syncs
 * the order/packages to our internal db and then emits a new event which this
 * handler will process.
 *
 * This handler is then responbile for sending an email to a customer only if it
 * is actually new and not just received out of order.
 */
export class CustomerNotifier // warum nicht NoticationEventHandler wie alle anderen?
  implements
    EventHandler<EventSchemaRegistry.PackageStateTransition["message"]>
{
  private readonly db: PrismaClient;

  private readonly onSuccess: OnSuccess<{ emailId: string }>;

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
          include: { order: { include: { mainContact: true } }, events: true },
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
      if (!packageEvent.package.order.trackingNotificationsEnabled) {
        this.logger.info(
          "Tracking notification emails are disable for order" +
            `${packageEvent.package.order.orderNumber}`,
        );
      }
      const customerEmail = packageEvent.package.order.mainContact.email;
      this.logger.info(`Sending transactional email to ${customerEmail}`, {
        packageEventId: packageEvent.id,
        state: packageEvent.state,
        trackingId: packageEvent.package.trackingId,
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
        this.logger.error(
          `No trackingIntegration found for id: ${event.integrationId}`,
        );
        throw new Error(
          `No trackingIntegration found for id: ${event.integrationId}`,
        );
      }
      const templates = integration.trackingEmailApp.sendgridTemplates.filter(
        (t) => t.packageState === packageEvent.state,
      );

      if (templates.length === 0) {
        this.logger.error(
          `No matching template found for event: ${JSON.stringify(
            event,
          )} - ${JSON.stringify(packageEvent.state)}`,
        );
        return;
      }
      const template = templates.find(
        (t) => t.language === packageEvent.package.order.language,
      );

      if (!template) {
        this.logger.error(
          "No matching language for this template found." +
            `Language: ${packageEvent.package.order.language}`,
        );
        return;
      }

      const send = async () => {
        const contact = packageEvent.package.order.mainContact;
        if (!contact.email) {
          this.logger.warn(`No Email Address found for contact ${contact}`);
          return "";
        }
        const firstName =
          packageEvent.package.order.firstName || contact.firstName;
        if (!firstName) {
          this.logger.warn(
            `First Name not set! Can't send email. Contact object: ${JSON.stringify(
              contact,
            )}`,
          );
          return "";
        }
        const res = await this.emailTemplateSender.sendTemplate(
          template.templateId,
          integration.trackingEmailApp.sender,
          "test@trieb.work",
          {
            time: packageEvent.time.toLocaleString(
              packageEvent.package.order.language,
            ),
            newState: packageEvent.state,
            message: packageEvent.message,
            location: packageEvent.location,
            FIRSTNAME: contact.firstName,
            LASTNAME: contact.lastName,
            TRACKINGPROVIDER: packageEvent.package.carrier,
            TRACKINGNUMBER: packageEvent.package.trackingId,
            TRACKINGPORTALURL: packageEvent.package.carrierTrackingUrl,
          },
        );

        await this.db.transactionalEmail.create({
          data: {
            id: id.id("email"),
            time: new Date(),
            email: contact.email,
            packageEventId: event.packageEventId,
            sentEmailId: res.id,
          },
        });
        return res.id;
      };
      const emailId = await send();
      await this.onSuccess(ctx, { emailId });
    } else {
      this.logger.info(
        `Not sending a transactional email. No valid transition: \
        ${event.previousState}  ${packageEvent.state}`,
      );
    }
  }
}
