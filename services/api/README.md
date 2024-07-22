Nextjs application used for incoming webhooks and to be installed as Saleor app. This app can be used to consume any kind of webhook and trigger actions based on the incoming data.
It is connected to the database and the REDIS queue for batch processing.

Env variables needed:

-   DATABASE_URL
-   SECRET_KEY

## Saleor App

schemabase offers different app-types with different permissions and webhooks.
We create a manifest URL per per app-type that can be installed like this:
[YOUR_SALEOR_DASHBOARD_URL]/apps/install?manifestUrl=[YOUR_APP_TUNNEL_MANIFEST_URL]

Adding a tenant id as querystring is optional - like this we can enable the app and connect it
directly with an existing tenant. In the future we want customers to use the App configuration page to manage their schemabase account/tenant and see their sync status etc.
The manifest url looks like this: [ECI_URL]/api/saleor/manifest/[APPTYPE]?tenantId=XXX
apptype can be "entitysync" or "prepayment"

For testing purposes, you can install the Saleor Apps using our cloud hosted service: cloud.schemabase.app

To install the pre-payment payment gateway: https://cloud.schemabase.app/api/saleor/manifest/prepayment

# Webhooks

Webhooks always follow a similar url schema, where the path contains information about what kind of action should run and a single dynamic paramter `webhookId` which is unique for every connected application and can be used to load all required information from the database.

# /api/graphql

The apollo server from `pkg/api` runs here
