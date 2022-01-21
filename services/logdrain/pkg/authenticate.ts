import { env } from "@eci/pkg/env";

export type AuthToken = {
  access_token: string;
  token_type: string;
  installation_id: string;
  user_id: string;
  team_id?: string;
};
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

// {
// 	"access_token": "EAhIuFNQPawVlUjVBtcTfffq",
// 	"token_type": "Bearer",
// 	"installation_id": "icfg_UHYjW73aMVyNoSOpeoHMQPEN",
// 	"user_id": "Kxx65iI5fSCTOv2DIw7U5348",
// 	"team_id": "team_DWmwXT06LmObdlKA94gALyfm"
// }

// {
// 	"clientId": "oac_LtpUGj0js0vLIKFTxTru4TYw",
// 	"configurationId": "icfg_UHYjW73aMVyNoSOpeoHMQPEN",
// 	"createdAt": 1642780231375,
// 	"id": "ld_EGYDKqfHMQfVhCfY",
// 	"type": "json",
// 	"name": "ngrok",
// 	"ownerId": "team_DWmwXT06LmObdlKA94gALyfm",
// 	"projectId": null,
// 	"url": "https://e2a9-2003-ee-f705-2d00-5d66-c81-a1f1-d81.ngrok.io"
// }
