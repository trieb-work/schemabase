import { EntryEvent } from "./types";
import { z } from "zod";
import { Zoho, CreateSalesOrder } from "@trieb.work/zoho-ts/dist/v2";
import { sha256 } from "@eci/pkg/hash";

import { ILogger } from "@eci/pkg/logger";
const statusValidation = z.enum([
  "Draft",
  "Confirmed",
  "ReadyToFulfill",
  "Finished",
]);

export const productValidation = z.object({
  product: z.object({
    zohoId: z.string(),
  }),
  quantity: z.number().int().positive(),
  price: z.number().nullish(),
});

export const addressValidation = z.object({
  orderId: z.string(),
  name: z.string(),
  surname: z.string(),
  address: z.string(),
  zip: z.string(),
  city: z.string(),
  country: z.string(),
  street2: z.string().nullish(),
  shippingCosts: z.number(),
  companyName: z.string().nullish(),
  products: z.array(productValidation).nullish(),
});
export const orderValidation = z.object({
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
  model: z.enum(["bulkorder"]),
  entry: z.object({
    id: z.number().int(),
    prefix: z.string(),
    addresses: z.array(addressValidation),
    status: statusValidation,
    terminationDate: z.string().nullish(),
    zohoCustomerId: z.string(),
    products: z.array(productValidation),
  }),
});

export type OrderEvent = EntryEvent & z.infer<typeof orderValidation>;

export class StrapiOrdersToZoho {
  private readonly zoho: Zoho;

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

  constructor(config: { zoho: Zoho; logger: ILogger }) {
    this.zoho = config.zoho;
    this.logger = config.logger;
  }

  private async getProductTax(productId: string): Promise<{
    taxId: string;
    taxPercentage: number;
  }> {
    if (!this.products[productId]) {
      const item = await this.zoho.item.retrieve(productId);
      this.products[productId] = {
        taxId: item.tax_id,
        taxPercentage: item.tax_percentage,
      };
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

    const transformedOrders: {
      order: CreateSalesOrder;
      address: OrderEvent["entry"]["addresses"][0];
    }[] = [];
    for (const address of event.entry.addresses) {
      const products =
        address.products && address.products.length > 0
          ? address.products
          : rawEvent.entry.products;
      const productIds = products.map((p) => p.product.zohoId);

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

      const orderHash = sha256([
        address.address,
        address.city,
        address.country,
        address.name,
        address.surname,
        address.shippingCosts,
        address.street2,
        address.zip,
        products,
        event.entry.terminationDate,
      ]);
      transformedOrders.push({
        order: {
          customer_id: event.entry.zohoCustomerId,
          salesorder_number: address.orderId,
          shipment_date: event.entry.terminationDate || "",
          line_items: products.map((p) => {
            const item: { item_id: string; quantity: number; rate?: number } = {
              item_id: p.product.zohoId,
              quantity: p.quantity,
            };
            if (typeof p.price === "number") {
              item.rate = p.price;
            }
            return item;
          }),
          shipping_charge: address.shippingCosts,
          shipping_charge_tax_id: highestTax.taxId,

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
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.update"]) }))
      .parseAsync(rawEvent)
      .catch((err: Error) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const searchString = [event.entry.prefix, event.entry.id].join("-");

    const existingOrders = await this.zoho.salesOrder
      .search(searchString)
      .catch((err: Error) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });

    this.logger.debug("Existing orders", { searchString, existingOrders });

    const existingSalesorderNumbers = existingOrders.map(
      (o) => o.salesorder_number,
    );

    const strapiOrders = await this.transformStrapiEventToZohoOrders(rawEvent);

    const existingOrderUIds = existingOrders.map((o) =>
      this.getUniqueOrderId(o.salesorder_number, o["cf_orderhash"] as string),
    );
    this.logger.debug("strapiOrders", { strapiOrders });
    const strapiOrderUIds = strapiOrders.map((o) =>
      this.getUniqueOrderId(
        o.order.salesorder_number,
        (o.order.custom_fields ?? []).find(
          (cf) => cf.api_name === "cf_orderhash",
        )!.value! as string,
      ),
    );

    const deleteOrderNumbers = existingOrders
      .filter(
        (existingOrder) =>
          !strapiOrderUIds.includes(
            this.getUniqueOrderId(
              existingOrder.salesorder_number,
              existingOrder["cf_orderhash"] as string,
            ),
          ),
      )
      .map((o) => o.salesorder_number);

    const createOrders = strapiOrders.filter((o, i) => {
      this.logger.debug("Filtering create orders", {
        o: o.order.salesorder_number,
        existingSalesorderNumbers,
      });
      return !existingOrderUIds.includes(strapiOrderUIds[i]);
    });

    /**
     * Deleting orders that are no longer present in strpai
     */
    if (deleteOrderNumbers.length > 0) {
      this.logger.debug("Orders must be deleted", { deleteOrderNumbers });
      for (const deletedOrderNumber of deleteOrderNumbers) {
        const bulkOrderId = existingOrders.find(
          (o) => o.salesorder_number === deletedOrderNumber,
        )?.salesorder_id;
        if (!bulkOrderId) {
          throw new Error(
            `There is no existing order with number: ${deletedOrderNumber}`,
          );
        }
        await this.zoho.salesOrder.delete([bulkOrderId]).catch((err: Error) => {
          throw new Error(`Unable to delete order: ${bulkOrderId}: ${err}`);
        });
      }
    }

    /**
     * Handle new orders
     */
    if (createOrders.length > 0) {
      this.logger.debug("New orders need to be created", { createOrders });
      await this.addNewOrders(event.entry.zohoCustomerId, createOrders);
    }

    const syncedOrders = await this.zoho.salesOrder
      .search(searchString)
      .catch((err: Error) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });
    const syncedOrderIds = syncedOrders.map((o) => o.salesorder_id);

    /**
     * Set status for all synced orders
     */

    switch (event.entry.status) {
      case "ReadyToFulfill":
        await this.zoho.salesOrder.confirm(syncedOrderIds);
        await this.zoho.salesOrder.setCustomFieldValue({
          salesOrderIds: syncedOrderIds,
          customFieldName: "cf_ready_to_fulfill",
          value: true,
        });
        break;
      case "Confirmed":
        await this.zoho.salesOrder.confirm(syncedOrderIds);
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
      this.logger.debug("Adding new address to contact", {
        address,
        contact: zohoCustomerId,
      });

      const fullName = `${address.name} ${address.surname}`;
      const street2 = [address.companyName];
      if (address.street2) {
        street2.push(address.street2);
      }
      /**
       * Check if an address is already added to the customer
       */

      const contact = await this.zoho.contact.retrieve(zohoCustomerId);
      if (!contact) {
        throw new Error(`Contact was not found: ${zohoCustomerId}`);
      }

      this.logger.debug("Addresses", { addresses: contact.addresses });
      const existingAddresses = contact.addresses.map((a) => ({
        id: a.address_id,
        hash: sha256({
          attention: a.attention,
          address: a.address,
          street2: a.street2,
          city: a.city,
          zip: a.zip,
          country: a.country,
        }),
      }));

      const createAddress = {
        attention: fullName,
        address: address.address,
        street2: street2.join(" - "),
        city: address.city,
        zip: address.zip.toString(),
        country: address.country,
      };
      const createAddressHash = sha256(createAddress);

      let addressId = existingAddresses.find(
        (a) => a.hash === createAddressHash,
      )?.id;

      if (!addressId) {
        addressId = await this.zoho.contact
          .addAddress(zohoCustomerId, createAddress)
          .catch((err: Error) => {
            throw new Error(`Unable to add address to contact: ${err}`);
          });
        this.logger.debug("Adding new order", {
          order,
        });
      }
      const res = await this.zoho.salesOrder
        .create({
          ...order,
          shipping_address_id: addressId,
        })
        .catch((err: Error) => {
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
    this.logger.debug("Syncing orders between strapi and zoho");
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
      case "ReadyToFulfill":
        await this.zoho.salesOrder.confirm(createdOrderIds);
        await this.zoho.salesOrder.setCustomFieldValue({
          customFieldName: "cf_ready_to_fulfill",
          salesOrderIds: createdOrderIds,
          value: true,
        });
        break;
      case "Confirmed":
        await this.zoho.salesOrder.confirm(createdOrderIds);
        break;

      default:
        break;
    }
  }
}
