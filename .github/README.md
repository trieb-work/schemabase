# Requirements

- [pnpm](https://pnpm.io/) `npm i -g pnpm`

# Components overview

[![](https://mermaid.ink/img/pako:eNp9kctqwzAQRX9FzDr2B3hRKLFX7SIkLd1oM1hjR0QPM5KgJeTfK1sxbdq0WkgX3TMv5gy9VwQNjIzTUby00ol8yv04aVFVYrt_bfNbiZ0PcWQKN-6OvUo9ZfkgnnA4YXHfPJ-I7wLX7EVXtdh6F5IlUWeghP1M8UcHz35UjNrNyJ5Q_YvUs15qdAZD1P23Kb68lb_t4E5sAbr3SOzQLE2iMcuQOeWvAVZvDSgAbMASW9Qqb-A8_0mIR7IkoclS0YDJRAnSXTKaJoWROqWjZ2gGNIE2gCn6w4froYmcaIVajXmh9kpdPgGEYZNz)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNp9kctqwzAQRX9FzDr2B3hRKLFX7SIkLd1oM1hjR0QPM5KgJeTfK1sxbdq0WkgX3TMv5gy9VwQNjIzTUby00ol8yv04aVFVYrt_bfNbiZ0PcWQKN-6OvUo9ZfkgnnA4YXHfPJ-I7wLX7EVXtdh6F5IlUWeghP1M8UcHz35UjNrNyJ5Q_YvUs15qdAZD1P23Kb68lb_t4E5sAbr3SOzQLE2iMcuQOeWvAVZvDSgAbMASW9Qqb-A8_0mIR7IkoclS0YDJRAnSXTKaJoWROqWjZ2gGNIE2gCn6w4froYmcaIVajXmh9kpdPgGEYZNz)

- **Api**: Nextjs hosted on vercel to receive webhooks and run graphql server
- **Logdrain**: Nextjs hosted on k8s to forward logs to elasticsearch
- **Kafka**: Hosted on Upstash
- **Worker**: Nodejs container hosted on k8s, listens to events from kafka and executes integrations.
- **External**: Zoho, Strapi, Saleor etc, we receive webhooks and make http calls to them.
- **Postgres**: Our internal db

# Setup

Run install, codegen and database migration in one command:

1. `make init`

# How do I get the zoho cookies?

1. login in zoho info@trieb.work
2. network tab
3. network request an inventory.zoho.com raussuchen
4. Cookie aus request kopieren ZOHO*COOKIES="BuildCookie*..."
5. X-ZCSRF-TOKEN aus request kopieren: ZOHO_ZCSRF_TOKEN="zomcsparam=4fd4929a3....0bc4233"

# Glossar

## Event

A single message in kafka/bull. An event is produced by a producer in the nextjs api or inside an [event handler](#EventHandler).

## EventHandler

An implementation that receices an event from kafka and performs an action. An action is just a function that you provide to the event handler. Some eventhandlers also publish new events on successful or failed actions.

# Webhooks

All webhooks are inside `services/api/pages/api`. Each webhook has a `README.md` file with further information.

# Graphql API

The graphql api is hosted on the api service under `/api/graphql`. The actual implementation is inside `pkg/api` and currently only allows to read packages by their trackingId. However the boilerplate for authentication and modules is set up and new features can be added quickly.

# Typical Flow of an event triggered by an incoming webhook

[![](https://mermaid.ink/img/pako:eNp1U01v2zAM_SuETg2WYF2LXHwwUGw9FNuwAAHaiy-MRCdCbNGj5LZu0f9eKbYbN8t0MGzzfZBP0qvSbEhlytPflpymHxa3gnXhIK7b50DisII1yaPVtFjMvtys7jJ4os2OeQ-lcA00oHpOrC_yvIfdY2UNBgJJ6j5A6BqCixc2syM4aq7Yh62Qz-AXowF6JOnCzrotbLrR6870lBEbeYuDydS2dyWxZQfWBYqjBMsO0Bnw7cZrsU36MXX_ieUeM1gJm1ZTMnehr1fMDZQsfUPTSloHXhr1gWVPksF3dr6t6RQnpAPIdnNxdXk5h2_L-LhaLmdHQFq9RuzmGMWfQ6cx_JTJ13VgIYhh4mfiJI6xj_8oX4tZoYRuovwb9x9785k1gs_KkjPHD6xCjFZr8v68cT4EzINr1UEzZO3o6TQtqnxMUITlrFqen25Xgv4jMjZ4eFFzVZPUaE0856-pUKiwo5oKFadShkpsq1Cowr1FaNukE3trbAxcZSXGfuYK28DrzmmVBWlpBA13ZUC9vQOqqwfP)](https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNp1U01v2zAM_SuETg2WYF2LXHwwUGw9FNuwAAHaiy-MRCdCbNGj5LZu0f9eKbYbN8t0MGzzfZBP0qvSbEhlytPflpymHxa3gnXhIK7b50DisII1yaPVtFjMvtys7jJ4os2OeQ-lcA00oHpOrC_yvIfdY2UNBgJJ6j5A6BqCixc2syM4aq7Yh62Qz-AXowF6JOnCzrotbLrR6870lBEbeYuDydS2dyWxZQfWBYqjBMsO0Bnw7cZrsU36MXX_ieUeM1gJm1ZTMnehr1fMDZQsfUPTSloHXhr1gWVPksF3dr6t6RQnpAPIdnNxdXk5h2_L-LhaLmdHQFq9RuzmGMWfQ6cx_JTJ13VgIYhh4mfiJI6xj_8oX4tZoYRuovwb9x9785k1gs_KkjPHD6xCjFZr8v68cT4EzINr1UEzZO3o6TQtqnxMUITlrFqen25Xgv4jMjZ4eFFzVZPUaE0856-pUKiwo5oKFadShkpsq1Cowr1FaNukE3trbAxcZSXGfuYK28DrzmmVBWlpBA13ZUC9vQOqqwfP)

# Howto: Adding a new integration.

There are currently two ways integrations are built.

- (Old) separate event handler and integration
- (New) combined

An example of a new integration can be found in `pkg/integration-tracking/src/notifications.ts`
Here the integration implements the `EventHandler` interface and can be plugged directly into a `KafkaConsumer` in the worker.

## Adding a new integration:

### 1. Create a mapping for topic and message type

TODO:

### 2. Create the handler

TODO:

### 3. Create a susbcriber and subscribe the handler.

TODO:

### 4. Create webhook and producer in the api

TODO:

# Debugging Kafka

Go to [http://localhost:8080/ui/clusters/eci/consumer-groups](http://localhost:8080/ui/clusters/eci/consumer-groups) for kafka-ui (started with docker-compose)
