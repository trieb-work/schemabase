import { z } from "zod";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import {
  authorizeIntegration,
  extendContext,
  setupPrisma,
} from "@eci/pkg/webhook-context";
import { HttpError } from "@eci/pkg/errors";
import { id } from "@eci/pkg/ids";
import { Carrier, Language, PackageState } from "@prisma/client";
import { Zoho, ZohoApiClient } from "@trieb.work/zoho-ts/dist/v2";
import { generateTrackingPortalURL } from "@eci/pkg/integration-tracking";
const payloadValidation = z.object({
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
    packages: z.array(
      z.object({
        shipment_order: z.object({
          tracking_number: z.string(),
          carrier: z.string(),
        }),
      }),
    ),
  }),
});

function parseCarrier(carrier: string): Carrier {
  if (carrier.toLowerCase() === "dpd") {
    return Carrier.DPD;
  }
  throw new HttpError(400, `Only DPD is supported, received: ${carrier}`);
}

function parseLanguage(language: string): Language {
  switch (language.toLowerCase()) {
    case "en":
      return Language.EN;
    case "de":
      return Language.DE;
    default:
      throw new HttpError(400, `Language not supported: ${language}`);
  }
}

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.record(z.string()),
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

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());
  ctx.logger.info("Incoming zoho webhook", {
    webhookId,
    body: body,
  });
  const rawPayload = Object.keys(body)[0];
  ctx.logger.info("rawPayload", {
    rawPayload,
  });
  const payload = payloadValidation.parse(
    JSON.parse(decodeURIComponent(rawPayload.replace(/^JSONString: /, ""))),
  );
  ctx.logger.info("payload", { payload });
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
  const zohoClient = await ZohoApiClient.fromOAuth({
    orgId: zohoApp.orgId,
    client: {
      id: zohoApp.clientId,
      secret: zohoApp.clientSecret,
    },
  }).catch((err) => {
    throw new Error(`Unable to authenticate with zoho: ${err}`);
  });
  const zoho = new Zoho(zohoClient);

  const contact = await zoho.contact.retrieve(payload.salesorder.customer_id);
  if (contact == null) {
    throw new Error(
      `Unable to find zoho contact: ${payload.salesorder.customer_id}`,
    );
  }

  for (const integration of trackingIntegrations) {
    /**
     * Ensure the integration is enabled and payed for
     */
    authorizeIntegration(integration);

    const order = await ctx.prisma.order.upsert({
      where: {
        externalOrderId: payload.salesorder.salesorder_number,
      },
      update: {},
      create: {
        id: id.id("order"),
        externalOrderId: payload.salesorder.salesorder_number,
        emails: payload.salesorder.contact_person_details.map((c) => c.email),
        language: parseLanguage(contact.language_code),
      },
    });

    for (const p of payload.salesorder.packages) {
      const carrier = parseCarrier(p.shipment_order.carrier);

      await ctx.prisma.package.upsert({
        where: {
          trackingId: p.shipment_order.tracking_number,
        },
        update: {},
        create: {
          id: id.id("package"),
          trackingId: p.shipment_order.tracking_number,
          carrier,
          state: PackageState.INIT,
          carrierTrackingUrl: generateTrackingPortalURL(
            carrier,
            "DE",
            p.shipment_order.tracking_number,
          ),
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });
    }
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
