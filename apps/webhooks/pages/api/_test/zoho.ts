import { NextApiRequest, NextApiResponse } from "next";
import { StrapiOrdersToZoho } from "@eci/integrations/strapi-orders-to-zoho";
import { ZohoClientInstance } from "@trieb.work/zoho-ts";
import { env } from "@chronark/env";
import { NoopLogger } from "@eci/util/logger";
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
    console.log({ body: JSON.stringify(req.body, null, 2) });

    const integration = await StrapiOrdersToZoho.new({
      zoho,
      logger: new NoopLogger(),
    });

    await integration.syncOrders(req.body);
  } catch (err) {
    console.error(err);
    return res.send(err.message);
  } finally {
    res.end();
  }
}
