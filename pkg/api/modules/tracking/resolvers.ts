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
};
