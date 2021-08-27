# Location of prisma schema file
prismaSchema := libs/data-access/prisma/schema.prisma


down:
	docker-compose --env-file=.env.compose down --remove-orphans --volumes

destroy: down
	docker system prune -af

# Pull development environment variables from vercel
# Copy over database connections for prisma
pull-env:
	cd apps/webhooks && npx vercel env pull && mv .env .env.local
	cp apps/webhooks/.env.local libs/data-access/prisma/.env


# Build and seeds all required external services
init: down
	@echo "SALEOR_VERSION=3.0-triebwork7" >> .env.compose

	docker-compose --env-file=.env.compose pull
	docker-compose --env-file=.env.compose build

	docker-compose --env-file=.env.compose up -d
	docker-compose --env-file=.env.compose exec -T saleor_api python manage.py migrate

	@# An admin user is created with the following credentials:
	@# email: admin@example.com
	@# password: admin
	docker-compose --env-file=.env.compose exec -T saleor_api python manage.py populatedb --createsuperuser


up:
	docker-compose --env-file=.env.compose up -d

build:
	yarn nx run-many --target=build --all --with-deps


# Run all unit tests
test:
	yarn nx run-many --target=test --all


# Run integration tests
#
# Make sure you have called `make init` before to setup all required services
# You just need to do this once, not for every new test run.
test-e2e: export ECI_BASE_URL=http://localhost:3000
test-e2e: export SALEOR_TEMPORARY_APP_TOKEN = "token"
test-e2e: up db-push db-seed
	yarn nx run e2e:e2e


# DO NOT RUN THIS YOURSELF!
#
# Build the webhooks application on vercel
# Setup on vercel:
#  Build Command: `make build-webhooks-prod`
#  Output Directory: `dist/apps/webhooks/.next`
build-webhooks-prod:
	yarn nx build webhooks --prod
	yarn prisma migrate deploy --schema=${prismaSchema}


tsc:
	yarn tsc -p tsconfig.base.json --pretty


lint:
	yarn nx workspace-lint
	yarn nx run-many --all --target=lint

format:
	yarn prettier --write --loglevel=warn .


fmt: lint format


db-seed:
	yarn prisma db seed --preview-feature --schema=${prismaSchema}
db-migrate:
	yarn prisma migrate dev --schema=${prismaSchema}
db-studio:
	yarn prisma studio --schema=${prismaSchema}
db-push:
	yarn prisma db push --schema=${prismaSchema} --skip-generate
