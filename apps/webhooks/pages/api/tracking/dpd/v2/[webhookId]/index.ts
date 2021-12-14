import { setupPrisma, extendContext, authorizeIntegration } from "@eci/context";
import { z } from "zod";
import { HttpError } from "@eci/util/errors";
import { handleWebhook, Webhook } from "@eci/http";
import { env } from "@chronark/env";
import * as tracking from "@eci/events/tracking";
import { Signer } from "@eci/events/client";
import { PackageState } from "@eci/data-access/prisma";

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
    statusdate: z.string().transform((raw) => {
      const iso = `${raw.slice(4, 8)}-${raw.slice(2, 4)}-${raw.slice(
        0,
        2,
      )}T${raw.slice(8, 10)}:${raw.slice(10, 12)}:${raw.slice(
        12,
        14,
      )}.000+01:00`;
      return new Date(iso);
    }),
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
      statusdate: time,
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

  const queue = new tracking.Producer({
    logger: ctx.logger,
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
    connection: {
      host: env.require("REDIS_HOST"),
      port: env.require("REDIS_PORT"),
      password: env.get("REDIS_PASSWORD"),
    },
  });

  const packageEvent: tracking.PackageEvent = {
    trackingId: pushId,
    time: Date.toString(),
    location: depot,
    state,
  };

  const jobId = await queue.produce({
    topic: tracking.Topic.PACKAGE_UPDATE,
    payload: packageEvent,
  });
  ctx.logger.info("Queued new event", { jobId });

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
