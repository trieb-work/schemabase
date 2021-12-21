FROM node:16-alpine as build
WORKDIR /eci

RUN apk add make
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install 
COPY . .

RUN pnpm build
RUN make build-worker



WORKDIR /eci/services/worker/dist
RUN cp /eci/pkg/prisma/schema.prisma .
RUN cp /eci/node_modules/.prisma/client/*.so.node .


FROM node:16-alpine
WORKDIR /eci
ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

COPY --from=build /eci/services/worker/dist/* .

CMD [ "node", "main.js" ]