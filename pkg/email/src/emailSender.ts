import { HttpClient } from "@eci/pkg/http";

export interface EmailTemplateSender {
  sendTemplate: (
    templateId: string,
    receiver: string,
    substitutions: Record<string, unknown>,
  ) => Promise<{ id: string }>;
}
export class Sendgrid implements EmailTemplateSender {
  private client: HttpClient;
  constructor(apiKey: string) {
    this.client = new HttpClient();
    this.client.setHeader("Authorization", `Bearer ${apiKey}`);
  }

  public async sendTemplate(
    templateId: string,
    receiver: string,
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
        from: { email: "servus@pfefferundfrost.de" },
        personalizations: [
          {
            to: [{ email: receiver }],
            dynamic_template_data: substitutions,
          },
        ],
      }),
    });
    return { id: res.headers["x-message-id"].toString() ?? "" };
  }
}
