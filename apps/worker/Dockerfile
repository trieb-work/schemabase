# syntax=docker/dockerfile:1
# FROM node:16-alpine as builder
# WORKDIR /eci/worker

# COPY package.json yarn.lock ./
# ENV YARN_CACHE_FOLDER /root/.yarn
# RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile

# RUN --mount=type=cache,target=/root/.yarn yarn add -D esbuild

# COPY . .

# RUN yarn nx build data-access-prisma

# RUN yarn esbuild ./apps/worker/src/main.ts \
#   --bundle \
#   --platform=node \
#   --target=node16 \
#   --outfile=./dist/apps/worker/main.js


# FROM node:16
# WORKDIR /eci/worker

# COPY --from=builder /eci/worker/dist/apps/worker/main.js .

# # Bull requires some lua scritpts internally but esbuild does not handle them at all
# # So we copy them over ourselves and everyone is happy.
# COPY --from=builder /eci/worker/node_modules/bullmq/dist/commands/*.lua ./
# COPY --from=builder /eci/worker/node_modules/.prisma ./node_modules/
# COPY --from=builder /eci/worker/node_modules/@prisma ./node_modules/

# CMD ["node", "main.js"]


FROM node
WORKDIR /eci/worker
ENV YARN_CACHE_FOLDER /root/.yarn

COPY package.json yarn.lock ./


RUN --mount=type=cache,target=/root/.yarn yarn --frozen-lockfile
COPY . .


RUN --mount=type=cache,target=.nx yarn nx build worker --with-deps --skip-nx-cache
CMD ["node", "dist/apps/worker/main.js"]
