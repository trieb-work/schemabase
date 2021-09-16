import { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { Logger } from "@eci/util/logger";
import { v4 as uuid } from "uuid";
import { env } from "@chronark/env";
import { HttpError } from "@eci/util/errors";
import { Context } from "@eci/context";
import { ECI_TRACE_HEADER } from "@eci/constants";
import { z } from "zod";

export type Webhook<TRequest> = (config: {
  backgroundContext: Context;
  req: TRequest;
  res: NextApiResponse;
}) => Promise<void>;

export type HTTPMethod = "POST" | "GET" | "PUT" | "DELETE";

export type HandleWebhookConfig<TRequest> = {
  /**
   * The actual request handling logic.
   */
  webhook: Webhook<TRequest>;

  validation: {
    /**
     * General validation about the http request
     */
    http?: {
      /**
       * Only allow these methods. A 405 status will be returned otherwise
       */
      allowedMethods: HTTPMethod[];
    };
    /**
     * Validation to ensure a certain task has all requried data from the request.
     * For instance specific headers or json payload.
     */
    request: z.AnyZodObject;
  };
};

/**
 * Provides the webhook with a logger and handles thrown errors gracefully.
 *
 * This will end the request automatically. Do not call `res.end()` yourself!
 * Simply finish your handler with `res.send()` or `res.json()` if you need to
 * return something.
 */
export function handleWebhook<TRequest>({
  webhook,
  validation,
}: HandleWebhookConfig<TRequest>): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    /**
     * A unique id for this request. This is useful for searching the logs.
     */
    const traceId = (req.headers[ECI_TRACE_HEADER] as string) ?? uuid();
    res.setHeader(ECI_TRACE_HEADER, traceId);

    const logger = new Logger({
      traceId,
      enableElastic: env.get("NODE_ENV") === "production",
      webhookId: req.url,
    });

    try {
      /**
       * Perform http validation
       */
      if (validation.http) {
        if (
          !validation.http.allowedMethods.includes(req.method as HTTPMethod)
        ) {
          res.setHeader("Allow", validation.http.allowedMethods.join(", "));
          throw new HttpError(405, `${req.method} is not allowed`);
        }
      }

      /**
       * Perform request validation
       */

      const parsedRequest = (await validation.request
        .parseAsync(req)
        .catch((err) => {
          throw new HttpError(400, err.message);
        })) as TRequest;

      const backgroundContext: Context = {
        trace: { id: traceId },
        logger,
      };

      /**
       * Run the actual webhook logic
       */

      await webhook({ backgroundContext, req: parsedRequest, res });

      /**
       * Handle errors gracefully
       */
    } catch (err) {
      logger.error(err.message);

      res.json({
        error: err instanceof HttpError ? err.statusCode : 500,
        traceId,
      });
    } finally {
      await logger.flush();
      res.end();
    }
  };
}
