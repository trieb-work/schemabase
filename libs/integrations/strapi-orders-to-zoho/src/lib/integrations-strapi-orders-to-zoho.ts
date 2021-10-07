import { EntryEvent } from "@eci/events/strapi";
import { z } from "zod";
import { ZohoClientInstance, SalesOrder } from "@trieb.work/zoho-ts";
import { createHash } from "crypto";
import csvToJson from "csvtojson";
import { ILogger } from "@eci/util/logger";
const statusValidation = z.enum(["Draft", "Confirmed"]);

const addressValidation = z.object({
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  address: z.string(),
  zip: z.number().int().positive(),
  city: z.string(),
  country: z.string(),
});
const orderValidation = z.object({
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
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
        product: z.object({
          zohoId: z.string(),
        }),
        quantity: z.number().int().positive(),
      }),
    ),
  }),
});

export type OrderEvent = EntryEvent & z.infer<typeof orderValidation>;

type CreateSalesOrder = Required<
  Pick<SalesOrder, "customer_id" | "salesorder_number" | "line_items">
> &
  SalesOrder;
export class StrapiOrdersToZoho {
  private readonly strapiBaseUrl: string;
  private readonly zoho: ZohoClientInstance;
  private readonly logger: ILogger;

  private constructor(config: {
    zoho: ZohoClientInstance;
    strapiBaseUrl: string;
    logger: ILogger;
  }) {
    this.zoho = config.zoho;
    this.strapiBaseUrl = config.strapiBaseUrl;
    this.logger = config.logger;
  }

  public static async new(config: {
    zoho: ZohoClientInstance;
    strapiBaseUrl: string;
    logger: ILogger;
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

    this.logger.info("Merging addresses from .csv");
    const url = `${this.strapiBaseUrl}${entry.addressCSV.url}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Unable to get addresses from strapi: ${url} `);
    }
    let json = await csvToJson().fromString(await res.text());
    json = json.map((row) => ({
      ...row,
      zip: parseInt(row.zip),
    }));

    const addresses = await z
      .array(addressValidation)
      .parseAsync(json)
      .catch((err) => {
        throw new Error(`addresses csv is invalid: ${err}`);
      });

    return [...addresses, ...entry.addresses];
  }

  /**
   * Transform a strapi event into a zoho sales order type
   */
  private async transformStrapiEventToZohoOrders(
    rawEvent: OrderEvent,
  ): Promise<
    { order: CreateSalesOrder; address: z.infer<typeof addressValidation> }[]
  > {
    this.logger.info("Transforming strapi event to zoho orders", { rawEvent });
    const event = await orderValidation.parseAsync(rawEvent).catch((err) => {
      throw new Error(`Malformed event: ${err}`);
    });

    const addresses = await this.mergeAddresses(event);
    return addresses.map((address) => {
      const addressHash = createHash("sha256")
        .update(JSON.stringify(address))
        .digest("hex")
        .slice(0, 8);

      return {
        order: {
          customer_id: event.entry.zohoCustomerId,
          salesorder_number: ["RP", event.entry.orderId, addressHash].join("-"),
          line_items: event.entry.products.map((p) => ({
            item_id: p.product.zohoId,
          })),
        },
        address,
      };
    });
  }

  public async syncOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho", { rawEvent });
    const event = await orderValidation.parseAsync(rawEvent).catch((err) => {
      throw new Error(`Malformed event: ${err}`);
    });

    const existingOrders = await this.zoho
      .searchSalesOrdersWithScrolling(["RP", event.entry.orderId].join("-"))
      .catch((err) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });

    this.logger.info("Existing orders in zoho", { existingOrders });
    const existingSalesorderNumbers = existingOrders.map(
      (o) => o.salesorder_number,
    );

    const allOrders = await this.transformStrapiEventToZohoOrders(rawEvent);
    const newOrders = allOrders.filter(
      (o) => !existingSalesorderNumbers.includes(o.order.salesorder_number),
    );

    for (const { order, address } of newOrders) {
      this.logger.info("Creating new order in zoho", { order, address });

      const addressId = await this.zoho.addAddresstoContact(
        event.entry.zohoCustomerId,
        {
          address: address.address,
          city: address.city,
          zip: address.zip.toString(),
          country: address.country,
        },
      );
      await this.zoho.createSalesorder({
        ...order,
        billing_address_id: addressId,
      });
    }
  }
}
