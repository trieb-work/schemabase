import { server } from "@eci/pkg/api/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === "OPTIONS") {
    res.status(200);

    res.end();
    return;
  }

  const srv = server();
  await srv.start();
  /**
   * Handle graphql request
   */
  const handler = srv.createHandler({ path: "/api/graphql" });
  await handler(req, res);
}

/**
 * ApolloServer expects the raw body to be available to the handler,
 * and not an object parsed from JSON as it is by default for API Routes.
 * To prevent this, we need to export this config object.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};
