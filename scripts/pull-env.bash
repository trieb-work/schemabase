#!bin/bash

root="$(pwd)"

cd apps/webhooks && npx vercel env pull && mv .env .env.local
cd $root

# Copy over database connections for prisma
cp apps/webhooks/.env.local libs/data-access/prisma/.env
