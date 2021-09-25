FROM node:16-alpine as builder
WORKDIR /eci/worker

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
RUN yarn add -D esbuild

COPY . .

RUN yarn esbuild ./apps/worker/src/main.ts \
  --bundle \
  --platform=node \
  --target=node16 \
  --outfile=./dist/apps/worker/main.js


FROM node:16-alpine
WORKDIR /eci/worker

COPY --from=builder /eci/worker/dist/apps/worker/main.js .

# Bull requires some lua scritpts internally but esbuild does not handle them at all
# So we copy them over ourselves and everyone is happy.
COPY --from=builder /eci/worker/node_modules/bullmq/dist/commands/*.lua ./

CMD ["node", "main.js"]
