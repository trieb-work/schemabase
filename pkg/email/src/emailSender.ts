// import sg from "@sendgrid/client"

export interface EmailTemplateSender {
  sendEmail: (templateId: string) => Promise<{ id: string }>;
}
// export class Sendgrid implements EmailTemplateSender {

// }
