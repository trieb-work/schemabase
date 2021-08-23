import { NextApiRequest, NextApiResponse } from "next";
import {
  createContext,
  setupPrisma,
  setupRequestDataFeed,
  setupLogger,
  setupSaleor,
} from "@eci/context";
import { ProductDataFeedGenerator } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";

const requestBodyValidation = z.object({
  app_token: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = requestBodyValidation.parse(req.body);
  const publicId = req.query["id"] as string;
  if (!publicId) {
    throw new Error(`Invalid request: missing id`);
  }
  const variant = req.query["variant"] as string;
  if (!variant) {
    throw new Error(`Invalid request: missing variant`);
  }

  const ctx = await createContext<
    "prisma" | "requestDataFeed" | "logger" | "saleor"
  >(
    setupPrisma(),
    setupLogger(),
    setupRequestDataFeed({ publicId, variant }),
    setupSaleor({
      domain: getHeader(req, "x-saleor-domain"),
      authToken: getHeader(req, "x-saleor-token").replace("Bearer ", ""),
      event: getHeader(req, "x-saleor-event"),
      signature: getHeader(req, "x-saleor-signature").replace("sha1=", ""),
      appToken: body.app_token,
    }),
  );

  if (!ctx.requestDataFeed.valid) {
    ctx.logger.error("Invalid request");
    return res.status(400).end();
  }

  ctx.logger.info("Creating new product datafeed");

  const productDataFeed = await generateProductDataFeed(
    ctx.saleor.graphqlClient,
    "FIXME: channel",
    ctx.requestDataFeed.storefrontProductUrl,
    ctx.requestDataFeed.variant,
  );

  if (productDataFeed === null) {
    throw new Error(`TODO: Handle this`);
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=productdatafeed-${md5(productDataFeed)}.csv`,
  );
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  return res.send(productDataFeed);
}
