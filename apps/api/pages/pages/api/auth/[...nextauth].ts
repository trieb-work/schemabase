import { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { createContext, setupPrisma, setupGoogleOAuthConfig } from "@eci/context"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createContext<"prisma"|"googleOAuth">(setupPrisma(), setupGoogleOAuthConfig())
  const options = {
    // Configure one or more authentication providers
    providers: [
      Providers.Google({
        clientId: ctx.googleOAuth.clientId,
        clientSecret: ctx.googleOAuth.clientSecret,
      }),
    ],
    callbacks: {
      signIn: async (_user, account, profile) => {
        if (
          account.provider === "google" &&
          profile.verified_email === true &&
          profile.email.endsWith("@trieb.work")
        ) {
          return Promise.resolve(true)
        }
        return Promise.resolve(false)
      },
    },
  }
  return NextAuth(req, res, options)
}
