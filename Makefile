
export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_DOCKER_BUILDKIT=1


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


init: down build
	@# Migrating saleor is expensiev and should be done
	@# before all memory is used for the other services
	docker-compose up -d saleor_api
	$(MAKE) migrate-saleor

	docker-compose up -d

	$(MAKE) db-push


init-core: down build
	docker-compose up -d --build eci_api eci_worker kafka-ui kafka zookeeper
	$(MAKE) db-push

build: install
	pnpm prisma generate
	pnpm graphql-codegen -c pkg/api/codegen.yml
	
build-api: build
	pnpm next build ./services/api

build-worker: build
	pnpm esbuild --platform=node --bundle --outfile=services/worker/dist/main.js services/worker/src/main.ts




rebuild-api:
	docker-compose stop eci_api
	docker-compose up -d eci_db
	docker-compose build eci_api
	docker-compose up -d eci_api

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
test: export ECI_BASE_URL_FROM_CONTAINER  = http://api.eci:3000
test: export SALEOR_URL                   = http://localhost:8000/graphql/
test: export SALEOR_URL_FROM_CONTAINER    = http://saleor.eci:8000/graphql/
test: build db-push
	pnpm test

# DO NOT RUN THIS YOURSELF!
#
# Build the api application on vercel
# Setup on vercel:
#  Build Command: `make build-api-prod`
#  Output Directory: `dist/apps/api/.next`
build-api-prod:
	pnpm build:prisma
	pnpm generate
	pnpm build:api
	pnpm prisma migrate deploy

install:
	pnpm install

db-migrate:
	npx prisma migrate dev

db-push:
	npx prisma db push


tsc: 
	pnpm tsc --pretty

format:
	pnpm prettier --write .

check: build tsc format