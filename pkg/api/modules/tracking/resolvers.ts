import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";

export const resolvers: Resolvers<Context> = {
  Query: {
    orderById: async (_parent, { orderId }, ctx) => {
      await ctx.authorizeUser(["read:order"]);
      return await ctx.dataSources.db.client.order.findUnique({
        where: { id: orderId },
      });
    },
    packageByTrackingId: async (_parent, { trackingId }, ctx) => {
      await ctx.authorizeUser(["read:package"]);

      return await ctx.dataSources.db.client.package.findUnique({
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
        include: {
          events: true,
          order: true,
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
      if (!found) {
        throw new Error("Package does not exist");
      }
      return found.order;
    },
  },
};
