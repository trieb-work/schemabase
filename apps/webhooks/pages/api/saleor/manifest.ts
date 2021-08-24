import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { env } from "@eci/util/env";

const requestValidation = z.object({
  method: z.string().refine((m) => m === "GET"),
  query: z.object({
    tenantId: z.string(),
  }),
});

/**
 * Return an app manifest including the tenantId
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const {
      query: { tenantId },
    } = await requestValidation.parseAsync(req).catch((err) => {
      res.status(400);
      throw err;
    });

    const baseUrl = env.require("ECI_BASE_URL");

    const manifest = {
      id: "triebwork.eci",
      version: "1.0.0",
      name: "eCommerce Integrations for Saleor",
      about:
        "The trieb.work ECI for saleor is a powerful App used for several services like data synchronisation to Zoho Inventory, Mailchimp, an advanced product data feed etc.. ",
      permissions: [
        "MANAGE_SHIPPING",
        "MANAGE_PRODUCTS",
        "MANAGE_ORDERS",
        "MANAGE_GIFT_CARD",
        "MANAGE_DISCOUNTS",
        "MANAGE_CHECKOUTS",
        "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
      ],
      appUrl: "http://localhost:3000/app",
      configurationUrl: `${baseUrl}/saleor/configuration?tenantId=${tenantId}`,
      tokenTargetUrl: `${baseUrl}/api/saleor/register?tenantId=${tenantId}`,
      dataPrivacy: "Lorem ipsum",
      dataPrivacyUrl: "http://localhost:3000/app-data-privacy",
      homepageUrl: "https://trieb.work",
      supportUrl: "http://localhost:3000/support",
    };

    res.json(manifest);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
}
