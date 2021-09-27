import { ContextMissingFieldError } from "@eci/util/errors";
import { SaleorClient, createSaleorClient } from "@eci/adapters/saleor";
import { Context } from "@eci/context";

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
  domain = domain.startsWith("http") ? domain : `https://${domain}`;
  return createSaleorClient({
    traceId: ctx.trace.id,
    graphqlEndpoint: `${domain}/graphql/`,
    token,
  });
};
