
export COMPOSE_DOCKER_CLI_BUILD=1


down:
	docker-compose down --remove-orphans --volumes

destroy: down
	docker system prune -af

# Pull development environment variables from vercel
# Copy over database connections for prisma
pull-env:
	npx vercel env pull && mv .env .env.local

migrate-saleor:
	docker-compose exec -T saleor_api python manage.py migrate
	docker-compose exec -T \
	-e DJANGO_SUPERUSER_PASSWORD=admin \
	saleor_api \
	python manage.py createsuperuser \
	--email admin@example.com \
	--noinput

# Build and seeds all required external services

init: export COMPOSE_DOCKER_CLI_BUILD=1
init: export DOCKER_BUILDKIT=1
init: down build



	docker-compose pull

	@# Migrating saleor is expensiev and should be done
	@# before all memory is used for the other services
	docker-compose up -d saleor_api
	$(MAKE) migrate-saleor

	docker-compose up -d


init-core: export COMPOSE_DOCKER_CLI_BUILD=1
init-core: export DOCKER_BUILDKIT=1
init-core: down build
	docker-compose up -d eci_webhooks eci_worker kafka kafka-ui

build:
	pnpm install

	pnpm turbo run build


# Run all unit tests
test: build
	pnpm turbo run test



rebuild-webhooks: export COMPOSE_DOCKER_CLI_BUILD=1
rebuild-webhooks: export DOCKER_BUILDKIT=1
rebuild-webhooks: build db-migrate
	docker-compose stop eci_webhooks
	docker-compose up -d eci_db
	docker-compose build eci_webhooks
	docker-compose up -d eci_webhooks

rebuild-worker: export COMPOSE_DOCKER_CLI_BUILD=1
rebuild-worker: export DOCKER_BUILDKIT=1
rebuild-worker:
	docker-compose stop eci_worker
	docker-compose up -d eci_db
	docker-compose build eci_worker
	docker-compose up -d eci_worker


# Run integration tests
#
# Make sure you have called `make init` before to setup all required services
# You just need to do this once, not for every new test run.
test: export ECI_BASE_URL                 = http://localhost:3000
test: export ECI_BASE_URL_FROM_CONTAINER  = http://webhooks.eci:3000
test: export SALEOR_URL                   = http://localhost:8000/graphql/
test: export SALEOR_URL_FROM_CONTAINER    = http://saleor.eci:8000/graphql/
test: build
	pnpm turbo run test

# DO NOT RUN THIS YOURSELF!
#
# Build the webhooks application on vercel
# Setup on vercel:
#  Build Command: `make build-webhooks-prod`
#  Output Directory: `dist/apps/webhooks/.next`
build-webhooks-prod:
	pnpm turbo run build
	pnpm prisma migrate deploy --schema=${prismaSchema}


tsc:
	pnpm turbo run tsc --pretty

install:
	pnpm install

lint:
	pnpm turbo run lint

format:
	pnpm prettier --write --loglevel=warn .
	pnpm --dir=pkg/prisma prisma db push --schema=${prismaSchema}


fmt: lint format


db-migrate:
	npx prisma migrate dev --schema=pkg/prisma/schema.prisma
db-studio:
	npx prisma db studio --schema=pkg/prisma/schema.prisma
db-push:
	npx prisma db push --schema=pkg/prisma/schema.prisma


