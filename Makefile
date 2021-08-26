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
init: down
	docker-compose pull
	docker-compose build

	docker-compose up -d
	docker-compose exec saleor_api python manage.py migrate
	docker-compose exec saleor_api python manage.py populatedb --createsuperuser


# Start all services for local development or testing
start: export DATABASE_URL = postgres://postgres:postgres@localhost:5432/postgres
start: export SALEOR_TEMPORARY_APP_TOKEN = "token"
start:
	docker-compose up -d

	yarn prisma migrate dev --schema=$(prismaSchema) --skip-generate
	yarn prisma db seed --preview-feature --schema=$(prismaSchema)


build:
	yarn nx run-many --target=build --all --with-deps


test:
	yarn nx run-many --target=test --all

test-e2e: export ECI_BASE_URL=http://localhost:3000
test-e2e: start
	yarn nx test e2e


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
	yarn prisma db push --schema=${prismaSchema
