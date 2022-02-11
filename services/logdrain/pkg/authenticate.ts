import { env } from "@eci/pkg/env";

export interface AuthToken {
  /* eslint-disable camelcase */
  access_token: string;
  token_type: string;
  installation_id: string;
  user_id: string;
  team_id?: string;
  /* eslint-enable camelcase */
}
export async function authenticate(code: string): Promise<AuthToken> {
  const res = await fetch("https://api.vercel.com/v2/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.require("LOGDRAIN_CLIENT_ID"),
      client_secret: env.require("LOGDRAIN_CLIENT_SECRET"),
      code,
      redirect_uri: env.require("LOGDRAIN_REDIRECT_URI"),
    }),
  });
  if (!res.ok) {
    throw new Error(`Unable to authenticate: ${await res.text()}`);
  }
  return (await res.json()) as AuthToken;
}
