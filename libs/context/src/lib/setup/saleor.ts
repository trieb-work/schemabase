import { ContextMissingFieldError } from "@eci/util/errors";
import { SaleorClient, createSaleorClient } from "@eci/adapters/saleor/api";
import { Context } from "@eci/context";
import { env } from "@chronark/env";

/**
 * Create a new saleor client for the given domain
 */
export const newSaleorClient = (
  ctx: Context,
  /**
   * The domain of the graphql server, with or without protocol.
   * `/graphql/` will be appended automatically to the url
   * @example
   *  `http://localhost:3000`
   */
  host: string,
  token?: string,
): SaleorClient => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma");
  }
  ctx.logger = ctx.logger.with({ saleorHost: host });
  /**
   * Add a protocol if none is provided
   */
  if (!host.startsWith("http")) {
    const eciEnv = env.require("ECI_ENV");
    const protocol =
      eciEnv === "production" || eciEnv === "preview" ? "https" : "http";
    host = `${protocol}://${host}`;
  }
  return createSaleorClient({
    traceId: ctx.trace.id,
    graphqlEndpoint: `${host}/graphql/`,
    token,
  });
};
