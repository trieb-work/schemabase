import { NextApiRequest, NextApiResponse } from "next";
import {
  createContext,
  setupPrisma,
  setupRequestDataFeed,
  setupLogger,
  setupSaleor,
  setupTenant,
} from "@eci/context";
import { generateProductDataFeed } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";

const requestValidation = z.object({
  method: z.string().refine((m) => m === "GET"),
  query: z.object({
    publicId: z.string(),
    variant: z
      .string()
      .refine(
        (variant) => ["facebookcommerce", "googlemerchant"].includes(variant),
        "only `facebookcommerce` and `googlemerchant` are currently supported",
      ),
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
      query: { publicId, variant },
    } = await requestValidation.parseAsync(req).catch((err) => {
      res.status(400);
      throw err;
    });

    const ctx = await createContext<
      "prisma" | "requestDataFeed" | "tenant" | "logger" | "saleor"
    >(
      setupLogger(),
      setupPrisma(),
      setupTenant({ where: { productdatafeed: { some: { publicId } } } }),
      setupSaleor(),
      setupRequestDataFeed({ publicId, variant }),
    );

    if (!ctx.requestDataFeed.valid) {
      ctx.logger.error("Invalid request");
      return res.status(400).end();
    }

    ctx.logger.info("Creating new product datafeed");

    const productDataFeed = await generateProductDataFeed(
      ctx.saleor.graphqlClient,
      ctx.requestDataFeed.storefrontProductUrl,
      ctx.requestDataFeed.variant,
    );

    if (productDataFeed === null) {
      res.status(500);
      throw new Error("Unable to generate product data");
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=productdatafeed-${md5(productDataFeed)}.csv`,
    );
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    return res.send(productDataFeed);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
}
