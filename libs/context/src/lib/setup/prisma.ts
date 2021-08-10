import { ExtendContextFn } from "../context"
import { PrismaClient } from "@eci/data-access/prisma"

/**
 * Initialize a prisma client and make it public to the context
 */
export const setupPrisma = (): ExtendContextFn<"prisma"> => async (ctx) => {
  const url = process.env["DATABASE_URL_POOL"]
  if (!url) {
    throw new Error(`DATABASE_URL_POOL environment variable is undefined`)
  }
  return {
    ...ctx,
    prisma: new PrismaClient({
      datasources: {
        db: { url },
      },
    }),
  }
}
