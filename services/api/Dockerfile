FROM node:20
WORKDIR /eci

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
ARG DOCKER=true

RUN npm i -g pnpm@^v8.15.1

COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . . 



RUN make build-api

CMD ["pnpm","next","start","--port=3000","./services/api"]
