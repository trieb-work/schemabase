import "./digest.d.ts";
import DigestClient from "digest-fetch";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import {
    ArtikelCreateRequest,
    ArtikelCreateResponse,
    ArtikelEditRequest,
    ArtikelEditResponse,
    ArtikelGetRequest,
    ArtikelGetResponse,
    AuftragCreateRequest,
    AuftragCreateResponse,
    AuftragEditRequest,
    AuftragEditResponse,
    GenericCreateResponse,
} from "./types";

export class XentralXmlClient {
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

    public async edit<Res>(xml: object, methodName: string): Promise<Res> {
        return this.create<Res>(xml, methodName, true);
    }

    public async create<Res>(
        xml: object,
        methodName: string,
        allowEmptyResponse = false,
    ): Promise<Res> {
        const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
        const xmlStr = `${xmlHeader}${this.builder.build({
            request: { xml },
        })}`;
        console.debug("xmlStr", xmlStr);
        const body = `xml=${encodeURIComponent(xmlStr)}`;
        const xentralRes = await this.client.fetch(
            `${this.url}/api/${methodName}`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
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
        if (!allowEmptyResponse && !res?.response?.xml)
            throw new Error(`${methodName} API response XML is empty`);
        return res.response.xml;
    }

    public async AuftragCreate(
        auftrag: AuftragCreateRequest,
    ): Promise<AuftragCreateResponse> {
        const res = await this.create<AuftragCreateResponse>(
            auftrag,
            "AuftragCreate",
        );
        if (!res?.belegnr)
            throw new Error("AuftragCreateResponse is missing the belegnr");
        res.belegnr = String(res.belegnr);
        if (!res?.id)
            throw new Error("AuftragCreateResponse is missing the belegnr");
        return res as AuftragCreateResponse;
    }

    public async AuftragEdit(
        auftrag: AuftragEditRequest,
    ): Promise<AuftragEditResponse> {
        return this.edit<AuftragEditResponse>(auftrag, "AuftragEdit");
    }

    public async ArtikelCreate(
        artikel: ArtikelCreateRequest,
    ): Promise<ArtikelCreateResponse> {
        const res = await this.create<ArtikelCreateResponse>(
            artikel,
            "ArtikelCreate",
        );
        if (!res?.nummer)
            throw new Error("ArtikelCreateResponse is missing the artikelnr.");
        res.nummer = String(res.nummer);
        if (!res?.id)
            throw new Error("ArtikelCreateResponse is missing the artikelnr.");
        return res as ArtikelCreateResponse;
    }

    public async ArtikelEdit(
        artikel: ArtikelEditRequest,
    ): Promise<ArtikelEditResponse> {
        return this.edit<ArtikelEditResponse>(artikel, "ArtikelEdit");
    }

    public async ArtikelGet(
        artikel: ArtikelGetRequest,
    ): Promise<ArtikelGetResponse> {
        const res = await this.create<ArtikelGetResponse>(
            artikel,
            "ArtikelGet",
        );
        if (!res?.nummer)
            throw new Error("ArtikelGetResponse is missing the artikelnr.");
        res.nummer = String(res.nummer);
        if (!res?.id)
            throw new Error("ArtikelGetResponse is missing the artikelnr.");
        return res as ArtikelCreateResponse;
    }
}
