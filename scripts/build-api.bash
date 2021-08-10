#!/bin/bash

# This will run in the vercel build step


# 1. Build the nextjs app as usual
npx nx build api --prod --outputPath=.

# 2. Migrate the database
npx prisma migrate deploy --schema=libs/data-access/prisma/schema.prisma