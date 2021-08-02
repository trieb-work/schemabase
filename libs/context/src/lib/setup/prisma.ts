import { ExtendContextFn } from "../context"
import { PrismaClient } from "@eci/data-access/prisma"

/**
 * Initialize a prisma client and make it public to the context
 */
export const setupPrisma = (): ExtendContextFn<"prisma"> => async (ctx) => {
  return { ...ctx, prisma: new PrismaClient() }
}
