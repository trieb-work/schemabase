import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import {
  EventSchemaRegistry,
  KafkaProducer,
  Message,
  Signer,
  Topic,
} from "@eci/pkg/events";
import {
  authorizeIntegration,
  extendContext,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { env } from "@eci/pkg/env";
import { HttpError } from "@eci/pkg/errors";

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.object({
    JSONString: z.string(),
  }),
});

const eventValidation = z.object({
  salesorder: z.object({
    salesorder_number: z.string(),
    customer_id: z.string(),
    contact_person_details: z
      .array(
        z.object({
          email: z.string().email(),
        }),
      )
      .nonempty(),
    packages: z
      .array(
        z.object({
          package_id: z.string(),
          shipment_order: z.object({
            tracking_number: z.string(),
            carrier: z.string(),
          }),
        }),
      )
      .optional(),
  }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  req,
  res,
  backgroundContext,
}): Promise<void> => {
  const {
    query: { webhookId },
    body,
  } = req;

  const event = await eventValidation
    .parseAsync(JSON.parse(body.JSONString))
    .catch((err) => {
      throw new HttpError(400, err.message);
    });

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  if (!event.salesorder.packages || event.salesorder.packages.length === 0) {
    ctx.logger.info("No packages found in order, skipping...");
    return res.json({
      status: "received",
      traceId: ctx.trace.id,
    });
  }

  const webhook = await ctx.prisma.incomingWebhook.findUnique({
    where: {
      id: webhookId,
    },
    include: {
      zohoApp: {
        include: {
          trackingIntegrations: {
            include: {
              subscription: true,
            },
          },
        },
      },
    },
  });

  if (webhook == null) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }
  const { zohoApp } = webhook;
  if (zohoApp == null) {
    throw new HttpError(400, "zoho app is not configured");
  }
  const { trackingIntegrations } = zohoApp;
  if (!trackingIntegrations) {
    throw new HttpError(400, "Integration is not configured");
  }

  for (const integration of trackingIntegrations) {
    /**
     * Ensure the integration is enabled and payed for
     */
    authorizeIntegration(integration);

    const kafka = await KafkaProducer.new({
      signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
    });

    const message = new Message<EventSchemaRegistry.OrderUpdate["message"]>({
      header: {
        traceId: ctx.trace.id,
      },
      content: {
        zohoAppId: zohoApp.id,
        customerId: event.salesorder.customer_id,
        emails: event.salesorder.contact_person_details.map((c) => c.email),
        externalOrderId: event.salesorder.salesorder_number,
        packages: event.salesorder.packages.map((p) => ({
          packageId: p.package_id,
          trackingId: p.shipment_order.tracking_number,
          carrier: p.shipment_order.carrier,
        })),
      },
    });

    const { messageId } = await kafka.produce(Topic.ORDER_UPDATE, message);
    ctx.logger.info("Queued new event", { messageId });
  }
  res.json({
    status: "received",
    traceId: ctx.trace.id,
  });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
