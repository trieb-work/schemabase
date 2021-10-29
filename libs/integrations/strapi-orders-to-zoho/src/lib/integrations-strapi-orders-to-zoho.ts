import { EntryEvent } from "@eci/events/strapi";
import { z } from "zod";
import { ZohoClientInstance, SalesOrder } from "@trieb.work/zoho-ts";
import { createHash } from "crypto";
import { ILogger } from "@eci/util/logger";
const statusValidation = z.enum(["Draft", "Confirmed", "Sending", "Finished"]);

export const addressValidation = z.object({
  orderId: z.string(),
  name: z.string(),
  surname: z.string(),
  address: z.string(),
  zip: z.string(),
  city: z.string(),
  country: z.string(),
});
export const orderValidation = z.object({
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
  model: z.enum(["bulkorder"]),
  entry: z.object({
    addresses: z.array(addressValidation),
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

export class PrefixedOrderId {
  public prefix: string;
  public orderId: string;
  public rowId: string;
  public hash: string | undefined;

  /**
   *
   * @param id The id is separated by `-`
   */
  constructor(id: string) {
    const split = id.split("-");

    if (split.length !== 3 && split.length !== 4) {
      throw new Error(`id is malformed: ${id}`);
    }
    [this.prefix, this.orderId, this.rowId, this.hash] = split;
  }

  public get searchFragment(): string {
    return [this.prefix, this.orderId].join("-");
  }
  public toString(withHash?: boolean): string {
    const arr = [this.prefix, this.orderId, this.rowId];
    if (withHash && this.hash) {
      arr.push(this.hash);
    }
    return arr.join("-");
  }
}

export type OrderEvent = EntryEvent & z.infer<typeof orderValidation>;

type CreateSalesOrder = Required<
  Pick<SalesOrder, "customer_id" | "salesorder_number" | "line_items">
> &
  SalesOrder;
export class StrapiOrdersToZoho {
  private readonly zoho: ZohoClientInstance;
  private readonly logger: ILogger;

  private constructor(config: { zoho: ZohoClientInstance; logger: ILogger }) {
    this.zoho = config.zoho;
    this.logger = config.logger;
  }

  public static async new(config: {
    zoho: ZohoClientInstance;
    logger: ILogger;
  }): Promise<StrapiOrdersToZoho> {
    const instance = new StrapiOrdersToZoho(config);
    await instance.zoho.authenticate();

    return instance;
  }

  /**
   * Transform a strapi event into a zoho sales order type
   */
  private async transformStrapiEventToZohoOrders(
    rawEvent: OrderEvent,
  ): Promise<
    { order: CreateSalesOrder; address: z.infer<typeof addressValidation> }[]
  > {
    const event = await orderValidation
      .parseAsync(rawEvent)
      .catch((err: Error) => {
        throw new Error(`Malformed event: ${err}`);
      });

    return event.entry.addresses.map((address) => {
      const orderId = new PrefixedOrderId(address.orderId);
      orderId.hash = createHash("sha256")
        .update(
          JSON.stringify({
            /**
             * The rowId should not affect the hash.
             */
            address: {
              ...address,
              orderId: undefined,
            },
            products: event.entry.products,
          }),
        )
        .digest("hex")
        .slice(0, 8);

      return {
        order: {
          customer_id: event.entry.zohoCustomerId,
          salesorder_number: orderId.toString(true),
          line_items: event.entry.products.map((p) => ({
            item_id: p.product.zohoId,
            quantity: p.quantity,
          })),
        },
        address,
      };
    });
  }

  public async updateBulkOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho");
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.update"]) }))
      .parseAsync(rawEvent)
      .catch((err: Error) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const searchString = new PrefixedOrderId(event.entry.addresses[0].orderId)
      .searchFragment;
    this.logger.warn("SearchString", { searchString });

    const existingOrders = await this.zoho
      .searchSalesOrdersWithScrolling(searchString)
      .catch((err: Error) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });
    this.logger.info("Existing orders", { searchString, existingOrders });

    const existingSalesorderNumbers = existingOrders.map(
      (o) => o.salesorder_number,
    );

    const strapiOrders = await this.transformStrapiEventToZohoOrders(rawEvent);

    const deleteOrderNumbers = existingSalesorderNumbers.filter(
      (o) => !strapiOrders.map((o) => o.order.salesorder_number).includes(o),
    );

    const createOrders = strapiOrders.filter((o) => {
      this.logger.warn("Filtering create orders", {
        o: o.order.salesorder_number,
        existingSalesorderNumbers,
      });
      return !existingSalesorderNumbers.includes(o.order.salesorder_number);
    });

    /**
     * Deleting orders that are no longer present in strpai
     */

    if (deleteOrderNumbers.length > 0) {
      this.logger.info("Orders must be deleted", { deleteOrderNumbers });
      for (const deletedOrderNumber of deleteOrderNumbers) {
        const bulkOrderId = existingOrders.find(
          (o) => o.salesorder_number === deletedOrderNumber,
        )?.salesorder_id;
        if (!bulkOrderId) {
          throw new Error(
            `There is no existing order with number: ${deletedOrderNumber}`,
          );
        }
        await this.zoho.deleteSalesorder(bulkOrderId).catch((err: Error) => {
          throw new Error(`Unable to delete order: ${bulkOrderId}: ${err}`);
        });
      }
    }

    /**
     * Handle new orders
     */
    if (createOrders.length > 0) {
      this.logger.info("New orders need to be created", { createOrders });
      await this.addNewOrders(event.entry.zohoCustomerId, createOrders);
    }

    /**
     * Set status for all synced orders
     */
    if (event.entry.status === "Sending") {
      const syncedOrders = await this.zoho
        .searchSalesOrdersWithScrolling(searchString)
        .catch((err: Error) => {
          throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
        });

      await this.zoho.salesordersConfirm(
        syncedOrders.map((o) => o.salesorder_id),
      );
    }
  }
  /**
   *
   * @param zohoCustomerId
   * @param orders
   * @returns The order_ids of the newly created orders
   */
  private async addNewOrders(
    zohoCustomerId: string,
    orders: {
      order: CreateSalesOrder;
      address: z.infer<typeof addressValidation>;
    }[],
  ): Promise<string[]> {
    const bulkOrderIds: string[] = [];

    for (const { order, address } of orders) {
      this.logger.info("Adding new address to contact", {
        address,
        contact: zohoCustomerId,
      });

      const addressId = await this.zoho
        .addAddresstoContact(zohoCustomerId, {
          address: address.address,
          city: address.city,
          zip: address.zip.toString(),
          country: address.country,
        })
        .catch((err: Error) => {
          throw new Error(`Unable to add address to contact: ${err}`);
        });
      this.logger.info("Adding new order", {
        order,
      });
      const res = await this.zoho
        .createSalesorder({
          ...order,
          shipping_address_id: addressId,
        })
        .catch((err: Error) => {
          // if (err.message.includes("This sales order number already exists")) {
          //   this.logger.warn(err.message);
          // } else {
          throw new Error(
            `Unable to create sales order: ${JSON.stringify(
              {
                ...order,
                shipping_address_id: addressId,
              },
              null,
              2,
            )}, Error: ${err}`,
          );
          // }
        });
      if (res?.salesorder_id) {
        bulkOrderIds.push(res.salesorder_id);
      }
    }
    return bulkOrderIds;
  }

  public async createNewBulkOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho");
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.create"]) }))
      .parseAsync(rawEvent)
      .catch((err: Error) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const orders = await this.transformStrapiEventToZohoOrders(rawEvent);

    const createdOrderIds = await this.addNewOrders(
      event.entry.zohoCustomerId,
      orders,
    );
    if (event.entry.status === "Sending") {
      await this.zoho.salesordersConfirm(createdOrderIds);
    }
  }
}
