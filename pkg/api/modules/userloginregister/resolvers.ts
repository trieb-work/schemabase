import { JWT } from "@eci/pkg/auth";
import { krypto } from "@eci/pkg/krypto";
import { Context } from "../../context";
import { Resolvers } from "../../generated/schema-types";

export const resolvers: Resolvers<Context> = {
  Mutation: {
    signup: async (
      _parent: unknown,
      args: { email: string; password: string; name: string },
      ctx: Context,
    ) => {
      // 1
      const password = await krypto.encrypt(args.password);
      // const password = await hash(args.password, 10);

      // 2
      const user = await ctx.dataSources.db.client.eci_User.create({
        data: { ...args, password },
      });

      // 3
      // const token = sign({ userId: user.id }, APP_SECRET);
      const token = JWT.sign(user.id, { roles: ["user"] });

      // 4
      return {
        token,
        user,
      };
    },
    login: async (
      _parent: unknown,
      args: { email: string; password: string },
      ctx: Context,
    ) => {
      const eciUser = await ctx.dataSources.db.client.eci_User.findUnique({
        where: {
          email: args.email,
        },
        include: {
          eci_User_Tenants: true,
        },
      });
      if (!eciUser) throw new Error(`No user with email ${args.email} found`);

      if ((await krypto.decrypt(eciUser.password || "")) !== args.password)
        throw new Error(`Wrong PW`);

      const token = JWT.sign(eciUser.id, { roles: ["user"] });

      const user = {
        id: eciUser.id,
        email: eciUser.email,
        name: eciUser.name,
        tenants: eciUser.eci_User_Tenants.map((x) => ({
          id: x.tenantId,
          role: x.role,
        })),
      };

      return {
        token,
        user,
      };
    },
  },
};
