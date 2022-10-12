import {
    authorizeIntegration,
    extendContext,
    setupPrisma,
  } from "@eci/pkg/webhook-context";
  import { z } from "zod";
  import { HttpError } from "@eci/pkg/errors";
  import { handleWebhook, Webhook } from "@eci/pkg/http";
  import { env } from "@eci/pkg/env";
  import {
    EventSchemaRegistry,
    KafkaProducer,
    Message,
    Signer,
    Topic,
  } from "@eci/pkg/events";
  import { PackageState } from "@eci/pkg/prisma";
  
  const parseState = (state: string): PackageState | null => {
    switch (state) {
      case "start_order":
        return PackageState.INIT;
  
      case "in_transit":
        return PackageState.IN_TRANSIT;
  
      case "pickup_depot":
        return PackageState.IN_TRANSIT;
  
      case "delivery_depot":
        return PackageState.IN_TRANSIT;
  
      case "out_for_delivery":
        return PackageState.OUT_FOR_DELIVERY;
  
      case "delivery_nab":
        return PackageState.FAILED_ATTEMPT;
  
      case "delivery_notification":
        return null;
  
      case "delivered":
        return PackageState.DELIVERED;
  
      case "available_for_pickup":
        return PackageState.AVAILABLE_FOR_PICKUP;
  
      case "error":
        return PackageState.EXCEPTION;
  
      case "failure":
        return PackageState.EXCEPTION;
  
      default:
        return null;
    }
  };
  





const eventObject = z.object({
    id: z.string(),
    object: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    description: z.string(),
    mode: z.enum(["test", "production"]),
    previous_attributes: z.any(),
    result: z.object({
      id: z.string(),
      object: z.string(),
      created_at: z.date(),
      updated_at: z.date(),
      tracking_code: z.string(),
      status: z.enum(["unknown", "pre_transit", "in_transit", "out_for_delivery", "delivered", "available_for_pickup", "return_to_sender", "failure", "cancelled", "error"]),
      carrier: z.string(),
      public_url: z.string(),
      tracking_details: z.any()
    })

})

const requestValidation = z.object({
    query: z.object({
      webhookId: z.string(),
    }),
    body: eventObject
  });
  
  const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
    backgroundContext,
    req,
    res,
  }): Promise<void> => {

    const {
      query: {
        webhookId,
      },
      body: {
        result,
      }
    } = req;

    const trackingId = req.body.result.tracking_code;
  
    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());
  
    ctx.logger.info(`Incoming webhook from EasyPost. WebhookId: ${webhookId}. Tracking number: ${trackingId}`);
  
  
    const webhook = await ctx.prisma.incomingWebhook.findUnique({
      where: { id: webhookId },
      include: {
        easyPostApp: {
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
    if (webhook == null) {
      throw new HttpError(404, `Webhook not found: ${webhookId}`);
    }
  
    const { easyPostApp } = webhook;
    if (easyPostApp == null) {
      throw new HttpError(400, "dpd app is not configured");
    }
    const { integration } = easyPostApp;
    if (integration == null) {
      throw new HttpError(400, "Integration is not configured");
    }
    /**
     * Ensure the integration is enabled and payed for
     */
    authorizeIntegration(integration);
  
  
  
    const state = parseState(result.status);

    if (!state) {
      ctx.logger.error(`Could not parse EasyPost state to our internal package state. Easypost: ${result.status}. Failing`)
      throw new HttpError(400, `State not parsable: ${result.status}`);
    }

    const packageEvent: EventSchemaRegistry.PackageUpdate["message"] = {
      trackingId,
      time: result.created_at.getTime() / 1000,
      location: "",
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

    res.status(200)

  };
  
  export default handleWebhook({
    webhook,
    validation: {
      http: { allowedMethods: ["POST"] },
      request: requestValidation,
    },
  });
  