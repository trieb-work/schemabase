import { ContextMissingFieldError } from "@eci/util/errors";
import { SaleorClient, createSaleorClient } from "@eci/adapters/saleor/api";
import { Context } from "@eci/context";
import { env } from "@chronark/env";

/**
 * Create a new saleor client for the given domain
 */
export const newSaleorClient = (
  ctx: Context,
  domain: string,
  token?: string,
): SaleorClient => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma");
  }
  ctx.logger = ctx.logger.with({ saleorDomain: domain });
  /**
   * Add a protocol if none is provided
   */
  if (!domain.startsWith("http")) {
    const protocol =
      env.get("NODE_ENV") === "production" && !env.get("CI") ? "https" : "http";
    domain = `${protocol}://${domain}`;
  }
  return createSaleorClient({
    traceId: ctx.trace.id,
    graphqlEndpoint: `${domain}/graphql/`,
    token,
  });
};
