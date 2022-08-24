FROM node:14 as build
WORKDIR /eci

RUN npm i -g pnpm@^v7.2.1 

COPY pnpm-lock.yaml ./

RUN pnpm fetch 

COPY . .

RUN pnpm install --offline

RUN pnpm esbuild --platform=node --target=node14 --bundle --outfile=services/bullboard/dist/main.js services/bullboard/src/main.ts	


WORKDIR /eci/services/bullboard/dist

FROM node:14-slim
WORKDIR /eci


COPY --from=build /eci/services/bullboard/dist/* ./
COPY --from=build  /eci/node_modules/.pnpm/bullmq*/node_modules/bullmq/dist/cjs/commands /commands

RUN npm i @bull-board/ui


CMD [ "node", "main.js" ]