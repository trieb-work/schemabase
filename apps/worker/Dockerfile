# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /eci/worker

ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./


RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile
COPY . .


RUN --mount=type=cache,target=.nx yarn nx build worker --with-deps
RUN yarn prisma generate --schema=./libs/data-access/prisma/schema.prisma


CMD ["node", "dist/apps/worker/main.js"]
