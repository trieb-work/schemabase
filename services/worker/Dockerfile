FROM node:lts as build
WORKDIR /eci

# RUN apk add make
RUN npm i -g pnpm
# RUN apt update
# RUN apt install openssl

COPY package.json pnpm-lock.yaml ./

# The schema.prisma file must be available when running `pnpm install`. Otherwise the prisma binary will not be downloaded
COPY ./pkg/prisma/* ./pkg/prisma/
RUN pnpm install
COPY . .
RUN make build-worker

RUN pnpm prisma generate


WORKDIR /eci/services/worker/dist
RUN cp /eci/node_modules/.pnpm/@prisma+client@*_prisma@*/node_modules/.prisma/client/* .


FROM node:lts
WORKDIR /eci
ARG commit_sha
ENV GIT_COMMIT_SHA=$commit_sha

COPY --from=build /eci/services/worker/dist/* ./
COPY --from=build /eci/node_modules/winston-elasticsearch/index-template-mapping.json .


CMD [ "node", "main.js" ]