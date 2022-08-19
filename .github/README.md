<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents**

- [Requirements](#requirements)
- [Components overview](#components-overview)
- [Setup](#setup)
  - [Develop a single service (Example api)](#develop-a-single-service-example-api)
- [How do I get the zoho cookies?](#how-do-i-get-the-zoho-cookies)
- [Glossary](#glossary)
  - [Event](#event)
  - [Topic](#topic)
  - [Producer](#producer)
  - [Consumer / Subscriber](#consumer--subscriber)
  - [Integration / EventHandler](#integration--eventhandler)
- [Webhooks](#webhooks)
  - [Synchronous api](#synchronous-api)
  - [Async webhooks.](#async-webhooks)
- [Graphql API](#graphql-api)
- [Typical Flow of an event triggered by an incoming webhook](#typical-flow-of-an-event-triggered-by-an-incoming-webhook)
- [Howto: Adding a new integration](#howto-adding-a-new-integration)
  - [Adding a new integration:](#adding-a-new-integration)
    - [1. Create a mapping for topic and message type](#1-create-a-mapping-for-topic-and-message-type)
    - [2. Create the handler/integration](#2-create-the-handlerintegration)
    - [3. Create a susbscriber and subscribe the handler.](#3-create-a-susbscriber-and-subscribe-the-handler)
    - [4. Create webhook and producer in the api](#4-create-webhook-and-producer-in-the-api)
- [Database](#database)
  - [Tenants, Integrations, Apps](#tenants-integrations-apps)
  - [Other tables](#other-tables)
    - [Tracking](#tracking)
- [Debugging Kafka](#debugging-kafka)
- [Integration tests](#integration-tests)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Requirements

- [pnpm](https://pnpm.io/) `npm i -g pnpm`
- docker
- docker-compose
- better internet :'(

# Components overview

[![](https://mermaid.ink/img/pako:eNp9kctqwzAQRX9FzDr2B3hRKLFX7SIkLd1oM1hjR0QPM5KgJeTfK1sxbdq0WkgX3TMv5gy9VwQNjIzTUby00ol8yv04aVFVYrt_bfNbiZ0PcWQKN-6OvUo9ZfkgnnA4YXHfPJ-I7wLX7EVXtdh6F5IlUWeghP1M8UcHz35UjNrNyJ5Q_YvUs15qdAZD1P23Kb68lb_t4E5sAbr3SOzQLE2iMcuQOeWvAVZvDSgAbMASW9Qqb-A8_0mIR7IkoclS0YDJRAnSXTKaJoWROqWjZ2gGNIE2gCn6w4froYmcaIVajXmh9kpdPgGEYZNz)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNp9kctqwzAQRX9FzDr2B3hRKLFX7SIkLd1oM1hjR0QPM5KgJeTfK1sxbdq0WkgX3TMv5gy9VwQNjIzTUby00ol8yv04aVFVYrt_bfNbiZ0PcWQKN-6OvUo9ZfkgnnA4YXHfPJ-I7wLX7EVXtdh6F5IlUWeghP1M8UcHz35UjNrNyJ5Q_YvUs15qdAZD1P23Kb68lb_t4E5sAbr3SOzQLE2iMcuQOeWvAVZvDSgAbMASW9Qqb-A8_0mIR7IkoclS0YDJRAnSXTKaJoWROqWjZ2gGNIE2gCn6w4froYmcaIVajXmh9kpdPgGEYZNz)

- **Api**: Nextjs hosted on vercel to receive webhooks and run graphql server
- **Logdrain**: Nextjs hosted on k8s to forward logs to elasticsearch
- **Kafka**: Hosted on Upstash
- **Worker**: Nodejs container hosted on k8s, listens to events from kafka and executes integrations.
- **External**: Zoho, Strapi, Saleor etc, we receive webhooks and make http calls to them.
- **Postgres**: Our internal db in k8s

# Setup

Run install, codegen and database migration in one command:

1. `make init`
2. Get a cup of coffee while everything starts

## Develop a single service (Example api)

1. `make init` Start a complete environment
2. `docker compose stop eci_api`
3. `npx dotenv-cli pnpm next dev ./services/api`
4. Do stuff
5. Once you are ready, you can run your full test suite:
   5.1 `make rebuild-api`
   5.2 `make test`

# How do I get the zoho cookies?

1. login in zoho info@trieb.work
2. network tab
3. network request an inventory.zoho.com raussuchen
4. Cookie aus request kopieren `ZOHO_COOKIES="..."`
5. X-ZCSRF-TOKEN aus request kopieren: `ZOHO_ZCSRF_TOKEN="zomcsparam=4fd4929a3....0bc4233"`

# Glossary

## Event

A single message in kafka/bull. An event is produced by a producer in the nextjs api or inside an `EventHandler`'s `onSuccess` function.

## Topic

Events are organized and durably stored in topics. Very simplified, a topic is similar to a folder in a filesystem, and the events are the files in that folder. An example topic name could be "payments". Topics in Kafka are always multi-producer and multi-subscriber: a topic can have zero, one, or many producers that write events to it, as well as zero, one, or many consumers that subscribe to these events. Events in a topic can be read as often as needed—unlike traditional messaging systems, events are not deleted after consumption.

In bull this would be a queue name.

## Producer

A kafka producer is a wrapper around a kafka client that can create new messages and add them to a topic.

In bull this would be the `Queue` class.

## Consumer / Subscriber

Consumer and subscriber are the same thing. In Kafka terms you would call this a consumer, but redis based queues usually call it a subscription. Either way a consumer is listening on a certain topic and calling a given handler function for every new message.

In bull this would be the `Worker` class.

## Integration / EventHandler

In the beginning there were only synchronisations, and we called them `integrations`. An integration was basically a function that could be called in response to a new message from a queue.

Now we have a little bit more logic for receiving the message and handling errors and we're merging the receiving of a message with the actual business logic, and we're calling this an EventHandler.

An event handler has to offer a single function that receives an event and can do with that whatever it wants, a callback for successful work is provided to allow different eventHandlers to be chained together via kafka.

Think of a `Workflow` in anwr dwh.

# Webhooks

All webhooks are inside `services/api/pages/api`. Each webhook has a `README.md` file with further information.

## Synchronous api

The api offers a few synchronous resources such as the product datafeed. Here we simply make a request to the db and a 3rd party system and return the data.

## Async webhooks.

Most endpoinst are only meant to receive an event from a 3rd party, validate the request body, load necessary data from the database and allow/disallow an action depending on whether the tenant has payed for a specific integration.

If all goes well, the api handler simply produces an event to a specific topic and returns `200 OK` to the caller. At this point we have the event in our system and we can retry as many times as we need.

- **Cylinder** shaped elements are Kafka topics / bull queues.
- **Rounded** are api routes inside nextjs.
- **Rectangular** are EventHandlers running on the worker

[![](https://mermaid.ink/img/pako:eNqVVU1vozAQ_SsWJyI1RXvNYSUWvLuoKUFADl0SIYKdBCWxkTGt2qr_fW0MCV9t0hwiMzN-8948bN61lCKszbQdS_I9mPsrAsRP_dueDaZT8II3e0oPYvkTJHlmoBzpkSFXebLDRbV6_mFwlqSHjOxkfj1RCHW5RMkZRWWKK5Qw9kzrwfwD46VnmyFUxYFAyLOxjkWVGTRVYaOuNlKGE44FlaZ7a--QQRD6pufE0A39p9jy4ZnG7bva5P_RPe1RlzhvIjzgLYMGZQizIecmP2y98G3o1z0jvf00Wau9o6IifSQ4WU_vQUpJUZ4wuBfwavaQcPZqVZTalrTCklbwSlKwKY-HSgLgFNSEvwfTVfdrOX9QmoIn14J2pPcjjcpG61fzAD15C8l0mSPRmqn97UgjilGSveEC8D0GBL-Asz60qVheR_ncsdhaPHpzKF-XUbMaHSPBoZzWPFXzwZhV-Ha3rsJ87VbXme7hjvTu81COJy4OcTjgMyb8b0LQsRnvSEJyqd-hXGUBlmmQkcam78KN30xBKF0TbriBEzoL9-LbZxV9WVZZcHrCzKU822YNiX608ggTBEo1a3xKsqO0Ka0LK163Y3XVuIvQ-e1YpuQXw0fTmceBeLci_ZOEPGTXdF4M7WcuF9Etl9Xo8egWn8OTtXanCaViOEh8rd4lxkoTB_WEV9pMLBHeJuWRr7QV-RClapgQZZwybbZNjgW-05KSU3kctBlnJW6K7CwRH79TXfXxH-tDQdc)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqVVU1vozAQ_SsWJyI1RXvNYSUWvLuoKUFADl0SIYKdBCWxkTGt2qr_fW0MCV9t0hwiMzN-8948bN61lCKszbQdS_I9mPsrAsRP_dueDaZT8II3e0oPYvkTJHlmoBzpkSFXebLDRbV6_mFwlqSHjOxkfj1RCHW5RMkZRWWKK5Qw9kzrwfwD46VnmyFUxYFAyLOxjkWVGTRVYaOuNlKGE44FlaZ7a--QQRD6pufE0A39p9jy4ZnG7bva5P_RPe1RlzhvIjzgLYMGZQizIecmP2y98G3o1z0jvf00Wau9o6IifSQ4WU_vQUpJUZ4wuBfwavaQcPZqVZTalrTCklbwSlKwKY-HSgLgFNSEvwfTVfdrOX9QmoIn14J2pPcjjcpG61fzAD15C8l0mSPRmqn97UgjilGSveEC8D0GBL-Asz60qVheR_ncsdhaPHpzKF-XUbMaHSPBoZzWPFXzwZhV-Ha3rsJ87VbXme7hjvTu81COJy4OcTjgMyb8b0LQsRnvSEJyqd-hXGUBlmmQkcam78KN30xBKF0TbriBEzoL9-LbZxV9WVZZcHrCzKU822YNiX608ggTBEo1a3xKsqO0Ka0LK163Y3XVuIvQ-e1YpuQXw0fTmceBeLci_ZOEPGTXdF4M7WcuF9Etl9Xo8egWn8OTtXanCaViOEh8rd4lxkoTB_WEV9pMLBHeJuWRr7QV-RClapgQZZwybbZNjgW-05KSU3kctBlnJW6K7CwRH79TXfXxH-tDQdc)

# Graphql API

The graphql api is hosted on the api service under `/api/graphql`. The actual implementation is inside `pkg/api` and currently only allows to read packages by their trackingId. However the boilerplate for authentication and modules is set up and new features can be added quickly.

# Typical Flow of an event triggered by an incoming webhook

[![](https://mermaid.ink/img/pako:eNp1U01v2zAM_SuETg2WYF2LXHwwUGw9FNuwAAHaiy-MRCdCbNGj5LZu0f9eKbYbN8t0MGzzfZBP0qvSbEhlytPflpymHxa3gnXhIK7b50DisII1yaPVtFjMvtys7jJ4os2OeQ-lcA00oHpOrC_yvIfdY2UNBgJJ6j5A6BqCixc2syM4aq7Yh62Qz-AXowF6JOnCzrotbLrR6870lBEbeYuDydS2dyWxZQfWBYqjBMsO0Bnw7cZrsU36MXX_ieUeM1gJm1ZTMnehr1fMDZQsfUPTSloHXhr1gWVPksF3dr6t6RQnpAPIdnNxdXk5h2_L-LhaLmdHQFq9RuzmGMWfQ6cx_JTJ13VgIYhh4mfiJI6xj_8oX4tZoYRuovwb9x9785k1gs_KkjPHD6xCjFZr8v68cT4EzINr1UEzZO3o6TQtqnxMUITlrFqen25Xgv4jMjZ4eFFzVZPUaE0856-pUKiwo5oKFadShkpsq1Cowr1FaNukE3trbAxcZSXGfuYK28DrzmmVBWlpBA13ZUC9vQOqqwfP)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNp1U01v2zAM_SuETg2WYF2LXHwwUGw9FNuwAAHaiy-MRCdCbNGj5LZu0f9eKbYbN8t0MGzzfZBP0qvSbEhlytPflpymHxa3gnXhIK7b50DisII1yaPVtFjMvtys7jJ4os2OeQ-lcA00oHpOrC_yvIfdY2UNBgJJ6j5A6BqCixc2syM4aq7Yh62Qz-AXowF6JOnCzrotbLrR6870lBEbeYuDydS2dyWxZQfWBYqjBMsO0Bnw7cZrsU36MXX_ieUeM1gJm1ZTMnehr1fMDZQsfUPTSloHXhr1gWVPksF3dr6t6RQnpAPIdnNxdXk5h2_L-LhaLmdHQFq9RuzmGMWfQ6cx_JTJ13VgIYhh4mfiJI6xj_8oX4tZoYRuovwb9x9785k1gs_KkjPHD6xCjFZr8v68cT4EzINr1UEzZO3o6TQtqnxMUITlrFqen25Xgv4jMjZ4eFFzVZPUaE0856-pUKiwo5oKFadShkpsq1Cowr1FaNukE3trbAxcZSXGfuYK28DrzmmVBWlpBA13ZUC9vQOqqwfP)

# Howto: Adding a new integration

There are currently two ways integrations are built.

- (Old) separate event handler and integration
- (New) combined

An example of a new integration can be found in `pkg/integration-tracking/src/notifications.ts`
Here the integration implements the `EventHandler` interface and can be plugged directly into a `KafkaConsumer` in the worker.

## Adding a new integration:

### 1. Create a mapping for topic and message type

1. Go to `/pkg/events/src/registry.ts` and extend the Topic enum at the top of the file.
2. Scroll down and copy one of the `export type XXX = EventSchema<` segments to add your new message type.

### 2. Create the handler/integration

Create a new integration in `pkg/`. The `CustomerNotifier` can be a good starting point and I suggest copying that. (`pkg/integration-tracking/src/notifications.ts`).
The important part is that your new integration must implement the `EventHandler` interface (`/pkg/events/src/handler.ts`)

EventHandlers usually have a `onSuccess` function provided to them in the constructor. I used this to produce a new event to a different topic to be handled by a different event handler. You could add this directly into the eventHandler but that would require setting up a kafka producer and you would need to know about the topic inside your business logic.

By providing an `onSuccess` function to the constructor we can remove the routing logic from the business logic and handle all of it in a central `main.ts` file (think of `sourceIndex` and `destIndex` in anwr dwh)

```ts
// service/worker/src/main.ts

new tracking.CustomerNotifier({
  onSuccess: publishSuccess(producer, Topic.NOTIFICATION_EMAIL_SENT),
  // remaining config
});
```

As you can see, we're using a helper function `publishSuccess` that will receive the return value of our `CustomerNotifier` (in this case the email address) and publish it to the `NOTIFICATION_EMAIL_SENT` topic. Almost all of the routing logic, which event will trigger which integration and what gets published to different topics is contained in a single file. The only implicit producer is part of the `KafkaConsumer` class and will produce a new event to the `UNHANDLED_EXCEPTION` topic in case of unhandled exceptions in your integration code. In bullmq this would be done implicitly by bull itself.

### 3. Create a susbscriber and subscribe the handler.

Now that you have created an eventHandler, you need to hook it up to receive events.

In `services/worker/src/main.ts` create a new subscriber and event handler instance like this:

Replace `PackageStateTransition` and `Topic.PACKAGE_STATE_TRANSITION` with your previously created names from step 1.

Use any unique value as `groupId` and simply ignore it. it's not needed once you switch kafka for bullmq.

```ts
const customerNotifierSubscriber = await KafkaSubscriber.new<
  EventSchemaRegistry.PackageStateTransition["message"]
>({
  topic: Topic.PACKAGE_STATE_TRANSITION,
  signer,
  logger,
  groupId: "customerNotifierSubscriber",
});
```

After creating the subscriber, you can add the eventHandler like this:

```ts
customerNotifierSubscriber.subscribe(
  new tracking.CustomerNotifier({
    db: prisma,
    onSuccess: publishSuccess(producer, Topic.NOTIFICATION_EMAIL_SENT),
    logger,
    emailTemplateSender: new Sendgrid(env.require("SENDGRID_API_KEY"), {
      logger,
    }),
  }),
);
```

That's it, now the worker will start handling the new events.
If you already have a producer for this topic (existing webhook or eventHandler, that produces on success), you can stop here.

Next up is producing the events from a webhook.

### 4. Create webhook and producer in the api

1. Create a new api route in `services/api/v1/my/path/[webhookId]/index.ts`

```ts [services/api/v1/my/path/[webhookId]/index.ts]
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

const requestValidation = z.object({
  query: z.object({
    webhookId: z.string(),
  }),
  body: z.object({
    someField: z.string(),
  }),
});

const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  /**
   *  If this function gets executed the request has already been validated by zod.
   * So you are safe to destructure the `req` object without validating
   */
  const {
    query: { webhookId },
    body: { someField },
  } = req;

  const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

  /**
   * load the necessary data from the database by joining tables, starting at the webhook.
   */
  const webhook = await ctx.prisma.incomingWebhook.findUnique({
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
  /**
   * Verify we have all required data
   */
  if (webhook == null) {
    throw new HttpError(404, `Webhook not found: ${webhookId}`);
  }

  const { dpdApp } = webhook;
  if (dpdApp == null) {
    throw new HttpError(400, "dpd app is not configured");
  }
  const { integration } = dpdApp;
  if (integration == null) {
    throw new HttpError(400, "Integration is not configured");
  }
  /**
   * Ensure the integration is enabled and payed for
   */
  authorizeIntegration(integration);

  ctx.logger.info("The user has something to say", {
    someField,
  });

  const event: EventSchemaRegistry.MadeUpname["message"] = {
    someField,
    dpdAppId: dpdApp.id,
  };

  const kafka = await KafkaProducer.new<
    EventSchemaRegistry.MadeUpName["message"]
  >({
    signer: new Signer({ signingKey: env.require("SIGNING_KEY") }),
  });

  const message = new Message({
    header: {
      traceId: ctx.trace.id,
    },
    content: event,
  });

  const { messageId } = await kafka.produce(Topic.MADE_UP_NAME, message);

  ctx.logger.info("Queued new event", { messageId });
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
```

# Database

## Connect

We are using a PlanetScale hosted database. Ig you want to connect to a database with prisma etc. you can use the pscale CLI:

```
pscale connect eci main
```

Just make sure, that the following variable is set correctly in your .env:

```
DATABASE_URL="mysql://localhost:3306/eci"
```

## Tenants, Integrations, Apps

Our own database is setup in a modular way, there are 2 important types of entities: Apps and Integrations.
If we could do inheritance this would be what I would build:
**!!!This diagram is not complete! It does not include every table in order to simplify the illustration and explain my thoughts!!!**

[![](https://mermaid.ink/img/pako:eNqVVMFuwyAM_RXEcWqj9YqqSpu2Q8_ZNGniQoPboCYQEUda1fXfR0OSQksrLSfz_OxnHoQjLYwEymhRibZ9U2JnRc0118R9PUY-QAuNHvExI0qeOT3mSS9N4xnLpdi0aEWBq9UFdQHxVZcV9r3WAcap5pTM5y5YuGAUDofJXetGTX2npav67fUYgR_XWbbXBN-zb_7kgi_YlMbsr1mMZFkWS36b0kyCw-Ke3Jh-JDZyElJrjeAOAJXRCTdvsgEQuBujscthzo_20O3XrtobK8HeSKcy3pQAuDInWTO4cDfP6XOWLcJBgyP9T9l0NPF96jZtYVVz2VmInF3VSBpxAPmpUVVJyrSBCL9jb4I3jTmMHJkdDhtdo2FBxp_xhpZDYQEjsocYcVdK6R0pRVsm8gnzJmWu6YzWYGuhpHs1judyTrGEGjhlLpSwFV2FnHJ9ctSukQLhXSo0lrKtqFqYUdGhyQ-6oAxtByNpeHwG1ukPGN15-Q)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqVVMFuwyAM_RXEcWqj9YqqSpu2Q8_ZNGniQoPboCYQEUda1fXfR0OSQksrLSfz_OxnHoQjLYwEymhRibZ9U2JnRc0118R9PUY-QAuNHvExI0qeOT3mSS9N4xnLpdi0aEWBq9UFdQHxVZcV9r3WAcap5pTM5y5YuGAUDofJXetGTX2npav67fUYgR_XWbbXBN-zb_7kgi_YlMbsr1mMZFkWS36b0kyCw-Ke3Jh-JDZyElJrjeAOAJXRCTdvsgEQuBujscthzo_20O3XrtobK8HeSKcy3pQAuDInWTO4cDfP6XOWLcJBgyP9T9l0NPF96jZtYVVz2VmInF3VSBpxAPmpUVVJyrSBCL9jb4I3jTmMHJkdDhtdo2FBxp_xhpZDYQEjsocYcVdK6R0pRVsm8gnzJmWu6YzWYGuhpHs1judyTrGEGjhlLpSwFV2FnHJ9ctSukQLhXSo0lrKtqFqYUdGhyQ-6oAxtByNpeHwG1ukPGN15-Q)

- **Tenant** A single customer of ours (Pfeffer und Frost)
- **App** A single application configuration. Here we store connection details and other config for a 3rd party system. The idea is that a customer can add these App configs using our UI (at some point) or add them automatically via one-click installations. Afterwards they can connect these apps via `integrations`
- **Integration** The connection of 1..n applications and a tenant. (The bulkorder integration connects a strapi app with a zoho app)
- **Subscription** Every integration can have a subscription attached, that can hold information such billing periods and usage tracking for usage based pricing.
- **Webhook** Every app can have 0..n webhooks attached. This gives us a unique identifier for incoming webhooks and allows us to load the attached `app`, its `integration` and other connected `apps` as well as `subscription` state. Allowing multiple webhooks per app also makes it possible for customers to replace webhooks (and their secret) without downtime.
- **WebhookSecret** We require an authorization header to be present with every incoming request and match its hash against a hash stored in the db.
  This is a separate table because in the past we had separate webhooks tables for each app. Right now there's nothing stopping us from adding a `secret` column to the `webhooks` table and remove the `webhooksSecret` table.

As mentioned above, inheritance is not possible in prisma, so we have to manually duplicate columns in different `XXXApp` and `XXXIntegration` tables, but the mental model should be, that all integrations behave similar and have relations to a tenant, a subscription and one or more apps. In practice this results in a few optional relations here and there that prisma requires and actually creates on its own using `prisma format`

## Other tables

### Tracking

For the tracking integration we added more tables to store data for later use. In the future there will be more tables to have different mapping tables etc.

Specifically for tracking we added 4 new tables:
Some fields are omitted, just check `pkg/prisma/schema.prisma`
[![](https://mermaid.ink/img/pako:eNqFkjFvwyAQhf8KurFKrGZl6RLPrZSMLCe4uKgYV3CuVEX57wVDq7hGLQO6e3z3EE9cQU-GQIJ2GOPR4hBwVF55kdaiiedgKBRhKaXouq70a_AF9RsOVKTaCAUPCsR-n4pDKu7MKlHtGkb9B3lesYvy27J17QJKETlYPwhrWodHZBJsRxKivGWL1O7EGY15_-OWkWLML25bVchNGtlOvomkvR_ROnEO6CPqDKJbpKd1QlugnG71FNJj1x0agd3Fux3bZNdCfhL814VyBzsYKaTKpP92zTMK-JXSOMhUGrrg7FiB8reEzu8m2ffG8hRAXtBF2gHOPJ0-vQbJYaZvqH7bSt2-AJPe7xo)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNqFkjFvwyAQhf8KurFKrGZl6RLPrZSMLCe4uKgYV3CuVEX57wVDq7hGLQO6e3z3EE9cQU-GQIJ2GOPR4hBwVF55kdaiiedgKBRhKaXouq70a_AF9RsOVKTaCAUPCsR-n4pDKu7MKlHtGkb9B3lesYvy27J17QJKETlYPwhrWodHZBJsRxKivGWL1O7EGY15_-OWkWLML25bVchNGtlOvomkvR_ROnEO6CPqDKJbpKd1QlugnG71FNJj1x0agd3Fux3bZNdCfhL814VyBzsYKaTKpP92zTMK-JXSOMhUGrrg7FiB8reEzu8m2ffG8hRAXtBF2gHOPJ0-vQbJYaZvqH7bSt2-AJPe7xo)

# Debugging Kafka

Go to [http://localhost:8080/ui/clusters/eci/consumer-groups](http://localhost:8080/ui/clusters/eci/consumer-groups) for kafka-ui (started with docker-compose)

# Integration tests

Tests are in `/e2e` and are loosely grouped by domain.
To execute tests, run `make test` (after `make init`)
They usually follow the same process:

1. Seed database for test
2. Run test
3. Remove test data from 3rd party systems (especially zoho)

# Unit tests

## Helpful DB commands

Connect to the testing DB (or create a new testing DB for yourself)

```
pscale connect eci testing
```

Reset the DB and seed it with mandatory test data

```
pnpm prisma migrate reset
```

Run specific tests in a folder and not all

```
pnpm jest pkg/integration-zoho-entities/src
```
