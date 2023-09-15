import { HttpClient } from "@eci/pkg/http";
import { ILogger } from "@eci/pkg/logger";

export interface EmailTemplateSender {
    sendTemplate: (
        templateId: string,
        sender: string,
        receiver: string,
        substitutions: Record<string, unknown>,
    ) => Promise<{ id: string }>;
}
export class Sendgrid implements EmailTemplateSender {
    private readonly client: HttpClient;

    private logger: ILogger;

    constructor(apiKey: string, config: { logger: ILogger }) {
        this.client = new HttpClient();
        this.client.setHeader("Authorization", `Bearer ${apiKey}`);
        this.logger = config.logger;
    }

    public async sendTemplate(
        templateId: string,
        sender: string,
        receiver: string,
        /**
         * Template strings - key, that gets replaced with the value
         */
        substitutions: Record<string, unknown>,
    ): Promise<{ id: string }> {
        const res = await this.client.call({
            url: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                template_id: templateId,
                from: { email: sender },
                personalizations: [
                    {
                        to: [{ email: receiver }],
                        dynamic_template_data: substitutions,
                    },
                ],
            }),
        });
        if (!res.ok) {
            throw new Error(
                `Unable to send email: ${res.status}: ${JSON.stringify(
                    res.data,
                )}`,
            );
        }
        const messageId = res.headers["x-message-id"] ?? "";
        this.logger.info("Sent email", {
            messageId,
            templateId,
        });
        return { id: messageId.toString() };
    }
}
