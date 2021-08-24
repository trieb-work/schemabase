import { NextApiRequest, NextApiResponse } from "next";
import {
  createContext,
  setupPrisma,
  setupRequestDataFeed,
  setupLogger,
  setupSaleor,
  setupTenant,
} from "@eci/context";
import { ProductDataFeedGenerator } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";
import { HTTPError } from "@eci/util/errors";

const requestValidation = z.object({
  method: z.string().refine((m) => m === "GET"),
  query: z.object({
    publicId: z.string(),
    variant: z.enum(["facebookcommerce", "googlemerchant"]),
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
      throw new HTTPError(400, err.message);
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
      throw new HTTPError(400, "Invalid request");
    }

    ctx.logger.info("Creating new product datafeed");

    const generator = new ProductDataFeedGenerator({
      saleorGraphqlClient: ctx.saleor.graphqlClient,
      channelSlug: ctx.saleor.config.channelSlug,
    });

    const productDataFeed = await generator.generateCSV(
      ctx.requestDataFeed.storefrontProductUrl,
      ctx.requestDataFeed.variant,
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=productdatafeed-${md5(productDataFeed)}.csv`,
    );
    res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
    return res.send(productDataFeed);
  } catch (err) {
    if (err instanceof HTTPError) {
      res.status(err.statusCode);
    } else {
      res.status(500);
    }
    return res.send(err);
  } finally {
    res.end();
  }
}
