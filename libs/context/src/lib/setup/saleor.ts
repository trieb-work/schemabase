import { ExtendContextFn } from "../context";
import { ContextMissingFieldError } from "@eci/util/errors";
import { GraphqlClient, createGraphqlClient } from "@eci/graphql-client";
import { SaleorConfig } from "@eci/data-access/prisma";

export type Saleor = {
  graphqlClient: GraphqlClient;
  config: SaleorConfig;
};

/**
 * Fetch the client's configuration and expose it to the context
 * Either authToken ot appToken must be defined
 */
export const setupSaleor = (): ExtendContextFn<"saleor"> => async (ctx) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma");
  }
  if (!ctx.tenant) {
    throw new ContextMissingFieldError("tenant");
  }

  const saleorConfig = await ctx.prisma.saleorConfig.findUnique({
    where: { tenantId: ctx.tenant.id },
  });
  if (!saleorConfig) {
    throw new Error("No saleor config found in database");
  }

  const unauthenticatedSaleorGraphqlClient = createGraphqlClient(
    `https://${saleorConfig.domain}/graphql/`,
  );

  return Object.assign(ctx, {
    saleor: {
      graphqlClient: unauthenticatedSaleorGraphqlClient,
      config: saleorConfig,
    },
  });
};
