import { NextApiRequest, NextApiResponse } from "next";
import {
  createContext,
  setupPrisma,
  setupSaleor,
  setupTenant,
} from "@eci/context";
import { z } from "zod";

const requestValidation = z.object({
  method: z.string().refine((m) => m === "POST"),
  query: z.object({
    tenantId: z.string(),
  }),
  headers: z.object({
    "x-saleor-domain": z.string(),
  }),
  body: z.object({
    app_token: z.string(),
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
      headers: { "x-saleor-domain": domain },
      body: { app_token: appToken },
      query: { tenantId },
    } = await requestValidation.parseAsync(req).catch((err) => {
      res.status(400);
      throw err;
    });

    const ctx = await createContext<"prisma" | "saleor">(
      setupPrisma(),
      setupTenant({ where: { id: tenantId } }),
      setupSaleor(),
    );

    await ctx.prisma.saleorApp.upsert({
      where: { domain },
      update: {},
      create: {
        tenantId,
        name: "",
        domain,
        appToken,
        channelSlug: "",
      },
    });

    res.status(200);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
}
