import { ExtendContextFn } from "../context";
import { ContextMissingFieldError } from "@eci/util/errors";
import { SaleorClient, SaleorService } from "@eci/adapters/saleor";
import { SaleorApp } from "@eci/data-access/prisma";

export type Saleor = {
  client: SaleorClient;
  config: SaleorApp;
};

/**
 * Fetch the client's configuration and expose it to the context
 * Either authToken ot appToken must be defined
 *
 * // FIXME: We need the appId or domain to find the unique app
 */
export const setupSaleor = (): ExtendContextFn<"saleor"> => async (ctx) => {
  if (!ctx.prisma) {
    throw new ContextMissingFieldError("prisma");
  }
  if (!ctx.tenant) {
    throw new ContextMissingFieldError("tenant");
  }

  // FIXME: must be findUnique
  const saleorApp = await ctx.prisma.saleorApp.findFirst({
    where: { tenantId: ctx.tenant.id },
  });
  if (!saleorApp) {
    throw new Error("No saleor config found in database");
  }

  const client = new SaleorService({
    graphqlEndpoint: `https://${saleorApp.domain}/graphql/`,
  });

  return Object.assign(ctx, {
    saleor: {
      client,
      config: saleorApp,
    },
  });
};
