# syntax=docker/dockerfile:1
FROM node:16 as build


WORKDIR /queue


ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./


RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile
COPY . .


RUN --mount=type=cache,target=.build yarn esbuild ./apps/queue-manager/src/main.ts --platform=node --bundle --outdir=./dist/
RUN git clone https://github.com/taskforcesh/bullmq.git


FROM node:16-alpine

WORKDIR /app


ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha
ENV YARN_CACHE_FOLDER /root/.yarn


COPY --from=build /queue/dist ./dist
COPY --from=build /queue/bullmq/src/commands ./commands
COPY --from=build /queue/package.json .
COPY --from=build /queue/yarn.lock .
RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile

ENV PORT 9000
EXPOSE $PORT

CMD ["node", "dist/main.js"]
