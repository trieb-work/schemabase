import { Logger } from "@eci/pkg/logger";
import type { NextApiRequest, NextApiResponse } from "next";
export default (req: NextApiRequest, res: NextApiResponse) => {
  const logger = new Logger();

  logger.info("req", { req });

  res.json({ ok: true });
};
