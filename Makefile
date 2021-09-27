# Location of prisma schema file
prismaSchema := libs/data-access/prisma/schema.prisma


down:
	docker-compose down --remove-orphans --volumes

destroy: down
	docker system prune -af

# Pull development environment variables from vercel
# Copy over database connections for prisma
pull-env:
	cd apps/webhooks && npx vercel env pull && mv .env .env.local
	cp apps/webhooks/.env.local libs/data-access/prisma/.env


# Build and seeds all required external services
init: export SALEOR_VERSION=3.0-triebwork11
init: down

	docker-compose up -d
	docker-compose exec saleor_api python manage.py migrate

	@# An admin user is created with the following credentials:
	@# email: admin@example.com
	@# password: admin
	docker-compose exec saleor_api python manage.py populatedb --createsuperuser

	yarn prisma db push --schema=${prismaSchema} --skip-generate
	yarn prisma db seed --preview-feature --schema=${prismaSchema}

	@# Upload now so we can pull them later during development
	docker-compose push saleor_api
	docker-compose push saleor_dashboard


up:
	docker-compose down
	docker-compose up -d --build

build:
	yarn install
	yarn nx run-many --target=build --all --with-deps


# Run all unit tests
test: build
	yarn nx run-many --target=test --all


reset: export SALEOR_GRAPHQL_ENDPOINT    = http://localhost:8000/graphql/
reset: export SALEOR_TEMPORARY_APP_TOKEN = token
reset:
	# Rebuild eci and ensure everything is up
	docker-compose build eci_worker
	docker-compose build eci_webhooks
	docker-compose up -d

	# Reset and seed the eci database for every test run
	docker-compose  restart eci_db
	yarn prisma db push --schema=${prismaSchema} --skip-generate
	yarn prisma db seed --preview-feature --schema=${prismaSchema}

# Run integration tests
#
# Make sure you have called `make init` before to setup all required services
# You just need to do this once, not for every new test run.
# test-e2e: export SALEOR_VERSION             = 3.0-triebwork11
test-e2e: export SALEOR_GRAPHQL_ENDPOINT    = http://localhost:8000/graphql/
# test-e2e: export SALEOR_TEMPORARY_APP_TOKEN = token
test-e2e:
	yarn nx run-many --target=e2e --all --skip-nx-cache

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

install:
	yarn install

lint:
	yarn nx workspace-lint
	yarn nx run-many --all --target=lint

format:
	yarn prettier --write --loglevel=warn .
	yarn prisma format --schema=${prismaSchema}


fmt: lint format


db-seed:
	yarn prisma db seed --preview-feature --schema=${prismaSchema}
db-migrate:
	yarn prisma migrate dev --schema=${prismaSchema}
db-studio:
	yarn prisma studio --schema=${prismaSchema}
db-push:
	yarn prisma db push --schema=${prismaSchema} --skip-generate
