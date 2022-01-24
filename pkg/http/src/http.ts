// eslint-disable-next-line no-restricted-imports
import axios, { AxiosError } from "axios";
import { ECI_TRACE_HEADER } from "@eci/pkg/constants";

export interface Request {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

export interface Response<Data> {
  ok: boolean;
  headers: Record<string, string | number>;
  status: number;
  data: Data | null;
}

export interface HttpApi {
  call: <Data>(req: Request) => Promise<Response<Data>>;
  setHeader: (name: string, value: string | number) => void;
}

export class HttpClient implements HttpApi {
  public headers: Record<string, string>;

  public constructor(config?: { traceId?: string }) {
    this.headers = {};
    if (config?.traceId) {
      this.setHeader(ECI_TRACE_HEADER, config.traceId);
    }
  }

  public setHeader(name: string, value: string): void {
    this.headers[name] = value;
  }

  public async call<Data>(req: Request): Promise<Response<Data>> {
    return await axios({
      method: req.method,
      url: req.url,
      params: req.params,
      headers: { ...this.headers, ...req.headers },
      data: req.body,
    })
      .then((res) => ({
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        data: res.data ?? null,
        headers: res.headers,
      }))
      .catch((err: AxiosError) => {
        if (err.response == null) {
          throw err;
        }
        return {
          ok: false,
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        };
      });
  }
}
