import {
  setupPrisma,
  extendContext,
  authorizeIntegration,
} from "@eci/pkg/webhook-context";
import { z } from "zod";
import { HttpError } from "@eci/pkg/errors";
import { handleWebhook, Webhook } from "@eci/pkg/http";
import { env } from "@eci/pkg/env";
import {
  Signer,
  KafkaProducer,
  Message,
  EventSchemaRegistry,
  Topic,
} from "@eci/pkg/events";
import { PackageState } from "@eci/pkg/prisma";

const parseState = (state: string): PackageState | null => {
  switch (state) {
    case "start_order":
      return PackageState.INIT;

    case "pickup_driver":
      return PackageState.IN_TRANSIT;

    case "pickup_depot":
      return PackageState.IN_TRANSIT;

    case "delivery_depot":
      return PackageState.IN_TRANSIT;

    case "delivery_carload":
      return PackageState.OUT_FOR_DELIVERY;

    case "delivery_nab":
      return PackageState.FAILED_ATTEMPT;

    case "delivery_notification":
      return null;

    case "delivery_customer":
      return PackageState.DELIVERED;

    case "delivery_shop":
      return PackageState.AVAILABLE_FOR_PICKUP;

    case "error_pickup":
      return PackageState.EXCEPTION;

    case "error_return":
      return PackageState.EXCEPTION;

    default:
      throw new Error(`Unexpected state: ${state}`);
  }
};

const requestValidation = z.object({
  connection: z
    .object({
      remoteAddress: z.string().optional(),
    })
    .optional(),
  query: z.object({
    webhookId: z.string(),
    pushid: z.string().optional(),
    pnr: z.string(),
    depot: z.string(),
    status: z.enum([
      // Die Auftragsdaten wurden erfasst
      "start_order",
      // Das Paket wurde vom Fahrer abgeholt
      "pickup_driver",
      // Das Paket ist im Eingangsdepot angekommen
      "pickup_depot",
      // Das Paket ist im Ausgangsdepot angekommen
      "delivery_depot",
      // Das Paket ist auf Zustelltour
      "delivery_carload",
      // Es wurde ein NAB-Scan ausgelöst
      "delivery_nab",
      // Es wurde ein Zustellhindernis ausgelöst z.B. Adressklärung
      "delivery_notification",
      // Das Paket wurde an den Kunden zugestellt
      "delivery_customer",
      // Paketzustellung im DPD Shop
      "delivery_shop",
      // Problem bei der Abholung
      "error_pickup",
      // System-Retoure zurück an den Versender
      "error_return",
    ]),
    statusdate: z.string(),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  const {
    query: {
      webhookId,
      depot,
      pushid: pushId,
      pnr: trackingId,
      status,
      statusdate,
    },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  ctx.logger.info("Incoming webhook from dpd");

  if (!pushId) {
    return;
  }

  if (env.require("ECI_ENV") === "production") {
    if (req.connection?.remoteAddress !== "213.95.42.108") {
      throw new Error(
        `DPD webhooks must come from ip "213.95.42.108", got ${req.connection?.remoteAddress} instead`,
      );
    }
  }

  const webhook = await ctx.prisma.incomingDPDWebhook.findUnique({
    where: { id: webhookId },
    include: {
      dpdApp: {
        include: {
          integration: {
            include: {
              trackingEmailApp: true,
              subscription: true,
            },
          },
        },
      },
    },
  });
  if (!webhook) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { dpdApp } = webhook;
  if (!dpdApp) {
    throw new HttpError(400, "dpd app is not configured");
  }
  const { integration } = dpdApp;
  if (!integration) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  const time = new Date(
    `${statusdate.slice(4, 8)}-${statusdate.slice(2, 4)}-${statusdate.slice(
      0,
      2,
    )}T${statusdate.slice(8, 10)}:${statusdate.slice(
      10,
      12,
    )}:${statusdate.slice(12, 14)}.000+01:00`,
  );

  ctx.logger.info("package update", {
    pushId,
    trackingId,
    status,
    time,
  });

  const state = parseState(status);
  if (!state) {
    ctx.logger.warn(`State ${status} should not be acted on.`);
    res.setHeader("Content-Type", "application/xml");
    return res.send(
      `<push><pushid>${pushId}</pushid><status>OK</status></push>`,
    );
  }
  ctx.logger.info("Time", { time });
  const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
    trackingId,
    time: time.getTime() / 1000,
    location: depot,
    state,
    trackingIntegrationId: integration.id,
  };

  const kafka = await KafkaProducer.new<
    EventSchemaRegistry.PackageUpdate["message"]
  >({
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
  });

  const message = new Message({
    header: {
      traceId: ctx.trace.id,
    },
    content: packageEvent,
  });

  const { messageId } = await kafka.produce(Topic.PACKAGE_UPDATE, message);

  ctx.logger.info("Queued new event", { messageId });

  res.setHeader("Content-Type", "application/xml");
  res.send(`<push><pushid>${pushId}</pushid><status>OK</status></push>`);
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
