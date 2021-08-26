FROM node:16
WORKDIR /eci

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn nx build webhooks

ENV DATABASE_URL postgres://postgres:postgres@localhost:5432/postgres
ENV DATABASE_URL_POOL postgres://postgres:postgres@localhost:5432/postgres
EXPOSE 3000

CMD ["yarn", "nx", "run", "webhooks:serve:production", "--port=3000"]
