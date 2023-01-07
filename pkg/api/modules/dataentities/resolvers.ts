import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";
import { PrismaSelect } from "@paljs/plugins";

export const resolvers: Resolvers<Context> = {
  Query: {
    orders: async (_parent, _args, ctx, info) => {
      const claims = await ctx.authorizeUser([]);
      const select = new PrismaSelect(info).value;

      if (!claims.tenants || claims.tenants.length <= 0)
        throw new Error(`You don't have access to any tenants`);
      return await ctx.dataSources.db.client.order.findMany({
        where: {
          tenantId: {
            in: claims.tenants.map((t) => t.id),
          },
        },
        ...select,
      });
    },
    order: async (_parent, args, ctx, info) => {
      const claims = await ctx.authorizeUser([]);
      const select = new PrismaSelect(info).value;

      if (!claims.tenants || claims.tenants.length <= 0)
        throw new Error(`You don't have access to any tenants`);
      return await ctx.dataSources.db.client.order.findFirst({
        where: {
          tenantId: {
            in: claims.tenants.map((t) => t.id),
          },
          id: args.id,
          orderNumber: args.orderNumber,
        },
        take: args.limit,
        orderBy: args.orderBy,
        ...select,
      });
    },
  },
};
