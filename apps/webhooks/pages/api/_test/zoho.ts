import { NextApiRequest, NextApiResponse } from "next";
import { StrapiOrdersToZoho } from "@eci/integrations/strapi-orders-to-zoho";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { env } from "@chronark/env";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    req.body.event = `strapi.${req.body.event}`;
    const zoho = new ZohoClientInstance({
      zohoClientId: env.require("ZOHO_CLIENT_ID"),
      zohoClientSecret: env.require("ZOHO_CLIENT_SECRET"),
      zohoOrgId: env.require("ZOHO_ORG_ID"),
    });

    const strapiBaseUrl = req.headers["origin"] as string | undefined;
    if (!strapiBaseUrl) {
      throw new Error("origin header missing");
    }

    const integration = await StrapiOrdersToZoho.new({ zoho, strapiBaseUrl });

    await integration.syncOrders(req.body);
  } catch (err) {
    console.error(err);
    return res.send(err.message);
  } finally {
    res.end();
  }
}
