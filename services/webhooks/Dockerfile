FROM node:16
WORKDIR /eci
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . . 



RUN make build-webhooks

CMD ["pnpm","next","start","--port=3000","./services/webhooks"]
