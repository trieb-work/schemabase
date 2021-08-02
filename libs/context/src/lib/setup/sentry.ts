import { ExtendContextFn } from "../context"
import * as s from "@sentry/node"
import { ContextMissingFieldError } from "@eci/util/errors"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { env } from "@eci/util/env"

export type Sentry = {
  /**
   * Wrap a Nextjs api route with error reporting capabilities
   */
  withSentry(h: NextApiHandler): NextApiHandler
}
/**
 * Initialize a sentry client and make it public to the context
 *
 * This will only work in production
 */
export const setupSentry = (): ExtendContextFn<"sentry"> => async (ctx) => {
  if (!ctx.logger) {
    throw new ContextMissingFieldError("logger")
  }

  let sentry: Sentry
  if (env.isProduction()) {
    sentry = {
      withSentry: (handler: NextApiHandler) => {
        s.init({ dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"], environment: process.env["APM_ENV"] })

        return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
          try {
            return handler(req, res)
          } catch (err) {
            s.captureEvent(err)
            // TODO: apm flush? see #3
            await Promise.all([s.flush(2000)])
            return err
          }
        }
      },
    }
  } else {
      /**
       * Do nothing in non production environments
       */
    sentry = {
      withSentry: (handler: NextApiHandler) => handler
    }
  }
  ctx.sentry = sentry

  return ctx
}
