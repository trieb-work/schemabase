# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /eci/worker

ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./


RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile
COPY . .


RUN yarn turbo run build --scope=@eci/svc-worker
RUN yarn prisma generate --schema=./pkg/prisma/schema.prisma


CMD ["node", "services/worker/dist/main.js"]
