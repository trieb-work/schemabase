/**
 * Temporary way of creating new apps
 */

import { NextApiRequest, NextApiResponse } from "next";
import { setupLogger, createContext } from "@eci/context";
import { z } from "zod";
import { SaleorService } from "@eci/adapters/saleor";

const requestValidation = z.object({
  method: z.string().refine((m) => m === "POST"),
  body: z.object({
    saleorUrl: z.string().url(),
    token: z.string(),
    tenantId: z.string().uuid(),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const {
      body: { saleorUrl, token, tenantId },
    } = await requestValidation.parseAsync(req).catch((err) => {
      res.status(400);
      throw err;
    });

    const ctx = await createContext<"logger">(setupLogger());
    ctx.logger.info("installing new app");
    const saleorClient = new SaleorService({
      graphqlEndpoint: saleorUrl,
      token,
    });
    await saleorClient.installApp(tenantId).catch((err) => {
      res.status(500);
      ctx.logger.error(err);
      throw err;
    });
    res.status(200);
  } catch (err) {
    return res.send(err.message);
  } finally {
    res.end();
  }
}
