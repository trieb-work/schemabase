import {
  Topic,
  eventValidation,
  EntryCreateEvent,
  EntryUpdateEvent,
} from "@eci/events/strapi";
import { z } from "zod";
import {
  ZohoClientInstance,
  SalesOrder,
  SalesOrderReturn,
} from "@trieb.work/zoho-ts";
import csvToJson from "csvtojson";
const statusValidation = z.enum(["Draft", "Confirmed"]);

const addressValidation = z.object({
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  address: z.string(),
  postcode: z.number().int().positive(),
  city: z.string(),
  country: z.string(),
});
const orderValidation = z.object({
  event: z.enum([Topic.ENTRY_CREATE, Topic.ENTRY_UPDATE]),
  model: z.enum(["order"]),
  entry: z.object({
    customerName: z.string(),
    orderId: z.string(),
    addresses: z.array(addressValidation),
    addressCSV: z
      .object({
        url: z.string(),
      })
      .nullable(),
    status: statusValidation,
    zohoCustomerId: z.string(),
    products: z.array(
      z.object({
        name: z.string(),
        count: z.number().int().positive(),
      }),
    ),
  }),
});

export type CreateOrderEvent = z.infer<typeof eventValidation> &
  z.infer<typeof orderValidation>;

type CreateSalesOrder = Required<
  Pick<SalesOrder, "customer_id" | "salesorder_number" | "line_items">
> &
  SalesOrder;
export class StrapiOrdersToZoho {
  private readonly strapiBaseUrl: string;
  public zoho: ZohoClientInstance;

  private constructor(config: {
    zoho: ZohoClientInstance;
    strapiBaseUrl: string;
  }) {
    this.zoho = config.zoho;
    this.strapiBaseUrl = config.strapiBaseUrl;
  }

  public static async new(config: {
    zoho: ZohoClientInstance;
    strapiBaseUrl: string;
  }): Promise<StrapiOrdersToZoho> {
    const instance = new StrapiOrdersToZoho(config);
    await instance.zoho.authenticate();

    return instance;
  }

  /**
   * Addresses can be supplied via .csv file or manually in strapi.
   *
   * Fetch the .csv file if it exists and transform it to json.
   * Afterwards the addresses from .csv and manual are merged.
   *
   * This does not deduplicate the addresses yet.
   */
  private async mergeAddresses({
    entry,
  }: z.infer<typeof orderValidation>): Promise<
    z.infer<typeof addressValidation>[]
  > {
    if (!entry.addressCSV) {
      return entry.addresses;
    }

    const url = `${this.strapiBaseUrl}${entry.addressCSV.url}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Unable to get addresses from strapi: ${url} `);
    }
    let json = await csvToJson().fromString(await res.text());
    json = json.map((row) => ({
      ...row,
      postcode: parseInt(row.postcode),
    }));

    const addresses = await z
      .array(addressValidation)
      .parseAsync(json)
      .catch((err) => {
        throw new Error(`addresses csv is invalid: ${err}`);
      });

    return [...addresses, ...entry.addresses];
  }

  public async transformStrapiEventToZohoOrder(
    rawEvent: EntryCreateEvent | EntryUpdateEvent,
  ): Promise<CreateSalesOrder> {
    const event = await orderValidation.parseAsync(rawEvent).catch((err) => {
      throw new Error(`Malformed event: ${err}`);
    });

    console.log(await this.mergeAddresses(event));

    return {
      customer_id: event.entry.zohoCustomerId,
      salesorder_number: `RP-${event.entry.orderId}-`,

      line_items: [
        {
          item_id: "116240000000203041",
        },
      ],
    };
  }

  public async createZohoOrder(
    order: CreateSalesOrder,
  ): Promise<SalesOrderReturn> {
    return await this.zoho.createSalesorder(order);
  }
}
