import { PrismaClient } from "@eci/pkg/prisma";
import { ILogger } from "@eci/pkg/logger";

export interface Context {
  trace: {
    id: string;
  };
  logger: ILogger;
  prisma?: PrismaClient;
}

/**
 * The basic Context where some additional keys are set as required
 */
export type ExtendedContext<Keys extends keyof Context> = Context &
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
 */
export type ExtendContextFn<K extends keyof Context> = (
  ctx: Context,
) => Promise<ExtendedContext<K>>;

/**
 * Convenience function to batch multiple setup functions together
 */
export async function extendContext<Keys extends keyof Context>(
  ctx: Context,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...extendContext: Array<ExtendContextFn<any>>
): Promise<ExtendedContext<Keys>> {
  if (extendContext) {
    for (const extend of extendContext) {
      ctx = await extend(ctx);
    }
  }

  return ctx as ExtendedContext<Keys>;
}
