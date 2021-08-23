import axios from "axios";

export type Request = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: unknown;
  headers?: Record<string, string | number>;
};

export type Caller<Response = unknown> = (req: Request) => Promise<Response>;

export const caller: Caller = async (req) => {
  return await axios({
    ...req,
    data: JSON.stringify(req.body),
  }).then((res) => res.data);
};
