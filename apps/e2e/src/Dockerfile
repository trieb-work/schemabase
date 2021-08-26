FROM node:16
WORKDIR /eci

COPY package.json yarn.lock ./
RUN yarn install 

COPY . .
RUN yarn nx build webhooks

EXPOSE 3000

CMD ["yarn", "nx", "run", "webhooks:serve:production", "--port=3000"]
