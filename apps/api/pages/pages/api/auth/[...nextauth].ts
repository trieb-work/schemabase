import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { User, Account, Profile } from "next-auth"
import Providers from "next-auth/providers"
import { createContext, setupPrisma, setupGoogleOAuthConfig } from "@eci/context"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createContext<"prisma" | "googleOAuth">(setupPrisma(), setupGoogleOAuthConfig())

  const options = {
    // Configure one or more authentication providers
    providers: [Providers.Google(ctx.googleOAuth)],
    callbacks: {
      signIn: async (_user: User, account: Account, profile: Profile) => {
        const success: boolean =
          account.provider === "google" &&
          profile["verified_email"] === true &&
          !!profile.email &&
          profile.email.endsWith("@trieb.work")
        return Promise.resolve(success)
      },
    },
  }
  return NextAuth(req, res, options)
}
