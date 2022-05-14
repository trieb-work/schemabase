import { ExtendContextFn } from "../context";
import { PrismaClient } from "@eci/pkg/prisma";
/**
 * Initialize a prisma client and make it public to the context
 */
export const setupPrisma = (): ExtendContextFn<"prisma"> => async (ctx) => {
  const prisma = new PrismaClient();
  return Object.assign(ctx, { prisma });
};
