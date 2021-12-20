# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /eci/worker
RUN npm i -g pnpm

ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

COPY package.json pnpm-lock.yaml ./


RUN pnpm install -r
COPY . .


RUN pnpm turbo run build --scope=@eci/svc-worker
# RUN pnpm --dir=pkg/prisma prisma generate --schema=./pkg/prisma/schema.prisma


CMD ["node", "services/worker/dist/main.js"]
