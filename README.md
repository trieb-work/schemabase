# Get started

## Setup environment

In order to get the required environment variables please run `make get-env`.
If you are not logged into vercel, or don't want to pull them automatically you need to create and populate the following files:

```
cp apps/webhooks/.env.example apps/webhooks/.env.local
cp libs/data-access/prisma/.env.example libs/data-access/prisma/.env
```

The `VERCEL_...` variables can be left empty

## Database

You need a postgresql database for development. Either create one or run `make init` Which sets up a complete development stack including 3rd party services.

Then run `make db-push` to apply the schema.

## Code generation

Run `make build` to run all code generations

## Development

Run `yarn nx serve webhooks --port=xxxx` to run the nextjs app in development mode.
You might want to stop the webhooks container (created by `make init`) if the ports collide.

# Get started

## Setup environment

In order to get the required environment variables please run `make get-env`.
If you are not logged into vercel, or don't want to pull them automatically you need to create and populate the following files:

```
cp apps/webhooks/.env.example apps/webhooks/.env.local
cp libs/data-access/prisma/.env.example libs/data-access/prisma/.env
```

The `VERCEL_...` variables can be left empty

## Database

You need a postgresql database for development. Either create one or run `make init` Which sets up a complete development stack including 3rd party services.

Then run `make db-push` to apply the schema.

## Code generation

Run `make build` to run all code generations

## Development

Run `yarn nx serve webhooks --port=xxxx` to run the nextjs app in development mode.
You might want to stop the webhooks container (created by `make init`) if the ports collide.

## Prisma

Run `make db-studio` to run prisma studio

# Endpoints

All endpoints are designated with a specific version. Versions vary per endpoint and are not global.

# Worker

The worker is a nodejs application running in k8s. Its job is to process batches for work
that would take too long to handle in a single nextjs api route.

## Deployment

For every PR a new docker image is pushed to the github registry and removed after the pr is merged. There is an edge case where an image could remain in the registry when the branch is closed while a new image is currently being built and pushed.

# System design

## Entities

### Tenant

A tenant represents a single eci customer. A company that pays us money to use our integrations. (P&F would be a tenant)

### Apps

Apps are only configuration connections to our services. For instance the strapi instance from P&F will be a `StrapiApp`.
Each app can have multiple incoming webhooks configured as well as required data about the app itself.

### Integrations

Integrations are the connection between tenants and apps.
Example:
A tenant has subscribed to the strapi->zoho integration. In this case the integration links 1 strapiApp with 1 zohoApp and 1 tenant.
Integrations also carry information about current payment status and can be disabled manually by the user.

### Webhooks

Most integrations work by receiving webhooks. Each app can have multiple incoming webhooks to allow rerolling secrets without downtime.

## Local development

A complete development environment with all services can be started with docker-compose.
Run `make init` to build and start all containers.

The makefile also sets some required environment variables but not all.

Run `make pull-env` to pull development environment variables from vercel after you
you have authenticated youself with `npx vercel login`
