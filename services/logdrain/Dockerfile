# Install dependencies only when needed
FROM node:18 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /eci
RUN npm i -g pnpm@^v8.6.1 
COPY pnpm-lock.yaml ./
RUN pnpm fetch 


# Rebuild the source code only when needed
FROM node:18 AS builder
RUN npm i -g pnpm


WORKDIR /eci
COPY --from=deps /eci/node_modules ./node_modules
COPY . .

RUN make build-logdrain

RUN pnpm prisma generate
RUN pnpm prune --prod
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN /usr/local/bin/node-prune

FROM node:18 AS runner
WORKDIR /eci

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /eci/services/logdrain/next.config.js ./
COPY --from=builder /eci/services/logdrain/.next ./.next


COPY --from=builder /eci/node_modules ./node_modules


USER nextjs


ENV PORT 3000
EXPOSE ${PORT}

CMD ["node_modules/.bin/next", "start"]