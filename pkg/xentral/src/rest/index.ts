import "./digest.d.ts";
import DigestClient from "digest-fetch";
import {
  AllowedMethod,
  AllowedSubRoutes,
  Artikel,
  Auftrag,
  AuftragParams,
  Lieferschein,
  LieferscheinParams,
  PaginatedRes,
  Trackingnummer,
  TrackingnummerParams,
} from "./types";

const DEFAULT_HEADERS = {};
const DEFAULT_ITEM_COUNT = 100;

export class XentralRestNotFoundError extends Error {
  constructor() {
    super("Resource not found");
  }
}

export class XentralRestClient {
  public readonly client: DigestClient | { fetch: typeof fetch };

  private readonly url: string;

  private readonly projectId: number | undefined;

  constructor(config: {
    username: string;
    password: string;
    url: string;
    projectId?: number;
    authType?: "digest" | "basic";
  }) {
    this.url = config.url;
    this.projectId = config.projectId;
    switch (config.authType) {
      case "basic": {
        // TODO: basic case is untested, not sure if it works
        const wrappedFetch = (
          url: RequestInfo,
          init?: RequestInit | undefined,
        ): Promise<Response> => {
          if (!init) {
            init = {};
          }
          init.headers = {
            ...init?.headers,
            Authorization: `Basic ${Buffer.from(
              `${config.username}:${config.password}`,
              "utf-8",
            ).toString("base64")}`,
          };
          return fetch(url, init);
        };
        this.client = {
          fetch: wrappedFetch,
        };
        break;
      }
      default:
      case "digest": {
        this.client = new DigestClient(config.username, config.password, {
          algorithm: "MD5",
        });
      }
    }
  }

  public async apiFetch<Res, Req extends object = {}>(
    json: Req | null,
    subroute: string,
    method: AllowedMethod,
    params?: Record<string, string | number | boolean>,
    headers: HeadersInit = DEFAULT_HEADERS,
  ): Promise<Res> {
    const newParams = this.projectId
      ? { projekt: this.projectId, ...params }
      : params;
    const queryString =
      newParams && Object.keys(newParams).length > 0
        ? `?${new URLSearchParams(
          newParams as Record<string, string>,
        ).toString()}`
        : "";
    const xentralRes = await this.client.fetch(
      `${this.url}/api${subroute}${queryString}`,
      {
        method,
        headers,
        ...(json ? { body: JSON.stringify(json) } : {}),
      },
    );
    if (xentralRes.status === 404) throw new XentralRestNotFoundError();
    if (!xentralRes.ok) {
      throw new Error(
        `Xentral api ${method} call ${subroute} failed with status ${xentralRes.status
        }:\n${await xentralRes.text()}`,
      );
    }
    return await xentralRes.json();
  }

  public async *paginatedApiFetch<
    InnerRes,
    Res extends PaginatedRes<InnerRes> = PaginatedRes<any>,
    Req extends object = {},
    >(
      json: Req | null,
      subroute: AllowedSubRoutes,
      method: AllowedMethod,
      params?: Record<string, string | number | boolean>,
      items: number = DEFAULT_ITEM_COUNT,
      headers: HeadersInit = DEFAULT_HEADERS,
  ): AsyncIterableIterator<InnerRes> {
    let res: Res;
    do {
      const page = res! ? res.pagination.page_current + 1 : 1;
      const newParams = { ...params, items, page };
      res = await this.apiFetch(json, subroute, method, newParams, headers);
      for (const elem of res.data) {
        yield elem;
      }
    } while (!res || res.pagination.page_current < res.pagination.page_last);
  }

  public async *getArtikel(
    params?: Record<string, string | number | boolean>,
    items: number = DEFAULT_ITEM_COUNT,
    headers: HeadersInit = DEFAULT_HEADERS,
  ) {
    yield* this.paginatedApiFetch<Artikel>(
      null,
      "/v1/artikel",
      "GET",
      params,
      items,
      headers,
    );
  }
  public async *getTrackingnummern(params?: TrackingnummerParams, items: number = DEFAULT_ITEM_COUNT, headers: HeadersInit = DEFAULT_HEADERS,
  ) {
    yield* this.paginatedApiFetch<Trackingnummer>(
      null,
      "/v1/trackingnummern",
      "GET",
      params as Record<string, string | number | boolean>,
      items,
      headers,
    );
  }
  public async *getLieferscheine(params?: LieferscheinParams, items: number = DEFAULT_ITEM_COUNT, headers: HeadersInit = DEFAULT_HEADERS) {
    yield* this.paginatedApiFetch<Lieferschein>(null, "/v1/belege/lieferscheine", "GET", params as Record<string, string | number | boolean>, items, headers);
  }
  public async *getAuftraege(params?: AuftragParams, items: number = DEFAULT_ITEM_COUNT, headers: HeadersInit = DEFAULT_HEADERS) {
    yield* this.paginatedApiFetch<Auftrag>(null, "/v1/belege/auftraege", "GET", params as Record<string, string | number | boolean>, items, headers);
  }
}
