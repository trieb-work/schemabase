import axios, { AxiosInstance } from "axios"
import assert from "assert"
import FormData from "form-data"
import { HTTPError } from "@eci/util/errors"
import { LexofficeInvoiceObject, LexOfficeVoucher, VoucherStatus } from "./types"
import { retry } from "@eci/util/retry"
type VoucherType = "invoice" | "salesinvoice"

export class LexofficeInstance {
  private req: AxiosInstance

  constructor(apiKey: string) {
    this.req = axios.create({
      baseURL: "https://api.lexoffice.io/v1",
      timeout: 6000,
      headers: {
        Authorization: `Bearer: ${apiKey}`,
      },
    })
  }

  /**
   * Get a voucher list from Lexoffice
   * @param voucherType
   * @param voucherStatus
   */
  public async voucherlist(voucherType: VoucherType, voucherStatus: VoucherStatus) {
    const vouchers = await this.req({
      url: "/voucherlist",
      params: {
        voucherType,
        voucherStatus,
      },
    })
    assert.strictEqual(vouchers.status, 200)
    return vouchers.data.content as []
  }

  /**
   * Search for a voucher with a specific number
   * @param voucherNumber
   */
  public async getVoucherByVoucherNumber(voucherNumber: string) {
    const voucher = await this.req({
      url: "/vouchers",
      params: {
        voucherNumber,
      },
    })
    assert.strictEqual(voucher.status, 200)
    return (voucher.data?.content[0] as LexOfficeVoucher) || null
  }

  /**
   * Create a voucher in Lexoffice
   * @param voucherData
   * @returns lexOfficeInvoiceID
   */
  public async createVoucher(voucherData: LexofficeInvoiceObject) {
    const result = await this.req({
      url: "/vouchers",
      method: "post",
      data: voucherData,
    })
    return result.data.id as string
  }

  /**
   * Uploads a file as multipart form-data to a voucher
   * @param filebuffer
   * @param filename
   */
  public async addFiletoVoucher(filebuffer: Buffer, filename: string, voucherId: string) {
    const form = new FormData()
    form.append("file", filebuffer, filename)
    await this.req({
      url: `/vouchers/${voucherId}/files`,
      method: "post",
      headers: form.getHeaders(),
      data: form,
    })

    return true
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
    email: string
    firstName: string
    lastName: string
    street: string
    countryCode: string
  }): Promise<string> {
    const customerLookup = await this.req({
      url: "/contacts",
      method: "GET",
      params: {
        email,
        customer: true,
      },
    })
    if (customerLookup.data?.content?.length > 0) {
      console.log("Found a contact. Returning ID")
      return customerLookup.data.content[0].id
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
    }

    const contacts = await retry(
      async () => {
        const res = await this.req({
          url: "/contacts",
          method: "post",
          data,
        })
        if (!res.data?.id) {
          throw new Error("Unable to create user in LexOffice")
        }
        return res
      },
      { maxAttempts: 5 },
    )
    return contacts.data?.id

    throw new HTTPError(`Unable to create new User in Lexoffice after 5 attempts`)
  }
}
