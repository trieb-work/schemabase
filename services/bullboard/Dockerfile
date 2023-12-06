FROM node:18 as build
WORKDIR /eci

RUN npm i -g pnpm@^v8.6.1 

COPY pnpm-lock.yaml ./

RUN pnpm fetch 

COPY . .

RUN pnpm install --offline

RUN pnpm esbuild --platform=node --target=node18 --bundle --outfile=services/bullboard/dist/main.js services/bullboard/src/main.ts	


WORKDIR /eci/services/bullboard/dist

FROM node:18-slim
WORKDIR /eci


COPY --from=build /eci/services/bullboard/dist/* ./
COPY --from=build  /eci/node_modules/.pnpm/bullmq*/node_modules/bullmq/dist/cjs/commands /commands

ENV NODE_ENV=production
ENV ALLOWED_LOGIN_DOMAINS=["trieb.work"]

RUN npm i @bull-board/ui


CMD [ "node", "main.js" ]