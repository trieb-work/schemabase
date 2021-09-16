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

=======


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