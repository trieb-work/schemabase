import { Device, Options, PrintRequest } from "./types";
import { env } from "@chronark/env";
import { HttpApi, HttpClient } from "@eci/http";
import { HttpError } from "@eci/util/errors";
export class Printer {
  public httpClient: HttpApi;

  constructor() {
    this.httpClient = new HttpClient();
    this.httpClient.setHeader(
      "Authorization",
      `Basic ${Buffer.from(`${env.require("PRINTNODE_KEY")}:`).toString(
        "base64",
      )}`,
    );
  }

  /**
   * Get a list of all printers we have access to
   */
  public async getPrinters(): Promise<Device[]> {
    const res = await this.httpClient.call<Device[]>({
      method: "GET",
      url: "https://api.printnode.com/printers",
    });
    if (!res.data) {
      throw new HttpError(500, "Unable to load available printers");
    }
    return res.data;
  }

  public async getPrinterIdByName(name: string): Promise<number | null> {
    const printers = await this.getPrinters();
    const printerObject = printers.find((printer) =>
      printer.name.includes(name),
    );
    if (!printerObject) {
      const nameArray = printers.map((printer) => printer.name);
      console.error(
        `Couldn't find a matching printer with name ${name}. We only got these names: ${nameArray}`,
      );
      return null;
    }
    return printerObject.id;
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
    if (idempotencyKey) {
      this.httpClient.setHeader("X-Idempotency-Key", idempotencyKey);
    }
    const options: Options = {
      rotate,
    };

    if (typeof fitToPage !== "undefined") {
      options.fit_to_page = fitToPage;
    }
    if (paper) {
      options.paper = paper;
    }
    return await this.httpClient.call({
      url: "https://api.printnode.com/printjobs",
      method: "POST",
      body: {
        printerId,
        title: `Automatic_Zoho_Job-${fileName}`,
        contentType: "pdf_base64",
        content: base64String,
        source:
          "Automatically generated from the trieb.work eCommerce Integrations Job",
        qty: copies,
        options,
      },
    });
  }
}
