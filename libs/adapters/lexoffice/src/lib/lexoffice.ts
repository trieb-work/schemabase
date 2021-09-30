import FormData from "form-data";
import {
  LexofficeInvoiceObject,
  LexOfficeVoucher,
  VoucherStatus,
} from "./types";
import { retry } from "@eci/util/retry";
import { HttpApi, HttpClient } from "@eci/http";
type VoucherType = "invoice" | "salesinvoice";

export class LexofficeInstance {
  private httpClient: HttpApi;

  constructor(apiKey: string) {
    this.httpClient = new HttpClient();
    // baseURL: "https://api.lexoffice.io/v1",
    this.httpClient.setHeader("Authorization", `Bearer ${apiKey}`);
  }

  /**
   * Get a voucher list from Lexoffice
   * @param voucherType
   * @param voucherStatus
   */
  public async voucherlist(
    voucherType: VoucherType,
    voucherStatus: VoucherStatus,
  ) {
    const vouchers = await this.httpClient.call<{ content: unknown[] }>({
      method: "GET",
      url: "https://api.lexoffice.io/v1/voucherlist",
      params: {
        voucherType,
        voucherStatus,
      },
    });
    return vouchers.data?.content;
  }

  /**
   * Search for a voucher with a specific number
   * @param voucherNumber
   */
  public async getVoucherByVoucherNumber(voucherNumber: string) {
    const voucher = await this.httpClient.call<{ content: LexOfficeVoucher[] }>(
      {
        method: "GET",
        url: "https://api.lexoffice.io/v1/vouchers",
        params: {
          voucherNumber,
        },
      },
    );
    return voucher.data?.content[0] ?? null;
  }

  /**
   * Create a voucher in Lexoffice
   * @param voucherData
   * @returns lexOfficeInvoiceID
   */
  public async createVoucher(voucherData: LexofficeInvoiceObject) {
    const result = await this.httpClient.call<{ id: string }>({
      method: "POST",
      url: "https://api.lexoffice.io/v1/vouchers",
      body: voucherData,
    });
    return result.data?.id;
  }

  /**
   * Uploads a file as multipart form-data to a voucher
   * @param filebuffer
   * @param filename
   */
  public async addFiletoVoucher(
    filebuffer: Buffer,
    filename: string,
    voucherId: string,
  ) {
    const form = new FormData();
    form.append("file", filebuffer, filename);
    await this.httpClient.call({
      url: `https://api.lexoffice.io/v1/vouchers/${voucherId}/files`,
      method: "POST",
      headers: form.getHeaders(),
      body: form,
    });

    return true;
  }

  /**
   * searches for the Email Adresse and returns the customer Id, if the customer does already exist.
   */
  public async createContactIfnotExisting({
    email,
    firstName,
    lastName,
    street,
    countryCode,
  }: {
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    countryCode: string;
  }): Promise<string> {
    const res = await this.httpClient.call<{
      content: { id: string }[];
    }>({
      method: "GET",
      url: "https://api.lexoffice.io/v1/contacts",
      params: {
        email,
        customer: "true",
      },
    });
    if (res.data?.content && res.data.content.length > 0) {
      return res.data?.content[0].id;
    }
    const data = {
      version: 0,
      roles: {
        customer: {},
      },
      person: {
        firstName,
        lastName,
      },
      addresses: {
        billing: [
          {
            street,
            countryCode,
          },
        ],
      },
      emailAddresses: {
        business: [`${email}`],
      },
    };

    const contact = await retry(
      async () => {
        const res = await this.httpClient.call<{ id: string }>({
          url: "https://api.lexoffice.io/v1/contacts",
          method: "POST",
          body: data,
        });
        if (!res.data?.id) {
          throw new Error("Unable to create user in LexOffice");
        }
        return res.data;
      },
      { maxAttempts: 5 },
    );
    return contact.id;
  }
}
