import { Device, Options, PrintRequest } from "./types"
import axios, { AxiosInstance } from "axios"
import { env } from "@eci/util/env"

export class Printer {
  public request: AxiosInstance

  constructor() {
    this.request = axios.create({
      baseURL: "https://api.printnode.com",
      timeout: 4000,
      auth: {
        username: env.require("PRINTNODE_KEY"),
        password: "",
      },
    })
  }

  /**
   * Get a list of all printers we have access to
   */
  public async getPrinters(): Promise<Device[]> {
    const printers = await this.request({
      url: "/printers",
    })
    if (!printers?.data || printers.data.length < 1) {
      throw new Error("No printers returned!")
    }
    return printers.data as Device[]
  }

  public async getPrinterIdByName(name: string): Promise<number | null> {
    const printers = await this.getPrinters()
    const printerObject = printers.find((printer) => printer.name.includes(name))
    if (!printerObject) {
      const nameArray = printers.map((printer) => printer.name)
      console.error(
        `Couldn't find a matching printer with name ${name}. We only got these names: ${nameArray}`,
      )
      return null
    }
    return printerObject.id
  }

  /**
   * Print a base64 encoded PDF to a printer via the printNode network
   */
  public async print({
    base64String,
    fileName,
    printerId,
    copies = 1,
    idempotencyKey,
    rotate,
    fitToPage = true,
    paper,
  }: PrintRequest) {
    const headers: Record<string, string> = {}
    if (idempotencyKey) {
      headers["X-Idempotency-Key"] = idempotencyKey
    }
    const options: Options = {
      rotate,
    }

    if (typeof fitToPage !== "undefined") {
      options.fit_to_page = fitToPage
    }
    if (paper) {
      options.paper = paper
    }
    const response = await this.request({
      url: "/printjobs",
      method: "post",
      headers,
      data: {
        printerId,
        title: `Automatic_Zoho_Job-${fileName}`,
        contentType: "pdf_base64",
        content: base64String,
        source: "Automatically generated from the trieb.work eCommerce Integrations Job",
        qty: copies,
        options,
      },
    })
    return response.data
  }
}
