import { PrismaClient } from "@eci/data-access/prisma"
import { ServiceConfig } from "./setup/config"

export type Context = {
  prisma?: PrismaClient
  serviceConfig?: ServiceConfig
}

/**
 * A function that initializes an integration or otherwise inserts something into the context.
 *
 * This allows a fully typed experience.
 *
 * @example
 * ```
 *  const extendContext: ExtendContextFn<"newField"> = async (ctx) => {
 *  const newField = "abc"
 *
 *  return Object.assign(ctx, { newField })
 * }
 * ```
 *
 */
export type ExtendContextFn<Key extends keyof Context> = (
  ctx: Context,
) => Promise<Context & Pick<Context, Key>>

/**
 * Convenience function to batch multiple setup functions together
 */
export async function newContext<Keys extends keyof Context>(
  ...extendContext: ExtendContextFn<Keys>[]
): Promise<Context & Pick<Context, Keys>> {
  let ctx = {} as Context

  extendContext.forEach(async (extend) => {
    ctx = await extend(ctx)
  })

  return ctx
}
