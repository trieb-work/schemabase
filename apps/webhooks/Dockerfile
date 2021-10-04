# syntax=docker/dockerfile:1
# Quick and dirty way of running a containerized instance.
# This is intended only for integration tests in the CI or locally.

FROM node:16-alpine
WORKDIR /eci
ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./
RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile

COPY . .
RUN --mount=type=cache,target=/root/.yarn yarn nx build webhooks --prod

EXPOSE 3000

CMD ["yarn", "nx", "run", "webhooks:serve:production", "--port=3000"]
