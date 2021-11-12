import { EntryEvent } from "@eci/events/strapi";
import { z } from "zod";
import {
  SalesOrderShortSearchOverview,
  ZohoClientInstance,
  SalesOrder,
} from "@trieb.work/zoho-ts";
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
  street2: z.string().nullable().optional(),
  shippingCosts: z.number(),
  companyName: z.string().nullable().optional(),
});
export const orderValidation = z.object({
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
  model: z.enum(["bulkorder"]),
  entry: z.object({
    id: z.number().int(),
    prefix: z.string(),
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

export type OrderEvent = EntryEvent & z.infer<typeof orderValidation>;

type CreateSalesOrder = Required<
  Pick<
    SalesOrder,
    "customer_id" | "salesorder_number" | "line_items" | "custom_fields"
  >
> &
  SalesOrder;
export class StrapiOrdersToZoho {
  private readonly zoho: ZohoClientInstance;
  private readonly logger: ILogger;

  /**
   * Used to look up tax rates only once for every product
   */
  private products: Record<
    string,
    {
      taxId: string;
      taxPercentage: number;
    }
  > = {};

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

  private async getProductTax(productId: string): Promise<{
    taxId: string;
    taxPercentage: number;
  }> {
    if (!this.products[productId]) {
      const item = await this.zoho.getItem({ product_id: productId });
      this.products[productId] = {
        taxId: item.tax_id,
        taxPercentage: item.tax_percentage,
      };
      this.logger.info("item", this.products[productId]);
    }
    return this.products[productId];
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

    const transformedOrders = [];
    for (const address of event.entry.addresses) {
      const productIds = rawEvent.entry.products.map((p) => p.product.zohoId);

      const productTaxes = [];
      for (const productId of productIds) {
        productTaxes.push(await this.getProductTax(productId));
        /**
         * Looks like this is too fast for zoho and we need a small delay
         */
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const highestTax = productTaxes.reduce(
        (acc: { taxId: string; taxPercentage: number }, tax) =>
          (acc = acc.taxPercentage > tax.taxPercentage ? acc : tax),
        { taxPercentage: 0, taxId: "" },
      );

      const orderHash = createHash("sha256")
        .update(
          JSON.stringify([
            address.address,
            address.city,
            address.country,
            address.name,
            address.surname,
            address.shippingCosts,
            address.street2,
            address.zip,
            event.entry.products,
          ]),
        )
        .digest("hex");

      transformedOrders.push({
        order: {
          customer_id: event.entry.zohoCustomerId,
          salesorder_number: address.orderId,
          line_items: event.entry.products.map((p) => ({
            item_id: p.product.zohoId,
            quantity: p.quantity,
          })),
          shipping_charge: address.shippingCosts,
          shipping_charte_tax_id: highestTax.taxId,
          // shipping_charge_tax_id: highestTax.taxId !== "" ? highestTax.taxId: undefined,
          custom_fields: [
            {
              api_name: "cf_orderhash",
              value: orderHash,
            },
          ],
        },
        address,
      });
    }
    return transformedOrders;
  }

  /**
   * Join the order_number with the address hash
   */
  private getUniqueOrderId(
    salesorderNumber: string,
    orderHash: string,
  ): string {
    return [salesorderNumber, orderHash].join("-");
  }

  public async updateBulkOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho");
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.update"]) }))
      .parseAsync(rawEvent)
      .catch((err: Error) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const searchString = [event.entry.prefix, event.entry.id].join("-");

    const existingOrders = (await this.zoho
      .searchSalesOrdersWithScrolling(searchString)
      .catch((err: Error) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      })) as (SalesOrderShortSearchOverview & { cf_orderhash: string })[];

    this.logger.info("Existing orders", { searchString, existingOrders });

    const existingSalesorderNumbers = existingOrders.map(
      (o) => o.salesorder_number,
    );

    const strapiOrders = await this.transformStrapiEventToZohoOrders(rawEvent);

    const existingOrderUIds = existingOrders.map((o) =>
      this.getUniqueOrderId(o.salesorder_number, o.cf_orderhash),
    );
    this.logger.warn("strapiOrders", { strapiOrders });
    const strapiOrderUIds = strapiOrders.map((o) =>
      this.getUniqueOrderId(
        o.order.salesorder_number,
        o.order.custom_fields.find((cf) => cf.api_name === "cf_orderhash")!
          .value! as string,
      ),
    );

    const deleteOrderNumbers = existingOrders
      .filter(
        (existingOrder) =>
          !strapiOrderUIds.includes(
            this.getUniqueOrderId(
              existingOrder.salesorder_number,
              existingOrder.cf_orderhash,
            ),
          ),
      )
      .map((o) => o.salesorder_number);

    const createOrders = strapiOrders.filter((o, i) => {
      this.logger.warn("Filtering create orders", {
        o: o.order.salesorder_number,
        existingSalesorderNumbers,
      });
      return !existingOrderUIds.includes(strapiOrderUIds[i]);
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

    const syncedOrders = await this.zoho
      .searchSalesOrdersWithScrolling(searchString)
      .catch((err: Error) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });
    const syncedOrderIds = syncedOrders.map((o) => o.salesorder_id);

    /**
     * Set status for all synced orders
     */

    switch (event.entry.status) {
      case "Sending":
        await this.zoho.salesordersConfirm(syncedOrderIds);
        await this.zoho.bulkUpdateSalesOrderCustomField(
          syncedOrderIds,
          "cf_ready_to_fulfill",
          true,
          true,
        );
        break;
      case "Confirmed":
        await this.zoho.salesordersConfirm(syncedOrderIds);
        break;

      default:
        break;
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

      const fullName = `${address.name} ${address.surname}`;
      const street2 = [address.companyName];
      if (address.street2) {
        street2.push(address.street2);
      }
      const addressId = await this.zoho
        .addAddresstoContact(
          zohoCustomerId,
          {
            attention: fullName,
            address: address.address,
            city: address.city,
            zip: address.zip.toString(),
            country: address.country,
            street2: street2.join(" - "),
          },
          3,
        )
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
    switch (event.entry.status) {
      case "Sending":
        await this.zoho.salesordersConfirm(createdOrderIds);
        await this.zoho.bulkUpdateSalesOrderCustomField(
          createdOrderIds,
          "cf_ready_to_fulfill",
          true,
          true,
        );
        break;
      case "Confirmed":
        await this.zoho.salesordersConfirm(createdOrderIds);
        break;

      default:
        break;
    }
  }
}
