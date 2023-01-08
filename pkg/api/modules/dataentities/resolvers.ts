import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";
import { PrismaSelect } from "@paljs/plugins";

export const resolvers: Resolvers<Context> = {
  Query: {
    orders: async (_parent, { input }, ctx, info) => {
      const claims = await ctx.authorizeUser([]);
      /**
       * The SELECT statement for Prisma - we have to filter
       * the resulting select, as "edges" is just the input data format
       */
      const select = new PrismaSelect(info).value.select?.edges;
      console.log(select);

      if (!claims.tenants || claims.tenants.length <= 0)
        throw new Error(`You don't have access to any tenants`);
      const orders = await ctx.dataSources.db.client.order.findMany({
        where: {
          tenantId: {
            in: claims.tenants.map((t) => t.id),
          },
        },
        take: input.first,
        orderBy: input.orderBy,
        ...(input.cursor && {
          skip: 1, // Do not include the cursor itself in the query result.
          cursor: {
            id: input.cursor,
          },
        }),
        ...select,
      });
      if (orders.length === 0) {
        return {
          totalCount: 0,
          edges: [],
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
        };
      }
      const newCursor = orders[orders.length - 1].id;
      const nextPage = await ctx.dataSources.db.client.order.findMany({
        // Same as before, limit the number of events returned by this query.
        take: input.first,
        skip: 1, // Do not include the cursor itself in the query result.
        cursor: {
          id: newCursor,
        },
      });
      return {
        edges: orders,
        pageInfo: {
          endCursor: newCursor,
          hasNextPage: nextPage.length > 0,
        },
      };
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
        ...select,
      });
    },
  },
};
