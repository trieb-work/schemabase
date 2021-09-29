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


migrate-saleor:
	docker-compose exec saleor_api python manage.py migrate
	docker-compose exec \
	-e DJANGO_SUPERUSER_PASSWORD=admin \
	saleor_api \
	python manage.py createsuperuser \
	--email admin@example.com \
	--noinput

# Build and seeds all required external services
init: down build



	docker-compose pull
	docker-compose up -d

	$(MAKE) migrate-saleor

	yarn prisma db push --schema=${prismaSchema} --skip-generate

	@# Upload now so we can pull them later during development
	docker-compose push saleor_api || true
	docker-compose push saleor_dashboard || true

build: update-saleor-schema
	yarn install

	yarn nx run-many --target=build --all --with-deps

update-saleor-schema:
  curl "https://raw.githubusercontent.com/mirumee/saleor/master/saleor/graphql/schema.graphql" > libs/adapters/saleor/src/lib/schema.gql


# Run all unit tests
test: build
	yarn nx run-many --target=test --all


reset: down
	docker-compose build
	$(MAKE) init

# Run integration tests
#
# Make sure you have called `make init` before to setup all required services
# You just need to do this once, not for every new test run.
test-e2e: export ECI_BASE_URL                 = http://localhost:3000
test-e2e: export ECI_BASE_URL_FROM_CONTAINER  = http://webhooks.eci:3000
test-e2e: export SALEOR_URL                   = http://localhost:8000/graphql/
test-e2e: export SALEOR_URL_FROM_CONTAINER    = http://saleor.eci:8000/graphql/
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


