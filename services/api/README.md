Nextjs application used to incoming webhooks and syncronous requests.

Initially I though appending the version at the end was a good idea because you could version them individually, however that disallows renaming the path for a new version, so I think starting with `/api/vX/.../[webhookId]/index.ts` is best.

# Webhooks

Webhooks always follow a similar url schema, where the path contains information about what kind of action should run and a single dynamic paramter `webhookId` which is unique for every connected application and can be used to load all required information from the database.

# /api/graphql

The apollo server from `pkg/api` runs here
