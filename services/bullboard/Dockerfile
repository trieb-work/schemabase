FROM node:14 as build
WORKDIR /eci

RUN npm i -g pnpm@^v7.2.1 

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod
COPY . .
RUN make build-bullboard

RUN pnpm prisma generate


WORKDIR /eci/services/bullboard/dist

FROM node:14-slim
WORKDIR /eci


COPY --from=build /eci/services/bullboard/dist/* ./
COPY --from=build  /eci/node_modules/.pnpm/bullmq*/node_modules/bullmq/dist/cjs/commands /commands


CMD [ "node", "main.js" ]