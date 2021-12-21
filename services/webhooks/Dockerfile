FROM node:16-alpine as build
WORKDIR /eci
RUN npm i -g pnpm

COPY . .
RUN pnpm install -r



RUN pnpm build --filter "@eci/svc-webhooks..."

WORKDIR /eci/services/webhooks
# RUN cp /eci/pkg/prisma/schema.prisma ./dist
# RUN cp -r /eci/services/webhooks/.vercel ./dist/
# RUN cp /eci/node_modules/.prisma/client/*.so.node .



CMD ["pnpm", "start"]
