
FROM node:16-alpine as builder
WORKDIR /eci/worker

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn nx build worker --prod

FROM node:16-alpine
WORKDIR /eci/worker
COPY --from=builder /eci/worker/dist/apps/worker .

CMD ["node", "main.js"]
