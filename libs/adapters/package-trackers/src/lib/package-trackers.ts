import { Logger } from "@eci/util/logger";
import { MailService, ClientResponse, MailDataRequired } from "@sendgrid/mail";
import moment from "moment-business-days";
import { Tracker } from "@eci/adapters/easypost";
// @ts-expect-error no ts bindings available
import EasyPost from "@easypost/api";

type Config = {
  logger?: Logger;
  easyPostApiToken: string;
  mailgunApiKey?: string;
  sendgridApikey?: string;
  mailgunFromTitle?: string;
  mailgunFromEmail?: string;
  fromEmail?: string;
  fromTitle: string;
  testMode?: boolean;
};

export class PackageTracker {
  private easyPostApiToken: string;
  private easyPost: EasyPost;
  private logger: Logger | Console;
  private mailer: MailService;
  private sender: string;
  private fromTitle: string;
  private testMode: boolean;

  constructor(config: Config) {
    this.easyPostApiToken = config.easyPostApiToken;
    this.easyPost = new EasyPost(this.easyPostApiToken || "1234");
    this.logger = config.logger || console;
    this.sender = config.mailgunFromEmail ?? config.fromEmail ?? "empty";
    this.fromTitle = config.fromTitle;
    this.mailer = new MailService();
    if (config.sendgridApikey) this.mailer.setApiKey(config.sendgridApikey);
    this.testMode = config.testMode ?? false;
  }

  /**
   * Add an easypost tracker
   * @param trackingCode
   * @param carrier
   */
  public async addTracker(
    trackingCode: string,
    carrier: "DPD" | "DHL Germany" | "UPS",
  ): Promise<Tracker> {
    const tracker = new this.easyPost.Tracker({
      tracking_code: trackingCode,
      carrier,
    });
    return tracker.save();
  }

  public async getTracker(trackerId: string): Promise<Tracker> {
    return this.easyPost.Tracker.retrieve(trackerId);
  }

  /**
   * Creates or updates a webhook in Easypost. Returns the Easypost ID of the Webhook
   * @param url
   * @param id
   */
  public async upsertEasypostWebhook(
    url: string,
    id?: string,
  ): Promise<string> {
    if (id) {
      this.logger.info(`Updating EasyPost Webhook with ID ${id}`);
      const webhook = await this.easyPost.Webhook.retrieve(id);
      webhook.url = url;
      await webhook.save();
      return id;
    }

    const currentHooks = await this.easyPost.Webhook.all();
    const isAlreadyExisting = currentHooks.find(
      (x: { url: string }) => x.url === url,
    );
    if (isAlreadyExisting) {
      this.logger.info(
        `We already have a valid Webhook with Id ${isAlreadyExisting.id}`,
      );
      return isAlreadyExisting.id as string;
    }
    return "";
  }

  /**
   * send out an email via mailgun
   * @param toEmail
   * @param subject
   * @param html
   * @param replyTo
   * @param deliveryTime
   */
  public async sendMail({
    toEmail,
    subject,
    html,
    replyTo,
    deliveryTime,
    variables,
    template,
  }: {
    toEmail: string;
    subject: string;
    html?: string;
    replyTo?: string;
    deliveryTime?: number;
    variables?: Record<string, unknown>;
    template?: string;
  }): Promise<[ClientResponse, unknown]> {
    const additionals: Record<string, string | number> = {};
    if (replyTo) {
      additionals["h:Reply-To"] = replyTo;
    }
    if (deliveryTime) {
      additionals["o:deliverytime"] = deliveryTime;
    }
    if (template) {
      additionals["template"] = template;
    }
    if (variables) {
      additionals["h:X-Mailgun-Variables"] = JSON.stringify(variables);
    }
    const msg = {
      to: toEmail,
      from: {
        email: this.sender,
        name: this.fromTitle,
      },
      replyTo,
      sendAt: deliveryTime,
      templateId: template,
      subject,
      html,
      dynamicTemplateData: variables,

      mailSettings: {
        sandboxMode: {
          enable: this.testMode,
        },
      },
    } as MailDataRequired;
    return await this.mailer.send(msg);
  }

  /**
   * Get the next business day as date object. Always returns the next business day, mornings at 8:00;
   * If the current day is a business day before 14:00, we return now + 10 mins for security;
   */
  static getNextBusinessDay() {
    const now = moment();
    const endOfBusinessDay = moment().set("hour", 15);
    if (now.isBusinessDay() && now < endOfBusinessDay) {
      const date = now.add(10, "minutes").toDate();
      const rfc2822 = date.toUTCString();
      const unixSeconds = now.add(10, "minutes").unix();
      return { unixSeconds, rfc2822, date };
    }
    const momentDate = moment().nextBusinessDay().set("hour", 8);
    const date = momentDate.toDate();
    const rfc2822 = date.toUTCString();
    const unixSeconds = momentDate.unix();

    return { unixSeconds, rfc2822, date };
  }
}
