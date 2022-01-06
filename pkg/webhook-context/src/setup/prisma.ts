import { ExtendContextFn } from "../context";
import { PrismaClient } from "@eci/pkg/prisma";
import { env } from "@eci/pkg/env";
/**
 * Initialize a prisma client and make it public to the context
 */
export const setupPrisma = (): ExtendContextFn<"prisma"> => async (ctx) => {
  const url = env.require("DATABASE_URL_POOL");
  const prisma = new PrismaClient({ datasources: { db: { url } } });
  return Object.assign(ctx, { prisma });
};
