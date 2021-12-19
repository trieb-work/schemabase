
FROM node:16
WORKDIR /eci
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .
RUN pnpm turbo run build --scope=@eci/svc-webhooks


WORKDIR /eci/services/webhooks
ENV VERCEL_TOKEN ""
EXPOSE 3000
CMD pnpm vercel dev --listen=3000 --token=${VERCEL_TOKEN}
