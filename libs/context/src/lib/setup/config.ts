import { ExtendContextFn } from "../context"

import { env } from "@eci/util/env"

export type ServiceConfig = {
  redis: {
    host: string
    password: string
    port: number
  }
  oauth: {
    google: {
      clientId: string
      clientSecret: string
    }
  }
  elasticSearch: {
    apmServer: string
    apmSecretToken: string
    loggingServer: string
  }
}

/**
 * Fetch the client's configuration and expose it to the context
 */
export const setupConfig = (): ExtendContextFn<"serviceConfig"> => async (ctx) => {
  const serviceConfig: ServiceConfig = {
    redis: {
      host: env.require("REDIS_HOST"),
      password: env.require("REDIS_PASSWORD"),
      port: parseInt(env.require("REDIS_PORT"), 10),
    },
    oauth: {
      google: {
        clientId: env.require("GOOGLE_OAUTH_CLIENT_ID"),
        clientSecret: env.require("GOOGLE_OAUTH_CLIENT_SECRET"),
      },
    },
    elasticSearch: {
      apmServer: env.require("ELASTIC_APM_SERVER"),
      apmSecretToken: env.require("ELASTIC_APM_SECRET_TOKEN"),
      loggingServer: env.require("ELASTIC_LOGGING_SERVER"),
    },
  }
  ctx.serviceConfig = serviceConfig
  return ctx
}
