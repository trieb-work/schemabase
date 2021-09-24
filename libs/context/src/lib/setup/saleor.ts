import { ContextMissingFieldError } from "@eci/util/errors";
import { SaleorClient, SaleorService } from "@eci/adapters/saleor";
import { SaleorApp } from "@eci/data-access/prisma";
import { Context } from "@eci/context";

export type Saleor = {
  client: SaleorClient;
  config: SaleorApp;
};

/**
 * Create a new saleor client for the given domain
 */
export const newSaleorClient = (ctx: Context, domain: string) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma");
  }
  ctx.logger = ctx.logger.with({ saleorDomain: domain });
  return new SaleorService({
    traceId: ctx.trace.id,
    graphqlEndpoint: `https://${domain}/graphql/`,
  });
};
