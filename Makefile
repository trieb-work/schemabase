# Not necessary if your docker daemon already sets these but they don't hurt either
export COMPOSE_DOCKER_CLI_BUILD=1
export COMPOSE_DOCKER_BUILDKIT=1


###############################################################################
#
# WHY IS THIS LIKE IT IS??!?!??
# 
# Many commands are simple one liners that don't safe a lot of time to use...
# The reason they are aliased by a make command is that we want to use them as
# dependencies for other commands. For example the `build` command will always
# run `install` before actually starting the build.
#
###############################################################################


# Installs all dependencies
install: NODE_ENV=development
install:
	pnpm install


# Create a new migration file after you have made changes to the `schema.prisma`.
# These changes must later be deployed to your target db in prod (this will happen
# during build on vercel)
db-migrate:
	npx prisma migrate dev

# Manually push the current schema on a db, without any migration. Use this in dev
# for faster prototyping. It's quite likely that you will lose your db content.
db-push:
	npx prisma db push


tsc: 
	pnpm tsc --pretty

# Formatted code = happy devs
fmt:
	pnpm eslint --ext .js,.ts,.tsx --ignore-path=.gitignore --fix .
	pnpm prettier --write .

# Static error checking 
check: build tsc fmt

# Alias for docker-compose down
down:
	docker-compose down --remove-orphans --volumes

# CAUTION!! THIS WILL DELETE ABSOLUTE EVERYTHING DOCKER RELATED ON YOUR MACHINE.
# images, volumes, containers, EVERYTHING! 
# You have been warned. ¯\_(ツ)_/¯ 
destroy: down
	docker system prune -af

# Pull development environment variables from vercel
# Copy over database connections for prisma
pull-env:
	npx vercel env pull

# Apply migrations to the saleor db and create the admin user.
# The saleor container as well as its db must be running.
migrate-saleor:
	docker-compose exec -T saleor_api python manage.py migrate
	docker-compose exec -T \
	-e DJANGO_SUPERUSER_PASSWORD=admin \
	saleor_api \
	python manage.py createsuperuser \
	--email admin@example.com \
	--noinput

# Setup everything you need for development.
# Installs dependencies, generates code, builds artifacts, starts containers and migrates/seeds the dbs
init: down build
	@# Migrating saleor is expensiev and should be done
	@# before all memory is used for the other services
	docker-compose up -d saleor_api
	$(MAKE) migrate-saleor

	docker-compose up -d

	$(MAKE) db-push

# Similar to `init` but only rebuilds our own services (Useful to speed up development but feel free to delete this)
init-core: down build
	docker-compose up -d --build eci_api eci_worker logdrain
	$(MAKE) db-push

# Runs all codegens
build: install
	pnpm prisma generate
	pnpm graphql-codegen -c pkg/api/codegen.yml
	
# Builds the api service
build-api: build
	pnpm next build ./services/api

# Builds the logdrain service
build-logdrain: build
	pnpm next build ./services/logdrain

# Builds the worker service
build-worker: build
	pnpm esbuild --platform=node --bundle --outfile=services/worker/dist/main.js services/worker/src/main.ts
	
# Utility to stop, rebuild and restart the api in docker 
rebuild-api:
	docker-compose stop eci_api
	docker-compose up -d eci_db
	docker-compose build eci_api
	docker-compose up -d eci_api



# Utility to stop, rebuild and restart the worker in docker 
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
	pnpm jest

# DO NOT RUN THIS YOURSELF!
#
# Build the api application on vercel
# Setup on vercel:
#  Build Command: `make build-api-prod`
#  Output Directory: `dist/apps/api/.next`
build-api-prod: build
	pnpm next build ./services/api
	pnpm prisma migrate deploy

build-logdrain-prod: build
	pnpm next build ./services/logdrain
