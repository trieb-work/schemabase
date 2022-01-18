import { ContextMissingFieldError } from "@eci/pkg/errors";
import { createSaleorClient, SaleorClient } from "@eci/pkg/saleor";
import { Context } from "../context";
import { env } from "@eci/pkg/env";

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
