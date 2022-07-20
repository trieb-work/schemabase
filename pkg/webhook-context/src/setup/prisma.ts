import { ExtendContextFn } from "../context";
import { PrismaClient } from "@eci/pkg/prisma";

let prismaGlobal: PrismaClient;

/**
 * Initialize a prisma client and make it public to the context.
 * Try to re-use an existing client instance, when the Lambda gets re-used.
 */
export const setupPrisma = (): ExtendContextFn<"prisma"> => async (ctx) => {
  const prisma = prismaGlobal || new PrismaClient();
  return Object.assign(ctx, { prisma });
};
