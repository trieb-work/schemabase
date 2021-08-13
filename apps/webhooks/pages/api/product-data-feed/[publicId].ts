import { NextApiRequest, NextApiResponse } from "next";
import {
  createContext,
  setupPrisma,
  setupRequestDataFeed,
  setupLogger,
  setupSaleor,
} from "@eci/context";
import { generateProductDataFeed } from "@eci/integrations/product-data-feed";
import md5 from "md5";
import { z } from "zod";

const requestValidation = z.object({
  query: z.object({
    publicId: z.string(),
    variant: z.string(),
  }),
  headers: z.object({
    "x-saleor-domain": z.string(),
    "x-saleor-token": z
      .string()
      .refine((s) => s.startsWith("Bearer "), "Must be a Bearer token"),
    "x-saleor-event": z.string(),
    "x-saleor-signature": z.string(),
  }),
  body: z.object({
    app_token: z.string(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const {
      headers: {
        "x-saleor-domain": domain,
        "x-saleor-event": event,
        "x-saleor-signature": signature,
        "x-saleor-token": token,
      },
      body: { app_token: appToken },
      query: { publicId, variant },
    } = requestValidation.parse(req);

    const ctx = await createContext<
      "prisma" | "requestDataFeed" | "logger" | "saleor"
    >(
      setupPrisma(),
      setupLogger(),
      setupRequestDataFeed({ publicId, variant }),
      setupSaleor({
        domain,
        event,
        appToken,
        authToken: token.replace("Bearer ", ""),
        signature: signature.replace("sha1=", ""),
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
  } catch (err) {
    res.status(400);
    res.send(err);
  } finally {
    res.end();
  }
}
