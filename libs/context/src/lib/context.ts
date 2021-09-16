import { PrismaClient } from "@eci/data-access/prisma";
import { Logger } from "./setup/logger";
import { Sentry } from "./setup/sentry";
import { Saleor } from "./setup/saleor";
import { RequestDataFeed } from "./setup/requestDataFeed";
import { Tenant } from "./setup/tenant";

export type Context = {
  prisma?: PrismaClient;
  logger?: Logger;
  sentry?: Sentry;
  saleor?: Saleor;
  tenant?: Tenant;
  requestDataFeed?: RequestDataFeed;
};

type RequiredKeys<Keys extends keyof Context> = Context &
  Required<Pick<Context, Keys>>;

/**
 * A function that initializes an integration or otherwise inserts something into the context.
 *
 * This allows a fully typed experience.
 *
 * @example
 * ```
 *  const extendContext: ExtendContextFn<"newField"> = async (ctx) => {
 *    return Object.assign(ctx, { newField: "abc" })
 * }
 * ```
 *
 */
export type ExtendContextFn<K extends keyof Context> = (
  ctx: Context,
) => Promise<RequiredKeys<K>>;

/**
 * Convenience function to batch multiple setup functions together
 */
export async function createContext<Keys extends keyof Context>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...extendContext: ExtendContextFn<any>[]
): Promise<RequiredKeys<Keys>> {
  let ctx = {} as Context;

  for (const extend of extendContext) {
    ctx = await extend(ctx);
  }

  return ctx as RequiredKeys<Keys>;
}
