# syntax=docker/dockerfile:1
# Quick and dirty way of running a containerized instance.
# This is intended only for integration tests in the CI or locally.

FROM node:16-alpine
WORKDIR /eci
ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile

COPY . .
RUN yarn turbo run build --scope=@eci/svc-webhooks
RUN npx prisma generate --schema=./pkg/prisma/schema.prisma

EXPOSE 3000

CMD ["yarn", "--cwd=services/webhooks", "start", "--port=3000"]
