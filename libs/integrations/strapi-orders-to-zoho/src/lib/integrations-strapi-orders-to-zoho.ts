import { EntryEvent } from "@eci/events/strapi";
import { z } from "zod";
import { ZohoClientInstance, SalesOrder } from "@trieb.work/zoho-ts";
import { createHash } from "crypto";
import { ILogger } from "@eci/util/logger";
const statusValidation = z.enum(["Draft", "Confirmed", "Sending", "Finished"]);

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
  private readonly zoho: ZohoClientInstance;
  private readonly logger: ILogger;
  private readonly orderPrefix = "BULK";

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
    this.logger.info("Transforming strapi event to zoho orders", { rawEvent });
    const event = await orderValidation.parseAsync(rawEvent).catch((err) => {
      throw new Error(`Malformed event: ${err}`);
    });

    return event.entry.addresses.map((address) => {
      const addressHash = createHash("sha256")
        .update(JSON.stringify(address))
        .digest("hex")
        .slice(0, 8);

      return {
        order: {
          customer_id: event.entry.zohoCustomerId,
          salesorder_number: [
            this.orderPrefix,
            event.entry.orderId,
            addressHash,
          ].join("-"),
          line_items: event.entry.products.map((p) => ({
            item_id: p.product.zohoId,
          })),
        },
        address,
      };
    });
  }

  // public async syncOrders(rawEvent: OrderEvent): Promise<void> {
  //   this.logger.info("Syncing orders between strapi and zoho");
  //   const event = await orderValidation.parseAsync(rawEvent).catch((err) => {
  //     throw new Error(`Malformed event: ${err}`);
  //   });

  //   const search = [this.orderPrefix, event.entry.orderId].join("-");
  //   this.logger.info("Searching zoho for existing orders", { search });
  //   const existingOrders = await this.zoho
  //     .searchSalesOrdersWithScrolling(search)
  //     .catch((err) => {
  //       throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
  //     });

  //   const existingSalesorderNumbers = existingOrders.map(
  //     (o) => o.salesorder_number,
  //   );

  //   const allOrders = await this.transformStrapiEventToZohoOrders(rawEvent);
  //   const newOrders = allOrders.filter(
  //     (o) => !existingSalesorderNumbers.includes(o.order.salesorder_number),
  //   );

  //   if (event.event === "entry.update") {
  //     const deletedOrderNumbers = existingSalesorderNumbers.filter(
  //       (salesorderNumber) =>
  //         !allOrders
  //           .map((o) => o.order.salesorder_number)
  //           .includes(salesorderNumber),
  //     );
  //     this.logger.info("deletedOrderNumber", { deletedOrderNumbers });
  //     for (const deletedOrderNumber of deletedOrderNumbers) {
  //       const orderId = existingOrders.find(
  //         (o) => o.salesorder_number === deletedOrderNumber,
  //       )?.salesorder_id;
  //       if (!orderId) {
  //         throw new Error(
  //           `There is no existing order with number: ${deletedOrderNumber}`,
  //         );
  //       }
  //       await this.zoho.deleteSalesorder(orderId).catch((err) => {
  //         throw new Error(`Unable to delete order: ${orderId}: ${err}`);
  //       });
  //     }

  //     /** Update the existing orders status */
  //     for (const existingOrder of existingOrders) {
  //       if (existingOrder.status === "confirmed") {
  //         if (event.entry.status !== "Sending") {
  //           await this.zoho.updateSalesorder(existingOrder.salesorder_id, {
  //             status: "draft",
  //           });
  //         }
  //       } else {
  //         if (event.entry.status === "Sending") {
  //           await this.zoho.updateSalesorder(existingOrder.salesorder_id, {
  //             status: "confirmed",
  //           });
  //         }
  //       }
  //     }
  //   }

  //   for (const { order, address } of newOrders) {
  //     // order.status = event.entry.status === "Sending" ? "confirmed" : "draft";
  //     this.logger.info("Adding new address to contact", {
  //       address,
  //       contact: event.entry.zohoCustomerId,
  //     });

  //     const addressId = await this.zoho
  //       .addAddresstoContact(event.entry.zohoCustomerId, {
  //         address: address.address,
  //         city: address.city,
  //         zip: address.zip.toString(),
  //         country: address.country,
  //       })
  //       .catch((err) => {
  //         throw new Error(`Unable to add address to contact: ${err}`);
  //       });
  //     this.logger.info("Adding new order", {
  //       order,
  //     });
  //     await this.zoho
  //       .createSalesorder({
  //         ...order,
  //         billing_address_id: addressId,
  //       })
  //       .catch((err) => {
  //         throw new Error(
  //           `Unable to create sales order: ${JSON.stringify(
  //             {
  //               ...order,
  //               billing_address_id: addressId,
  //             },
  //             null,
  //             2,
  //           )}, Error: ${err}`,
  //         );
  //       });
  //   }
  //   if (event.entry.status === "Sending") {
  //     await this.confirmOrders(search);
  //   }
  // }

  public async updateBulkOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho");
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.update"]) }))
      .parseAsync(rawEvent)
      .catch((err) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const search = [this.orderPrefix, event.entry.orderId].join("-");
    this.logger.info("Searching zoho for existing orders", { search });
    const existingOrders = await this.zoho
      .searchSalesOrdersWithScrolling(search)
      .catch((err) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });

    const existingSalesorderNumbers = existingOrders.map(
      (o) => o.salesorder_number,
    );

    const allOrders = await this.transformStrapiEventToZohoOrders(rawEvent);
    const newOrders = allOrders.filter(
      (o) => !existingSalesorderNumbers.includes(o.order.salesorder_number),
    );

    const deletedOrderNumbers = existingSalesorderNumbers.filter(
      (salesorderNumber) =>
        !allOrders
          .map((o) => o.order.salesorder_number)
          .includes(salesorderNumber),
    );
    this.logger.info("deletedOrderNumber", { deletedOrderNumbers });
    for (const deletedOrderNumber of deletedOrderNumbers) {
      const orderId = existingOrders.find(
        (o) => o.salesorder_number === deletedOrderNumber,
      )?.salesorder_id;
      if (!orderId) {
        throw new Error(
          `There is no existing order with number: ${deletedOrderNumber}`,
        );
      }
      await this.zoho.deleteSalesorder(orderId).catch((err) => {
        throw new Error(`Unable to delete order: ${orderId}: ${err}`);
      });
    }

    /** Update the existing orders status */
    for (const existingOrder of existingOrders) {
      if (existingOrder.status === "confirmed") {
        if (event.entry.status !== "Sending") {
          await this.zoho.updateSalesorder(existingOrder.salesorder_id, {
            status: "draft",
          });
        }
      } else {
        if (event.entry.status === "Sending") {
          await this.zoho.updateSalesorder(existingOrder.salesorder_id, {
            status: "confirmed",
          });
        }
      }
    }

    for (const { order, address } of newOrders) {
      // order.status = event.entry.status === "Sending" ? "confirmed" : "draft";
      this.logger.info("Adding new address to contact", {
        address,
        contact: event.entry.zohoCustomerId,
      });

      const addressId = await this.zoho
        .addAddresstoContact(event.entry.zohoCustomerId, {
          address: address.address,
          city: address.city,
          zip: address.zip.toString(),
          country: address.country,
        })
        .catch((err) => {
          throw new Error(`Unable to add address to contact: ${err}`);
        });
      this.logger.info("Adding new order", {
        order,
      });
      await this.zoho
        .createSalesorder({
          ...order,
          billing_address_id: addressId,
        })
        .catch((err) => {
          throw new Error(
            `Unable to create sales order: ${JSON.stringify(
              {
                ...order,
                billing_address_id: addressId,
              },
              null,
              2,
            )}, Error: ${err}`,
          );
        });
    }
    if (event.entry.status === "Sending") {
      await this.confirmOrders(search);
    }
  }

  public async createNewBulkOrders(rawEvent: OrderEvent): Promise<void> {
    this.logger.info("Syncing orders between strapi and zoho");
    const event = await orderValidation
      .merge(z.object({ event: z.enum(["entry.create"]) }))
      .parseAsync(rawEvent)
      .catch((err) => {
        throw new Error(`Malformed event: ${err}`);
      });

    const orders = await this.transformStrapiEventToZohoOrders(rawEvent);

    for (const { order, address } of orders) {
      this.logger.info("Adding new address to contact", {
        address,
        contact: event.entry.zohoCustomerId,
      });

      const addressId = await this.zoho
        .addAddresstoContact(event.entry.zohoCustomerId, {
          address: address.address,
          city: address.city,
          zip: address.zip.toString(),
          country: address.country,
        })
        .catch((err) => {
          throw new Error(`Unable to add address to contact: ${err}`);
        });
      this.logger.info("Adding new order", {
        order,
      });
      const createdSalesorder = await this.zoho
        .createSalesorder({
          ...order,
          billing_address_id: addressId,
        })
        .catch((err) => {
          throw new Error(
            `Unable to create sales order: ${JSON.stringify(
              {
                ...order,
                billing_address_id: addressId,
              },
              null,
              2,
            )}, Error: ${err}`,
          );
        });
      if (event.entry.status === "Sending") {
        this.zoho.salesorderConfirm(createdSalesorder.salesorder_id);
      }
    }
  }

  /**
   * Load all available orders by search string and mark them as confirmed
   */
  private async confirmOrders(search: string): Promise<void> {
    const existingOrders = await this.zoho
      .searchSalesOrdersWithScrolling(search)
      .catch((err) => {
        throw new Error(`Unable to fetch existing orders from zoho: ${err}`);
      });
    for (const order of existingOrders) {
      if (order.status !== "confirmed") {
        await this.zoho.salesorderConfirm(order.salesorder_id);
      }
    }
  }
}
