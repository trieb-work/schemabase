/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
  SaleorCronOrdersOverviewQuery,
  queryWithPagination,
  SaleorCronOrderDetailsQuery,
  OrderStatus,
  PaymentChargeStatusEnum,
  LanguageCodeEnum,
} from "@eci/pkg/saleor";
import {
  PrismaClient,
  OrderStatus as InternalOrderStatus,
  OrderPaymentStatus as InternalOrderPaymentStatus,
  Prisma,
  Tax,
  Language,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { subYears, subHours } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { round } from "reliable-round";
import { normalizeStrings } from "@eci/pkg/normalization";
import addresses from "./addresses";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils";
import { shippingMethodMatch } from "@eci/pkg/miscHelper/shippingMethodMatch";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorCronOrderDetails: (variables: {
      id: string;
    }) => Promise<SaleorCronOrderDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte?: string;
      updatedAtGte?: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };
  channelSlug: string;
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
  orderPrefix: string;
}

export class SaleorOrderSyncService {
  public readonly saleorClient: {
    saleorCronOrderDetails: (variables: {
      id: string;
    }) => Promise<SaleorCronOrderDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte?: string;
      updatedAtGte?: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly orderPrefix: string;

  private eciTaxes: Tax[] | [];

  public constructor(config: SaleorOrderSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.channelSlug = config.channelSlug;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.orderPrefix = config.orderPrefix;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "orders",
    });
    this.eciTaxes = [];
  }

  /**
   * Lookup table, that is storing all available taxes to save DB calls
   * @param taxPercentage 
   */
  public async lookupECITax(taxPercentage :number): Promise<string|undefined> {
    if (this.eciTaxes.length === 0) {
      this.eciTaxes = await this.db.tax.findMany({
        where: {
          tenantId: this.tenantId
        }
      })  
    }
    return this.eciTaxes.find((t) => t.percentage === taxPercentage)?.id;
    
  }

  private matchLanguage(language: LanguageCodeEnum): Language {
    switch (language) {
      case LanguageCodeEnum.De:
        return Language.DE;
      case LanguageCodeEnum.En:
        return Language.EN;
      default:
        return Language.EN;    
    }
  }

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    let createdGte: string;
    if (!cronState.lastRun) {
      createdGte = subYears(now, 2).toISOString();
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from: ${createdGte}`,
      );
    } else {
      createdGte = subHours(cronState.lastRun, 3).toISOString();
      this.logger.info(
        `Setting GTE date to ${createdGte}. Asking Saleor for all orders with lastUpdated GTE.`,
      );
    }
    
    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronOrdersOverview({
        first,
        after,
        updatedAtGte: createdGte,
        channel: this.channelSlug,
      }),
    );

    if (!result.orders || result.orders.edges.length === 0) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
      return;
    }
    const orders = result.orders.edges.map((order) => order.node);

    this.logger.info(`Working on ${orders.length} orders`);

    for (const order of orders) {
      try {
        if (!order.number || typeof order.number === "undefined") {
          throw new Error(`No orderNumber in order. Can't sync.`);
        }
        const prefixedOrderNumber = `${this.orderPrefix}-${order.number}`;

        if (!order.userEmail) {
          throw new Error(`No user email given for order. Can't sync.`);
        }

        const email = order.userEmail.toLowerCase();
        const companyName = order.billingAddress?.companyName;

        const discountCode = order.voucher?.code

        const companyCreateOrConnect: Prisma.CompanyCreateNestedOneWithoutContactsInput =
          companyName
            ? {
                connectOrCreate: {
                  where: {
                    normalizedName_tenantId: {
                      normalizedName:
                        normalizeStrings.companyNames(companyName),
                      tenantId: this.tenantId,
                    },
                  },
                  create: {
                    id: id.id("company"),
                    name: companyName,
                    normalizedName: normalizeStrings.companyNames(companyName),
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                  },
                },
              }
            : {};
        const contactCreateOrConnect = {
          connectOrCreate: {
            where: {
              email_tenantId: {
                email,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("contact"),
              email,
              firstName: order.billingAddress?.firstName,
              lastName: order.billingAddress?.lastName,
              company: companyCreateOrConnect,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
            },
          },
        };

        const orderStatusMapping: {
          [key in OrderStatus]: InternalOrderStatus;
        } = {
          [OrderStatus.Canceled]: "canceled",
          [OrderStatus.Draft]: "draft",
          [OrderStatus.Unfulfilled]: "confirmed",
          [OrderStatus.Fulfilled]: "confirmed",
          [OrderStatus.PartiallyFulfilled]: "confirmed",
          [OrderStatus.Returned]: "confirmed",
          [OrderStatus.Unconfirmed]: "unconfirmed",
          [OrderStatus.PartiallyReturned]: "confirmed",
        };
        const orderStatus = orderStatusMapping[order.status];

        const paymentStatusMapping: {
          [key in PaymentChargeStatusEnum]: InternalOrderPaymentStatus;
        } = {
          [PaymentChargeStatusEnum.Cancelled]: "unpaid",
          [PaymentChargeStatusEnum.FullyCharged]: "fullyPaid",
          [PaymentChargeStatusEnum.FullyRefunded]: "fullyRefunded",
          [PaymentChargeStatusEnum.NotCharged]: "unpaid",
          [PaymentChargeStatusEnum.PartiallyCharged]: "partiallyPaid",
          [PaymentChargeStatusEnum.PartiallyRefunded]: "partiallyRefunded",
          [PaymentChargeStatusEnum.Pending]: "unpaid",
          [PaymentChargeStatusEnum.Refused]: "unpaid",
        };

        const paymentStatus = paymentStatusMapping[order.paymentStatus];

        const carrier = shippingMethodMatch(order?.shippingMethodName || "");

        const upsertedOrder = await this.db.saleorOrder.upsert({
          where: {
            id_installedSaleorAppId: {
              id: order.id,
              installedSaleorAppId: this.installedSaleorAppId,
            },
          },
          create: {
            id: order.id,
            installedSaleorApp: {
              connect: {
                id: this.installedSaleorAppId,
              },
            },
            createdAt: order.created,
            order: {
              connectOrCreate: {
                where: {
                  orderNumber_tenantId: {
                    orderNumber: prefixedOrderNumber,
                    tenantId: this.tenantId,
                  },
                },
                create: {
                  // TODO add orderCurrency for all prices in an order
                  id: id.id("order"),
                  orderNumber: prefixedOrderNumber,
                  date: new Date(order.created),
                  totalPriceGross: order.total.gross.amount,
                  language: this.matchLanguage(order.languageCodeEnum),
                  orderStatus,
                  discountCode,
                  carrier,
                  paymentStatus, // TODO: how will this thing be updated and kept in sync by other services? -> Maybe move it into Payment.status and access it via payments[0].status?
                  mainContact: contactCreateOrConnect,
                  shippingAddress: {},
                  billingAddress: {},
                  readyToFullfill:
                    orderStatus === "confirmed" &&
                    paymentStatus === "fullyPaid",
                  shippingPriceGross: order.shippingPrice.gross.amount,
                  tenant: {
                    connect: {
                      id: this.tenantId,
                    },
                  },
                },
              },
            },
          },
          update: {
            order: {
              update: {
                carrier,
                language: this.matchLanguage(order.languageCodeEnum),
                totalPriceGross: order.total.gross.amount,
                shippingPriceGross: order?.shippingPrice.gross.amount,
                orderStatus,
                discountCode,
                mainContact: contactCreateOrConnect,
                paymentStatus: paymentStatus !== "unpaid" ? paymentStatus : undefined,
              },
            },
          },
          include: {
            order: true,
          },
        });

        const orderDetails = await this.saleorClient.saleorCronOrderDetails({
          id: order.id,
        });
        if (!orderDetails) {
          throw new Error(
            `Can't get order details from saleor! Aborting sync and retry next time.`,
          );
        }

        const lineItems = orderDetails.order?.lines;
        if (!lineItems) {
          throw new Error(
            `No line items returned for order! Aborting sync and retry next time.`,
          );
        }

        /**
         * The highest Tax Rate is used as the shipping tax rate
         */
        const highestTaxRate = order.shippingPrice.gross.amount > 0 ? await this.lookupECITax(Math.round(Math.max(...lineItems.map((i) => i.taxRate)) * 100 )) : undefined;

        if (order.shippingPrice.gross.amount > 0 && !upsertedOrder.order.shippingPriceTaxId && highestTaxRate){
          this.logger.info(`Upserting shipping price tax id to ${highestTaxRate} for order ${upsertedOrder.orderNumber} - ${upsertedOrder.orderId}`)
          await this.db.order.update({
            where: {
              id: upsertedOrder.orderId
            },
            data: {
              shippingPriceTax: {
                connect: {
                  id: highestTaxRate
                }
              }
            }
          })
        }

        // loop through all line items and upsert them in the DB
        for (const lineItem of lineItems) {
          if (!lineItem?.id) {
            throw new Error(
              `Lineitem of Order has a missing id in saleor response.`,
            );
          }
          if (!lineItem?.productSku) {
            throw new Error(
              `Lineitem of Order is missing the variant sku in saleor response.`,
            );
          }

          const productSku = await this.db.productVariant.findUnique({
            where: {
              sku_tenantId: {
                sku: lineItem.productSku,
                tenantId: this.tenantId,
              },
            },
          });
          if (!productSku) {
            throw new Warning(
              `No internal product variant found for SKU ${lineItem.productSku}! Can't create line Item. Try again after Product Variant Sync.`,
            );
          }

          const uniqueString = uniqueStringOrderLine(
            prefixedOrderNumber,
            lineItem.productSku,
            lineItem.quantity,
          );

          const lineItemTotalDiscountNet = round(lineItem.unitDiscount.amount * lineItem.quantity, 2)

          if (lineItemTotalDiscountNet < 0) {
            throw new Error(
              `Calculated saleor discount is negative: ${lineItemTotalDiscountNet}! This can never be. Failing..`,
            );
          }

          const taxPercentage = Math.round(lineItem.taxRate * 100);
          let eciTax = await this.lookupECITax(taxPercentage)

          if (!eciTax) {
            this.logger.warn(`We could not find an internal tax for tax rate ${taxPercentage} for order ${order.number}. We are using the products default now`)
            if (!productSku.salesTaxId) {
              this.logger.error(`Product ${productSku.sku} - ${productSku.id} has no default sales tax set! Can't proceed`)
              continue;
            }
            eciTax = productSku.salesTaxId;
          }

          // TODO: would it not be better to inline this into db.saleorOrder.upsert (line 209) so we do not have partiall order data in ECI db if something fails?
          // Otherwise we would maybe need a parialdata flag (or commited flag) which is true on create and will be updated to false once all lineitems etc. have been created.
          // Then we can filter for the next steps for partial data = true;
          await this.db.saleorOrderLineItem.upsert({
            where: {
              id_installedSaleorAppId: {
                id: lineItem.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
            create: {
              id: lineItem.id,
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
                    tenant: {
                      connect: {
                        id: this.tenantId,
                      },
                    },
                    uniqueString,
                    order: {
                      connect: {
                        id: upsertedOrder.orderId,
                      },
                    },
                    quantity: lineItem.quantity,
                    discountValueNet: lineItemTotalDiscountNet,
                    undiscountedUnitPriceNet:
                      lineItem.undiscountedUnitPrice.net.amount,
                    undiscountedUnitPriceGross:
                      lineItem.undiscountedUnitPrice.gross.amount,
                    totalPriceNet: lineItem.totalPrice.net.amount,
                    totalPriceGross: lineItem.totalPrice.gross.amount,
                    tax: {
                      connect: {
                        id: eciTax
                      },
                    },
                    productVariant: {
                      connect: {
                        id: productSku.id,
                      },
                    },
                  },
                },
              },
              installedSaleorApp: {
                connect: {
                  id: this.installedSaleorAppId,
                },
              },
            },
            update: {
              orderLineItem: {
                update: {
                  quantity: lineItem.quantity,
                  discountValueNet: lineItemTotalDiscountNet,
                  totalPriceNet: lineItem.totalPrice.net.amount,
                  totalPriceGross: lineItem.totalPrice.gross.amount,
                  undiscountedUnitPriceGross:
                    lineItem.undiscountedUnitPrice.gross.amount,
                  tax: {
                    connect: {
                      id: eciTax
                    },
                  },
                  productVariant: {
                    connect: {
                      id: productSku.id,
                    },
                  },
                  order: {
                    update: {
                      shippingPriceGross:
                        orderDetails.order?.shippingPrice.gross.amount,
                    },
                  },
                },
              },
            },
          });
        }

        if (upsertedOrder.order?.mainContactId == null) {
          throw new Error(
            `Order ${upsertedOrder.orderNumber} has no main contact Id set! Can't sync addressess`,
          );
        }
        // Sync the order's addresses with the internal DB
        if (
          order.shippingAddress &&
          order.billingAddress &&
          upsertedOrder.order?.mainContactId !== null
        ) {
          this.logger.info(
            `Upserting addresses for ${upsertedOrder.orderNumber} - contact ${upsertedOrder.order.mainContactId}`,
          );
          // TODO: rewrite/rename addesses without Class so it follows the same schema as zoho-salesorders-helpers
          // -> also move both in an integration-saleor-entities/src/helpers folder because they can potentially be used by more than this entities
          await addresses(
            this.db,
            upsertedOrder.orderId,
            this.tenantId,
            this.logger,
            upsertedOrder.order.mainContactId,
          ).sync(order.shippingAddress, order.billingAddress);
        }
      } catch (err) {
        const defaultLogFields = {
          saleorOrderId: order.id,
          saleorOrderNumber: `${this.orderPrefix}-${order.number}`,
          saleorOrderUserEmail: order.userEmail,
        };
        if (err instanceof Warning) {
          this.logger.warn(err.message, defaultLogFields);
        } else if (err instanceof Error) {
          this.logger.error(err.message, defaultLogFields);
        } else {
          this.logger.error(
            "An unknown Error occured: " + (err as any)?.toString(),
            defaultLogFields,
          );
        }
      }
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
