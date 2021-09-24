import { extendContext, setupPrisma } from "@eci/context";
import { z } from "zod";
// import { idGenerator } from "@eci/util/ids";
import { handleWebhook, Webhook } from "@eci/http";

const requestValidation = z.object({
  query: z.object({
    tenantId: z.string(),
  }),
  // headers: z.object({
  //   "x-saleor-domain": z.string(),
  // }),
  body: z.object({
    auth_token: z.string(),
  }),
});

/**
 * The product data feed returns a google standard .csv file from products and their attributes in your shop.#
 */
const webhook: Webhook<z.infer<typeof requestValidation>> = async ({
  backgroundContext,
  req,
  res,
}): Promise<void> => {
  try {
    const ctx = await extendContext<"prisma">(backgroundContext, setupPrisma());

    ctx.logger.info("Registering app", { req });
    ctx.logger.info("body", { token: req.body.auth_token });


  await ctx.prisma.saleorApp.create({
    data:{
      
    }
  })


    res.status(200);
  } catch (err) {
    return res.send(err);
  } finally {
    res.end();
  }
};

export default handleWebhook({
  webhook,
  validation: {
    http: { allowedMethods: ["POST"] },
    request: requestValidation,
  },
});
