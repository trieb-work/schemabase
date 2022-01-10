FROM node:14
WORKDIR /eci
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . . 



RUN make build-api

CMD ["pnpm","next","start","--port=3000","./services/api"]
