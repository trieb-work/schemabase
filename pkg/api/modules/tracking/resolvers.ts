import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";

export const resolvers: Resolvers<Context> = {
  Query: {
    packageByTrackingId: async (_parent, { trackingId }, ctx) => {
      await ctx.authorizeUser(["read:package"]);

      // TODO: change back to findUnique and a the tenant to this query
      return await ctx.dataSources.db.client.package.findFirst({
        where: { trackingId },
      });
    },
  },
  Order: {
    packages: async (order, _args, ctx) => {
      await ctx.authorizeUser(["read:package", "read:packageEvent"]);

      return await ctx.dataSources.db.client.package.findMany({
        where: {
          orderId: order.id,
        },
      });
    },
  },
  Package: {
    events: async (p, _args, ctx) => {
      await ctx.authorizeUser(["read:packageEvent"]);

      return await ctx.dataSources.db.client.packageEvent.findMany({
        where: { packageId: p.id },
      });
    },
    order: async (p, _args, ctx) => {
      await ctx.authorizeUser(["read:order"]);

      const found = await ctx.dataSources.db.client.package.findUnique({
        where: {
          id: p.id,
        },
        include: {
          order: true,
        },
      });
      if (found == null) {
        throw new Error("Package does not exist");
      }
      return found.order;
    },
  },
  PackageEvent: {
    sentEmail: async (packageEvent, _args, ctx) => {
      await ctx.authorizeUser(["read:transactionalEmail"]);
      return await ctx.dataSources.db.client.transactionalEmail.findUnique({
        where: {
          packageEventId: packageEvent.id,
        },
      });
    },
  },
};
