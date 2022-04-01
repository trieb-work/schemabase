# eCommerce-integrations

This is the MonoRepo for the ecommere-integrations (ECI).

We are using pnpm2 package manager and have a serverless Next.Js application, a
node.js task runner, several shared packages and a trigger function running in
AWS Lambda.


## Remote tunnel
In order to test webhook systems, we integrated a remote tunnel, so that you have a public TLS endpoint, that gets forwarded to your local machine.

We are using the cloudflared argo tunnels: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/#local-setup-cli-setup

```
brew install cloudflare/cloudflare/cloudflared
```

The token can be found in the bitwarden secret eci.env

Afterwards, you can create a tunnel:
```
cloudflared tunnel create
```

Or you can just quickly spin-up a tunnel without auth: 
```
cloudflared tunnel --url localhost:3000
```