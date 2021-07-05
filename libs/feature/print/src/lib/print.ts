import { Printer, Options, Rotate } from "./types"
import axios, { AxiosInstance } from "axios"
import { env } from "@eci/util/env"

/**
 * Create a new axios request instance with common configuration.
 */
export function createRequest(): AxiosInstance {
  return axios.create({
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
export const getPrinters = async (): Promise<Printer[]> => {
  const request = createRequest()
  const printers = await request({
    url: "/printers",
  })
  if (!printers?.data || printers.data.length < 1) {
    throw new Error("No printers returned!")
  }
  return printers.data as Printer[]
}

export const getPrinterIdByName = async (name: string): Promise<number | null> => {
  const printers = await getPrinters()
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
 * @param base64String
 * @param fileName
 * @param printerId
 * @param copies How many copies you want to print
 * @param IdempotencyString
 */
export const printBase64 = async (
  base64String: string,
  fileName: string,
  printerId: number,
  copies = 1,
  {
    IdempotencyString,
    rotate,
    fitToPage = true,
    paper,
  }: {
    IdempotencyString?: string
    rotate?: Rotate
    fitToPage?: boolean
    paper?: string
  },
) => {
  const req = createRequest()
  const headers: Record<string, string> = {}
  if (IdempotencyString) {
    headers["X-Idempotency-Key"] = IdempotencyString
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
  const response = await req({
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
