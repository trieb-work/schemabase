FROM node:16 as builder
WORKDIR /eci/worker
RUN npm i -g pnpm

ENV NODE_ENV "development"

COPY package.json pnpm-lock.yaml ./


RUN pnpm install -r
COPY . .


RUN pnpm turbo run build --scope=@eci/svc-worker



FROM node:16-alpine
WORKDIR /eci/worker


ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha


COPY --from=builder /eci/worker/dist/main.js ./main.js

CMD ["node", "./main.js"]