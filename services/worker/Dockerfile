FROM node:18 as build
WORKDIR /eci

RUN npm i -g pnpm@^v8.6.1

COPY pnpm-lock.yaml ./

# The schema.prisma file must be available when running `pnpm install`. Otherwise the prisma binary will not be downloaded
COPY ./pkg/prisma/* ./pkg/prisma/
RUN pnpm fetch --prod
COPY . .
RUN make build-worker

RUN pnpm prisma generate


WORKDIR /eci/services/worker/dist
RUN cp -r /eci/node_modules/.pnpm/@prisma+client@*_prisma@*/node_modules/.prisma/client/* .

FROM node:18
WORKDIR /eci
ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha
ENV NODE_ENV=production

COPY --from=build /eci/services/worker/dist/* ./
COPY --from=build /eci/node_modules/winston-elasticsearch/index-template-mapping.json .
COPY --from=build  /eci/node_modules/.pnpm/bullmq*/node_modules/bullmq/dist/cjs/commands /commands
COPY --from=build  /eci/node_modules/.pnpm/i18n-iso-countries*/node_modules/i18n-iso-countries/langs langs
COPY --from=build  /eci/node_modules/.pnpm/jsdom*/node_modules/jsdom/lib/jsdom/living/xhr/xhr-sync-worker.js xhr-sync-worker.js


CMD [ "node", "main.js" ]