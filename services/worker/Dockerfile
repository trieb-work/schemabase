FROM node:16-alpine as build
WORKDIR /eci
RUN npm i -g pnpm

COPY . .
RUN pnpm install -r

RUN pnpm build --filter "@eci/svc-worker..."

WORKDIR /eci/services/worker/dist
RUN cp /eci/pkg/prisma/schema.prisma .
RUN cp /eci/node_modules/.prisma/client/*.so.node .


FROM node:16-alpine
WORKDIR /eci
ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

COPY --from=build /eci/services/worker/dist/* ./
CMD [ "node", "./main.js" ]