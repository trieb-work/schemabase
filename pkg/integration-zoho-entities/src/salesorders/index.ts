/* eslint-disable max-len */
import {
  CreateSalesOrder,
  CustomField,
  SalesOrder,
  Zoho,
  ZohoApiError,
} from "@trieb.work/zoho-ts";

import { ILogger } from "@eci/pkg/logger";
import {
  Language,
  OrderInvoiceStatus,
  OrderShipmentStatus,
  OrderStatus,
  Prisma,
  PrismaClient,
  ZohoApp,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { addMinutes, format, isAfter, subHours, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { CustomFieldApiName } from "@eci/pkg/zoho-custom-fields/src/registry";
import addresses from "@eci/pkg/integration-zoho-entities/src/addresses";
import { calculateDiscount, orderToZohoLineItems } from "./lineItems";
import { orderToMainContactPerson } from "./contacts";
import { addressToZohoAddressId } from "./address";
import { taxToZohoTaxId } from "./taxes";
import { Warning } from "../utils";
import {
  SalesOrderShippedStatus,
  SalesOrderStatus,
} from "@trieb.work/zoho-ts/dist/types/salesOrder";
import { shippingMethodMatch } from "@eci/pkg/miscHelper/shippingMethodMatch";
import { sleep } from "@eci/pkg/miscHelper/time";

export interface ZohoSalesOrdersSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
  /**
   * Time offset in Minutes between creation and execution before this Entity will get synced.
   */
  createdTimeOffset: number;
}

export class ZohoSalesOrdersSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly createdTimeOffsetMin: number;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly cronState: CronStateHandler;

  private readonly tenantId: string;

  public parseLanguage(language: string | undefined): Language | undefined {
    if (!language) {
      return undefined;
    }
    switch (language.toLowerCase()) {
      case "en":
        return Language.EN;
      case "de":
        return Language.DE;
      default:
        return undefined;
    }
  }

  /**
   * Maps the Zoho SalesOrder status to our internal status
   * @param zohoStatus
   * @returns OrderStatus
   */
  public parserOrderStatus(zohoStatus: SalesOrderStatus) {
    switch (zohoStatus) {
      case "void":
        return OrderStatus.canceled;
      case "confirmed":
        return OrderStatus.confirmed;
      default:
        return OrderStatus.draft;
    }
  }

  public parseShipmentStatus(zohoStatus: SalesOrderShippedStatus) {
    switch (zohoStatus) {
      case "shipped":
        return OrderShipmentStatus.shipped;
      case "fulfilled":
        return OrderShipmentStatus.delivered;
      default:
        return undefined;
    }
  }

  /**
   * Brings the zoho invoiced schema to our internal schema
   * @param zohoStatus
   * @returns
   */
  public parseInvoiceStatus(
    zohoStatus: string,
  ): OrderInvoiceStatus | undefined {
    switch (zohoStatus) {
      case "not_invoiced":
        return OrderInvoiceStatus.notInvoiced;
      case "invoiced":
        return OrderInvoiceStatus.invoiced;
      default:
        return undefined;
    }
  }

  public parseSalesOrderStatus(
    zohoStatus: SalesOrderStatus,
  ): OrderStatus | undefined {
    switch (zohoStatus) {
      case "confirmed":
        return OrderStatus.confirmed;
      case "closed":
        return OrderStatus.confirmed;
      default:
        return undefined;
    }
  }

  public constructor(config: ZohoSalesOrdersSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.createdTimeOffsetMin = config.createdTimeOffset;
    this.tenantId = this.zohoApp.tenantId;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "salesorders",
    });
  }

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    let gteDate: Date;

    if (cronState.lastRun === null) {
      gteDate = subYears(now, 2);
      this.logger.info(
        `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
      );
    } else {
      gteDate = subHours(cronState.lastRun, 1);
      this.logger.info(`Setting GTE date to ${gteDate}`);
    }

    /**
     * All salesorder as overview. Using last modified time to get most reason changes
     */
    const salesorders = await this.zoho.salesOrder.list({
      sortColumn: "last_modified_time",
      sortOrder: "descending",
      lastModifiedTime: gteDate,
    });

    this.logger.info(
      `We have ${salesorders.length} salesorders that changed since last sync run.`,
    );
    if (salesorders.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const salesorder of salesorders) {
      // We first have to check, if we already have a Zoho Customer to be connected to
      // this salesorder
      const zohoCustomerExist = await this.db.zohoContact.findUnique({
        where: {
          id_zohoAppId: {
            id: salesorder.customer_id,
            zohoAppId: this.zohoApp.id,
          },
        },
      });
      if (zohoCustomerExist) {
        this.logger.info(
          // eslint-disable-next-line max-len
          `ZohoContact ${zohoCustomerExist.id} is related to ZohoSalesOrder ${salesorder.salesorder_id} - Order Number ${salesorder.salesorder_number}`,
        );
      } else {
        this.logger.info(
          // eslint-disable-next-line max-len
          `No internal contact found for zoho salesorder id ${salesorder.salesorder_id} - Order Number ${salesorder.salesorder_number}`,
        );
      }

      /**
       * The preferred user language can be set as custom field for the salesorder
       */
      const language = this.parseLanguage(
        (salesorder?.[CustomFieldApiName.PREFERRED_LANGUAGE] as string) ??
          undefined,
      );

      const invoiceStatus = this.parseInvoiceStatus(
        salesorder.invoiced_status as string,
      );
      const salesOrderStatus = this.parseSalesOrderStatus(
        salesorder.order_status,
      );

      const carrier = shippingMethodMatch(salesorder.delivery_method as string);

      const readyToFullfill =
        (salesorder?.cf_ready_to_fulfill_unformatted as boolean) || false;

      const customerNote = this.zohoApp.customFieldCustomerNote
        ? (salesorder?.[this.zohoApp.customFieldCustomerNote] as string)
        : undefined;

      if (!salesorder.email) {
        this.logger.error(
          `Salesorder ${salesorder.salesorder_number} - ${salesorder.salesorder_id} has no related email address. Can't sync`,
        );
        continue;
      }

      const fullyShipped = salesorder.shipped_status === "shipped" ?? false;
      if (fullyShipped)
        this.logger.info(
          `Order ${salesorder.salesorder_number} is in status fully shipped in Zoho. Setting this in ECI DB`,
        );
      // Connect or create the internal contact using the email address
      // connected with this salesorder
      const contactConnectOrCreate = {
        connectOrCreate: {
          where: {
            email_tenantId: {
              email: salesorder.email.toLowerCase(),
              tenantId: this.tenantId,
            },
          },
          create: {
            id: id.id("contact"),
            email: salesorder.email.toLowerCase(),
            tenant: {
              connect: {
                id: this.tenantId,
              },
            },
          },
        },
      };

      // Create or connect the internal order using the salesorder number as identifier
      const orderCreateOrConnect: Prisma.OrderUpdateOneRequiredWithoutZohoSalesOrdersNestedInput =
        {
          connectOrCreate: {
            where: {
              orderNumber_tenantId: {
                orderNumber: salesorder.salesorder_number,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("order"),
              orderNumber: salesorder.salesorder_number,
              date: new Date(salesorder.date),
              expectedShippingDate: new Date(salesorder.shipment_date),
              carrier,
              totalPriceGross: salesorder.total,
              invoiceStatus,
              orderStatus: salesOrderStatus,
              mainContact: contactConnectOrCreate,
              readyToFullfill,
              customerNote,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
              language,
            },
          },
        };
      const zohoContactConnect: Prisma.ZohoContactCreateNestedOneWithoutZohoSalesOrderInput =
        zohoCustomerExist
          ? {
              connect: {
                id_zohoAppId: {
                  id: salesorder.customer_id,
                  zohoAppId: this.zohoApp.id,
                },
              },
            }
          : {};

      const lastModifiedDateBeforeUpsert =
        await this.db.zohoSalesOrder.findUnique({
          where: {
            id_zohoAppId: {
              id: salesorder.salesorder_id,
              zohoAppId: this.zohoApp.id,
            },
          },
          select: {
            updatedAt: true,
          },
        });
      const createdSalesOrder = await this.db.zohoSalesOrder.upsert({
        where: {
          id_zohoAppId: {
            id: salesorder.salesorder_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: salesorder.salesorder_id,
          createdAt: new Date(salesorder.created_time),
          updatedAt: new Date(salesorder.last_modified_time),
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          order: orderCreateOrConnect,
          zohoContact: zohoContactConnect,
        },
        update: {
          createdAt: new Date(salesorder.created_time),
          updatedAt: new Date(salesorder.last_modified_time),
          order: {
            update: {
              date: new Date(salesorder.date),
              expectedShippingDate: new Date(salesorder.shipment_date),
              customerNote,
              carrier,
              shipmentStatus: this.parseShipmentStatus(
                salesorder.shipped_status,
              ),
              mainContact: contactConnectOrCreate,
              readyToFullfill,
              invoiceStatus,
              orderStatus: salesOrderStatus,
            },
          },
          zohoContact: zohoContactConnect,
        },
        select: {
          orderId: true,
          order: {
            select: {
              billingAddressId: true,
              shippingAddress: true,
              mainContactId: true,
              orderLineItems: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });

      /**
       * ECI internal Order ID
       */
      const internalOrderId = createdSalesOrder.orderId;
      if (!internalOrderId)
        throw new Error(
          `No order id returned for ${salesorder.salesorder_id} - this should never happen!`,
        );

      // LINE ITEMs and addresses sync - pulls the full salesorder from Zoho only
      // if something has changed or if we don't have any line items internally
      if (
        !lastModifiedDateBeforeUpsert?.updatedAt ||
        isAfter(
          new Date(salesorder.last_modified_time),
          lastModifiedDateBeforeUpsert.updatedAt,
        )
      ) {
        this.logger.info(
          // eslint-disable-next-line max-len
          `Pulling full salesorder ${salesorder.salesorder_id} from Zoho - ${salesorder.salesorder_number}`,
        );
        const fullSalesorder = await this.zoho.salesOrder.get(
          salesorder.salesorder_id,
        );

        if (!fullSalesorder) {
          this.logger.error(
            `No data returned from Zoho for SalesOrder ${salesorder.salesorder_id}`,
          );
          continue;
        }
        if (!fullSalesorder.line_items) {
          this.logger.error(
            `No line items for SalesOrder ${salesorder.salesorder_id}`,
          );
          continue;
        }
        const lineItems = fullSalesorder.line_items;

        // Line Items logic
        try {
          /**
           * The order line item ids that are currently correct
           */
          const allEciOrderLineItems: { id: string }[] = [];

          for (const lineItem of lineItems) {
            const uniqueString = uniqueStringOrderLine(
              salesorder.salesorder_number,
              lineItem.sku,
              lineItem.quantity,
            );

            // Lookup of the product variant SKU in our internal DB
            const productVariantLookup =
              await this.db.productVariant.findUnique({
                where: {
                  sku_tenantId: {
                    sku: lineItem.sku,
                    tenantId: this.tenantId,
                  },
                },
              });
            if (!productVariantLookup) {
              this.logger.warn(
                // eslint-disable-next-line max-len
                `No internal product variant found for SKU ${lineItem.sku}! Can't process this line item`,
              );
              continue;
            }

            const upsertedLineItem = await this.db.zohoOrderLineItem.upsert({
              where: {
                id_zohoAppId: {
                  id: lineItem.line_item_id,
                  zohoAppId: this.zohoApp.id,
                },
              },
              create: {
                id: lineItem.line_item_id,
                orderLineItem: {
                  connectOrCreate: {
                    where: {
                      uniqueString_tenantId: {
                        uniqueString,
                        tenantId: this.tenantId,
                      },
                    },
                    create: {
                      id: id.id("lineItem"),
                      uniqueString,
                      order: {
                        connect: {
                          id: internalOrderId,
                        },
                      },
                      quantity: lineItem.quantity,
                      discountValueNet: lineItem.discount_amount,
                      tax: {
                        connect: {
                          percentage_tenantId: {
                            tenantId: this.tenantId,
                            percentage: lineItem.tax_percentage,
                          },
                        },
                      },
                      totalPriceNet: lineItem.item_total,
                      totalPriceGross: lineItem.item_total_inclusive_of_tax,
                      undiscountedUnitPriceGross:
                        fullSalesorder.is_inclusive_tax
                          ? lineItem.rate
                          : undefined,
                      undiscountedUnitPriceNet: fullSalesorder.is_inclusive_tax
                        ? undefined
                        : lineItem.rate,
                      // warehouse: warehouseConnect,
                      productVariant: {
                        connect: {
                          id: productVariantLookup.id,
                        },
                      },
                      tenant: {
                        connect: {
                          id: this.tenantId,
                        },
                      },
                    },
                  },
                },
                zohoApp: {
                  connect: {
                    id: this.zohoApp.id,
                  },
                },
              },
              update: {
                orderLineItem: {
                  update: {
                    quantity: lineItem.quantity,
                    discountValueNet: lineItem.discount_amount,
                    tax: {
                      connect: {
                        percentage_tenantId: {
                          tenantId: this.tenantId,
                          percentage: lineItem.tax_percentage,
                        },
                      },
                    },
                    totalPriceNet: lineItem.item_total,
                    totalPriceGross: lineItem.item_total_inclusive_of_tax,
                    undiscountedUnitPriceGross: fullSalesorder.is_inclusive_tax
                      ? lineItem.rate
                      : undefined,
                    undiscountedUnitPriceNet: fullSalesorder.is_inclusive_tax
                      ? undefined
                      : lineItem.rate,
                  },
                },
              },
            });

            allEciOrderLineItems.push({
              id: upsertedLineItem.orderLineItemId,
            });
          }

          const oldOrderLines = createdSalesOrder.order.orderLineItems;

          const toBeDeleted = oldOrderLines.filter((x) => {
            return !allEciOrderLineItems.map((all) => all.id).includes(x.id);
          });

          if (toBeDeleted.length > 0) {
            this.logger.info(
              `To be deleted orderlines: ${JSON.stringify(toBeDeleted)}`,
            );
            await this.db.orderLineItem.deleteMany({
              where: {
                id: {
                  in: toBeDeleted.map((d) => d.id),
                },
              },
            });
          }
        } catch (error) {
          this.logger.error(JSON.stringify(error));
        }

        // if we have payments connected, we can connect them internally as well
        try {
          for (const payment of fullSalesorder.payments) {
            const zohoPaymentExist = await this.db.zohoPayment.findUnique({
              where: {
                id_zohoAppId: {
                  id: payment.payment_id,
                  zohoAppId: this.zohoApp.id,
                },
              },
              include: {
                payment: true,
              },
            });
            if (zohoPaymentExist && zohoPaymentExist.paymentId) {
              this.logger.info(
                // eslint-disable-next-line max-len
                `Connecting Zoho payment ${zohoPaymentExist.id} / ECI payment ${zohoPaymentExist.paymentId} with internal order id ${internalOrderId}`,
              );
              await this.db.order.update({
                where: {
                  id: internalOrderId,
                },
                data: {
                  payments: {
                    connect: {
                      id: zohoPaymentExist.paymentId,
                    },
                  },
                },
              });
            }
          }
        } catch (error) {
          this.logger.error(error as any);
        }

        /**
         * Update the order addresses in our internal db
         */
        if (
          !fullSalesorder.shipping_address_id ||
          !fullSalesorder.billing_address_id
        ) {
          this.logger.warn(
            `Shipping address id or billing address id missing for ${fullSalesorder.salesorder_id} - We maybe can't create a Zoho Address entry`,
          );
        }
        try {
          await addresses(
            this.db,
            this.tenantId,
            this.zohoApp.id,
            this.logger,
            createdSalesOrder.order.mainContactId,
          ).eciOrderAddAddresses({
            shippingAddress: fullSalesorder.shipping_address,
            shippingAddressId: fullSalesorder.shipping_address_id,
            billingAddress: fullSalesorder.billing_address,
            billingAddressId: fullSalesorder.billing_address_id,
            contactPersonDetails: fullSalesorder.contact_person_details,
            customerName: fullSalesorder.customer_name,
            eciOrderId: internalOrderId,
          });
        } catch (err) {
          if (err instanceof Warning) {
            this.logger.warn(err.message);
            continue;
          }
          this.logger.error(
            `Error upserting addresses: ${JSON.stringify(err)}`,
          );
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
    const ordersFromEciDb = await this.db.order.findMany({
      where: {
        tenantId: this.zohoApp.tenantId,
        // filter out orders that are cancled (for example in saleor)
        orderStatus: "confirmed",
        // filter out zohoSalesorders with the current AppId like this we find the orders,
        // for which we do not yet have a ZohoId in the DB
        zohoSalesOrders: {
          none: {
            zohoAppId: this.zohoApp.id,
          },
        },
        // filter out orders which are newer than 10min to increase the likelihood that all
        // zoho sub entities (like zohoContactPersons, zohoAddresses etc.) are already synced
        createdAt: {
          lte: addMinutes(new Date(), -this.createdTimeOffsetMin),
        },
        // TODO enhance where clause so we filter out the orders for which some data is missing so we can delte the throw Warning stuff
        // order.lineItems.productVariant.zohoItem,
        // order.lineItems.tax.zohoTaxes,
        // order.lineItems.warehouse.zohoWarehous,
        // order.mainContact.zohoContactPerson,
        // ...
      },
      include: {
        orderLineItems: {
          include: {
            productVariant: {
              include: {
                zohoItem: {
                  where: {
                    zohoAppId: this.zohoApp.id,
                  },
                },
                defaultWarehouse: {
                  include: {
                    zohoWarehouse: {
                      where: {
                        zohoAppId: this.zohoApp.id,
                      },
                    },
                  },
                },
              },
            },
            tax: {
              include: {
                zohoTaxes: {
                  where: {
                    zohoAppId: this.zohoApp.id,
                  },
                },
              },
            },
          },
        },
        mainContact: {
          include: {
            zohoContactPersons: {
              where: {
                zohoAppId: this.zohoApp.id,
                active: true,
              },
            },
          },
        },
        shippingPriceTax: {
          include: {
            zohoTaxes: {
              where: {
                zohoAppId: this.zohoApp.id,
              },
            },
          },
        },
        shippingAddress: {
          include: {
            zohoAddress: true,
          },
        },
        billingAddress: {
          include: {
            zohoAddress: true,
          },
        },
      },
    });
    this.logger.info(
      `Received ${ordersFromEciDb.length} orders that are not synced with Zoho.`,
      {
        orderIds: ordersFromEciDb.map((o) => o.id),
        orderNumbers: ordersFromEciDb.map((o) => o.orderNumber),
      },
    );

    const salesordersToConfirm: SalesOrder[] = [];
    for (const order of ordersFromEciDb) {
      try {
        // Minimal Order validation
        if (!order.totalPriceGross && !order.totalPriceNet) {
          throw new Error(
            "IMPORTANT: Neither order totalPriceNet or totalPriceGross is set. Please check and correct it manually in ECI db",
          );
        }

        if (!order.billingAddress || !order.shippingAddress) {
          throw new Error("Billing and Shipping address need both to be set!");
        }

        const customFields: CustomField[] = [];

        /**
         * The custom field mapping for a voucher code
         */
        if (this.zohoApp.customFieldVoucherCode && order.discountCode)
          customFields.push({
            api_name: this.zohoApp.customFieldVoucherCode,
            value: order.discountCode,
          });

        /**
         * The custom field mapping for ready to fulfill
         */
        if (this.zohoApp.customFieldReadyToFulfill)
          customFields.push({
            api_name: this.zohoApp.customFieldReadyToFulfill,
            value: order.readyToFullfill,
          });

        const mainContactPerson = orderToMainContactPerson(order);

        // eslint-disable-next-line camelcase
        const discount_type = order.discountValueNet
          ? "entity_level"
          : "item_level";
        const createSalesOrderBody: CreateSalesOrder = {
          date: format(order.date, "yyyy-MM-dd"),
          // We always create orders inclusive of tax to prevent possible rounding errors
          is_inclusive_tax: true,
          salesorder_number: order.orderNumber,
          reference_number: order.referenceNumber ?? undefined,
          line_items: orderToZohoLineItems(order, discount_type),
          customer_id: mainContactPerson.zohoContactId,
          discount_type,
          discount: calculateDiscount(order.discountValueNet, "fixed"),
          billing_address_id: addressToZohoAddressId(
            order.billingAddress,
            mainContactPerson.zohoContactId,
            this.logger,
          ),
          shipping_address_id: addressToZohoAddressId(
            order.shippingAddress,
            mainContactPerson.zohoContactId,
            this.logger,
          ),
          custom_fields: customFields,
          delivery_method: order.carrier?.toString(),
          contact_persons: [mainContactPerson.id],
          shipping_charge: order.shippingPriceGross ?? undefined,
          // mit is_inclusive_tax = true klappt das discountValueNet natürlich nicht.
          shipping_charge_tax_id: order.shippingPriceTax
            ? taxToZohoTaxId(order.shippingPriceTax)
            : undefined,
          // TODO: shipment_date?
        };
        this.logger.debug(JSON.stringify(createSalesOrderBody));
        const createdSalesOrder = await this.zoho.salesOrder.create(
          createSalesOrderBody,
        );
        await this.db.zohoSalesOrder.create({
          data: {
            id: createdSalesOrder.salesorder_id,
            order: {
              connect: {
                id: order.id,
              },
            },
            zohoApp: {
              connect: {
                id: this.zohoApp.id,
              },
            },
            createdAt: new Date(createdSalesOrder.created_time),
            updatedAt: new Date(createdSalesOrder.last_modified_time),
            // zohoContact // TODO is this needed? --> remove it from the schema if it is really not needed
            // zohoContactPerson // TODO is this needed? --> remove it from the schema if it is really not needed
          },
        });
        this.logger.info(
          `Successfully created zoho salesorder ${createdSalesOrder.salesorder_number}`,
          {
            orderId: order.id,
            mainContactId: order.mainContactId,
            orderNumber: order.orderNumber,
            referenceNumber: order.referenceNumber,
            zohoAppId: this.zohoApp.id,
            tenantId: this.tenantId,
          },
        );
        // TODO if this fails because diff is only 1 or 2 cent and order has a discount we can add/substract one cent on the discount and try it again.
        if (
          order.totalPriceNet &&
          createdSalesOrder.sub_total !== order.totalPriceNet
        ) {
          throw new Error(
            "IMPORTANT: Order net totals from saleor and ECI do not match. The Order was therefore not " +
              "confirmed automatically in Zoho, please check them manually and confirm the order in Zoho.",
          );
        }
        if (
          order.totalPriceGross &&
          createdSalesOrder.total !== order.totalPriceGross
        ) {
          throw new Error(
            "IMPORTANT: Order gross totals from saleor and ECI do not match. The Order was therefore not " +
              "confirmed automatically in Zoho, please check them manually and confirm the order in Zoho.",
          );
        }
        salesordersToConfirm.push(createdSalesOrder);
      } catch (err) {
        if (err instanceof Warning) {
          // TODO make an update on Order and increase Warning counter, if warning counter over threshold 5 -> log an error instead
          this.logger.warn(err.message, {
            eciOrderId: order.id,
            eciOrderNumber: order.orderNumber,
          });
        } else if (err instanceof Error) {
          // TODO zoho-ts package: add enum for error codes . like this:
          // if(err as ZohoApiError).code === require(zoho-ts).apiErrorCodes.SalesOrderAlreadyExists){
          if ((err as ZohoApiError).code === 36004) {
            // 36004 = This sales order number already exists.
            this.logger.warn(err.message, {
              eciOrderId: order.id,
              eciOrderNumber: order.orderNumber,
            });
            const searchedSalesOrders = await this.zoho.salesOrder.search(
              order.orderNumber,
            );
            if (searchedSalesOrders.length === 0) {
              this.logger.error(
                "Salesorder was already created and search with order.orderNumber returned no results. Aborting attach of this order, please resolve this Issue manually.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
              continue;
            }
            if (searchedSalesOrders.length > 1) {
              this.logger.error(
                "Salesorder was already created and search with order.orderNumber returned multiple results. Aborting attach of this order, please resolve this Issue manually.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
              continue;
            }
            const matchingSalesOrder = searchedSalesOrders[0];
            if (matchingSalesOrder.total !== order.totalPriceGross) {
              this.logger.error(
                "Salesorder was already created and search with order.orderNumber returned a results with different order.totalPriceGross. Aborting attach of this order, please resolve this Issue manually.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
              continue;
            }
            if (
              matchingSalesOrder.line_items.length !==
              order.orderLineItems.length
            ) {
              this.logger.error(
                "Salesorder was already created and search with order.orderNumber returned a results with different order.orderLineItems.length. Aborting attach of this order, please resolve this Issue manually.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
              continue;
            }
            await this.db.zohoSalesOrder.create({
              data: {
                id: matchingSalesOrder.salesorder_id,
                order: {
                  connect: {
                    id: order.id,
                  },
                },
                zohoApp: {
                  connect: {
                    id: this.zohoApp.id,
                  },
                },
                createdAt: new Date(matchingSalesOrder.created_time),
                updatedAt: new Date(matchingSalesOrder.last_modified_time),
                // zohoContact // TODO is this needed? --> remove it from the schema if it is really not needed, should be accessible via zohoSalesOrder -> order -> mainCont
                // zohoContactPerson // TODO is this needed? --> remove it from the schema if it is really not needed
              },
            });
            this.logger.info(
              `Successfully attached zoho salesorder ${matchingSalesOrder.salesorder_number} from search request to the current order`,
              {
                orderId: order.id,
                mainContactId: order.mainContactId,
                orderNumber: order.orderNumber,
                referenceNumber: order.referenceNumber,
                zohoAppId: this.zohoApp.id,
                tenantId: this.tenantId,
              },
            );
            if (
              order.totalPriceNet &&
              matchingSalesOrder.sub_total !== order.totalPriceNet
            ) {
              this.logger.error(
                "IMPORTANT: Order net totals from saleor and ECI do not match. The Order was therefore not " +
                  "confirmed automatically in Zoho, please check them manually and confirm the order in Zoho.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
            }
            if (
              order.totalPriceGross &&
              matchingSalesOrder.total !== order.totalPriceGross
            ) {
              this.logger.error(
                "IMPORTANT: Order gross totals from saleor and ECI do not match. The Order was therefore not " +
                  "confirmed automatically in Zoho, please check them manually and confirm the order in Zoho.",
                { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
              );
            }
            if (matchingSalesOrder.status === "draft") {
              salesordersToConfirm.push(matchingSalesOrder);
            }
          } else {
            this.logger.error(
              "Failed during Salesorder sync loop. Original Error: " +
                err.message,
              {
                eciOrderId: order.id,
                eciOrderNumber: order.orderNumber,
              },
            );
          }
        } else {
          this.logger.error(
            "An unknown Error occured during sync loop: " +
              (err as any)?.toString(),
            { eciOrderId: order.id, eciOrderNumber: order.orderNumber },
          );
        }
      }
    }
    try {
      if (salesordersToConfirm.length > 0) {
        await sleep(100);
        await this.zoho.salesOrder.confirm(
          salesordersToConfirm.map((so) => so.salesorder_id),
        );
        // TODO update in DB which salesorders are confirmed. Maybe add status to eci zohosalesorder? or status to eci order?
        this.logger.info(
          `Successfully confirmed ${salesordersToConfirm.length} order(s).`,
          {
            salesorderNumbersToConfirm: salesordersToConfirm.map(
              (o) => o.salesorder_number,
            ),
            salesorderIDsToConfirm: salesordersToConfirm.map(
              (o) => o.salesorder_id,
            ),
          },
        );
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? `${err.name}:\n${err.message}`
          : JSON.stringify(err);
      this.logger.error(
        "Could not confirm all salesorders after creating them. Please check Zoho and confirm them manually.",
        {
          submitedSalesorderIds: salesordersToConfirm.map(
            (so) => so.salesorder_id,
          ),
          submitedSalesorderNumbers: salesordersToConfirm.map(
            (so) => so.salesorder_number,
          ),
          zohoClientErrorMessage: errorMsg,
        },
      );
    }
  }
}
