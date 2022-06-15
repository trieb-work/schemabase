FROM node:14 as build
WORKDIR /eci

RUN npm i -g pnpm@^v7.2.1 

COPY pnpm-lock.yaml ./

RUN pnpm fetch 

COPY . .

RUN pnpm install --offline

RUN pnpm esbuild --platform=node --bundle --outfile=services/bullboard/dist/main.js services/bullboard/src/main.ts	


WORKDIR /eci/services/bullboard/dist

FROM node:14-slim
WORKDIR /eci


COPY --from=build /eci/services/bullboard/dist/* ./
COPY --from=build  /eci/node_modules/.pnpm/bullmq*/node_modules/bullmq/dist/cjs/commands /commands

RUN npm i @bull-board/ui


CMD [ "node", "main.js" ]




# FROM node:lts


# WORKDIR /


# COPY package.json yarn.lock ./

# RUN yarn install


# WORKDIR /dwh
# COPY ./dwh/package.json ./dwh/yarn.lock ./
# RUN yarn install



# WORKDIR /bullboard
# COPY ./bullboard/package.json ./bullboard/yarn.lock ./
# RUN yarn install
# WORKDIR /
# COPY . .
# WORKDIR /bullboard

# CMD ["yarn", "ts-node", "./main.ts"]

# RUN yarn esbuild ./pkg/bullboard/main.ts --platform=node --bundle --outdir=./dist/
# # RUN git clone https://github.com/taskforcesh/bullmq.git


# CMD ["node", "dist/main.js"]