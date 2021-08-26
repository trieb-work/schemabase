FROM node:16
WORKDIR /eci
ENV NODE_ENV production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn nx build webhooks

EXPOSE 3000

CMD ["yarn", "nx", "run", "webhooks:serve:production", "--port=3000"]
