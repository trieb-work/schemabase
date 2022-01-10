import { Logger } from "@eci/pkg/logger";
import type { NextApiRequest, NextApiResponse } from "next";
export default (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();

  logger.info("req", {
    headers: req.headers,
    body: req.body,
    query: req.query,
  });

  res.json({ ok: true });
};
