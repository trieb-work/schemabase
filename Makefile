down:
	docker-compose down --remove-orphans


setup-dev: down
	docker-compose up -d
	docker-compose exec saleor_api python manage.py migrate
	docker-compose exec saleor_api python manage.py populatedb --createsuperuser

	yarn prisma migrate dev --schema=libs/data-access/prisma/schema.prisma
	yarn prisma db seed --preview-feature --schema=libs/data-access/prisma/schema.prisma


start:
	docker-compose up -d

	yarn nx serve webhooks --port=3000

build:
	yarn nx run-many --target=build --all --with-deps
