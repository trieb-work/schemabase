# Location of prisma schema file
prismaSchema := libs/data-access/prisma/schema.prisma

export COMPOSE_DOCKER_CLI_BUILD=1


down:
	docker-compose down --remove-orphans --volumes

destroy: down
	docker system prune -af

# Pull development environment variables from vercel
# Copy over database connections for prisma
pull-env:
	cd apps/webhooks && npx vercel env pull && mv .env .env.local
	cp apps/webhooks/.env.local .env.local


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


	yarn prisma db push --schema=${prismaSchema}

build:
	yarn install

	yarn nx run-many --target=build --all --with-deps


# Run all unit tests
test: build
	yarn nx run-many --target=test --all



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
test-e2e: export ECI_BASE_URL                 = http://localhost:3000
test-e2e: export ECI_BASE_URL_FROM_CONTAINER  = http://webhooks.eci:3000
test-e2e: export SALEOR_URL                   = http://localhost:8000/graphql/
test-e2e: export SALEOR_URL_FROM_CONTAINER    = http://saleor.eci:8000/graphql/
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


