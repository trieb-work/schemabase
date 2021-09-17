import { ExtendContextFn } from "../context";
import { ContextMissingFieldError } from "@eci/util/errors";
import type { Prisma } from "@eci/data-access/prisma";
export type { Tenant } from "@eci/data-access/prisma";
/**
 * Fetch the tenant configuration and expose it to the context
 */
export const getTenant =
  (query: Prisma.TenantFindFirstArgs): ExtendContextFn<"tenant"> =>
  async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma");
    }

    const tenant = await ctx.prisma.tenant.findFirst(query);
    if (!tenant) {
      throw new Error("Unable to find tenant in database");
    }
    ctx.logger.addMetadata({ tenant: tenant.id });

    return Object.assign(ctx, { tenant });
  };
