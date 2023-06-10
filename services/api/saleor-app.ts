import { SaleorApp } from "@saleor/app-sdk/saleor-app";
import prismaAPL from "./lib/prisma-apl";

/**
 * By default auth data are stored in the `.auth-data.json` (FileAPL).
 * For multi-tenant applications and deployments please use UpstashAPL.
 *
 * To read more about storing auth data, read the
 * [APL documentation](https://github.com/saleor/saleor-app-sdk/blob/main/docs/apl.md)
 */

const apl = prismaAPL;

export const saleorApp = new SaleorApp({
  apl,
});
