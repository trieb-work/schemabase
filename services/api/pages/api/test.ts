import { NextApiRequest, NextApiResponse } from "next";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  console.log("Hello", { obj: [1, 2, 3, new Date(), req.headers] });
  res.json({ ok: true });
}
