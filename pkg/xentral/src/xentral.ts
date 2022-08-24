import "./index.d.ts";
import DigestClient from "digest-fetch";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import {
  ArtikelCreateRequest,
  ArtikelCreateResponse,
  AuftragCreateRequest,
  AuftragCreateResponse,
  GenericCreateResponse,
} from "./types";

export class XentralClient {
  public readonly client: DigestClient;

  private readonly parser = new XMLParser({ ignoreDeclaration: true });
  private readonly builder = new XMLBuilder({});

  private readonly url: string;

  constructor(config: { username: string; password: string; url: string }) {
    this.client = new DigestClient(config.username, config.password, {
      algorithm: "MD5",
    });
    this.url = config.url;
  }

  public async xmlCreate(xml: object, methodName: string): Promise<any> {
    const body = `xml=${encodeURIComponent(
      this.builder.build({ request: { xml } }),
    )}`;
    console.log("body", body);
    const xentralRes = await this.client.fetch(
      `${this.url}/api/${methodName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body,
      },
    );
    if (!xentralRes.ok) {
      throw new Error(
        `Xentral api call ${methodName} failed with status ${
          xentralRes.status
        }:\n${await xentralRes.text()}`,
      );
    }
    const res = this.parser.parse(await xentralRes.text()) as {
      response: GenericCreateResponse;
    };
    if (res?.response?.status?.message !== "OK")
      throw new Error(
        `${methodName} API response is ${res?.response?.status?.message} and not OK`,
      );
    if (!res?.response?.xml)
      throw new Error(`${methodName} API response XML is empty`);
    return res.response.xml;
  }

  public async AuftragCreate(
    auftrag: AuftragCreateRequest,
  ): Promise<AuftragCreateResponse> {
    const res = (await this.xmlCreate(
      auftrag,
      "AuftragCreate",
    )) as Partial<AuftragCreateResponse>;
    if (!res?.belegnr)
      throw new Error("AuftragCreateResponse is missing the belegnr");
    res.belegnr = String(res.belegnr);
    if (!res?.id)
      throw new Error("AuftragCreateResponse is missing the belegnr");
    return res as AuftragCreateResponse;
  }
  public async ArtikelCreate(
    artikel: ArtikelCreateRequest,
  ): Promise<ArtikelCreateResponse> {
    const res = (await this.xmlCreate(
      artikel,
      "ArtikelCreate",
    )) as Partial<ArtikelCreateResponse>;
    if (!res?.nummer)
      throw new Error("ArtikelCreateResponse is missing the belegnr");
    res.nummer = String(res.nummer);
    if (!res?.id)
      throw new Error("ArtikelCreateResponse is missing the belegnr");
    return res as ArtikelCreateResponse;
  }
}
