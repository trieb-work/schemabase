import { ExtendContextFn } from "../context";
import { ContextMissingFieldError } from "@eci/util/errors";

export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
};

/**
 * Fetch the client's configuration and expose it to the context
 */
export const setupGoogleOAuthConfig =
  (): ExtendContextFn<"googleOAuth"> => async (ctx) => {
    if (!ctx.prisma) {
      throw new ContextMissingFieldError("prisma");
    }
    const globalConfigId = "abc";

    const config = await ctx.prisma.googleOAuthConfig.findFirst({
      where: { id: globalConfigId },
    });
    if (!config) {
      throw new Error("Unable to find google oauth config from database");
    }

    return {
      ...ctx,
      googleOAuth: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      },
    };
  };
