FROM node:18
WORKDIR /eci

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

RUN npm i -g pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . . 



RUN make build-api

CMD ["pnpm","next","start","--port=3000","./services/api"]
