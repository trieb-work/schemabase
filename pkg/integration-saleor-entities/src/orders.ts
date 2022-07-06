/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import { ILogger } from "@eci/pkg/logger";
import {
  SaleorCronOrdersOverviewQuery,
  queryWithPagination,
  SaleorCronOrderDetailsQuery,
  OrderStatus,
  PaymentChargeStatusEnum,
} from "@eci/pkg/saleor";
import {
  PrismaClient,
  OrderStatus as InternalOrderStatus,
  OrderPaymentStatus as InternalOrderPaymentStatus,
  Prisma,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { setHours, subDays, subYears, format } from "date-fns";
import { id } from "@eci/pkg/ids";
import { uniqueStringOrderLine } from "@eci/pkg/miscHelper/uniqueStringOrderline";
import { round } from "reliable-round";

interface SaleorOrderSyncServiceConfig {
  saleorClient: {
    saleorCronOrderDetails: (variables: {
      id: string;
    }) => Promise<SaleorCronOrderDetailsQuery>;
    saleorCronOrdersOverview: (variables: {
      first: number;
      channel: string;
      after: string;
      createdGte: string;
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
      createdGte: string;
    }) => Promise<SaleorCronOrdersOverviewQuery>;
  };

  public readonly channelSlug: string;

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly orderPrefix: string;

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
  }

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let createdGte = format(yesterdayMidnight, "yyyy-MM-dd");
    if (!cronState.lastRun) {
      createdGte = format(subYears(now, 2), "yyyy-MM-dd");
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 2 Years to: ${createdGte}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${createdGte}`);
    }
    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronOrdersOverview({
        first,
        after,
        createdGte,
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
      if (!order.number || typeof order.number === "undefined") {
        this.logger.error(`No orderNumber in order ${order.id} - Can't sync`);
        continue;
      }
      const prefixedOrderNumber = `${this.orderPrefix}-${order.number}`;

      if (!order.userEmail) {
        this.logger.error(
          `No user email given for order ${prefixedOrderNumber} - ${order.id}. Can't proceed`,
        );
        continue;
      }

      const lowerCaseEmail = order.userEmail.toLowerCase();

      const contactCreateOrConnect: Prisma.ContactCreateNestedManyWithoutOrdersInput =
        {
          connectOrCreate: {
            where: {
              email_tenantId: {
                email: lowerCaseEmail,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("contact"),
              email: lowerCaseEmail,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
            },
          },
        };

      const orderStatusMapping: { [key in OrderStatus]: InternalOrderStatus } =
        {
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

      // const saleorOrderBefore = await this.db.saleorOrder.findFirst({
      //   where: {
      //     id: order.id,
      //     installedSaleorAppId: this.installedSaleorAppId
      //   },
      //   include: {
      //     order: true,
      //   }
      // });

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
                id: id.id("order"),
                orderNumber: prefixedOrderNumber,
                totalPriceGross: order.total.gross.amount,
                orderStatus,
                paymentStatus,
                contacts: contactCreateOrConnect,
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
              totalPriceGross: order.total.gross.amount,
              orderStatus,
              contacts: contactCreateOrConnect,
            },
          },
        },
      });

      const orderDetails = await this.saleorClient.saleorCronOrderDetails({
        id: order.id,
      });
      if (!orderDetails) {
        this.logger.error(
          `Can't get order details from saleor for order ${order.id}!`,
        );
        continue;
      }
      const lineItems = orderDetails.order?.lines;
      if (!lineItems) {
        this.logger.error(`No line items returned for order ${order.id}!`);
        continue;
      }

      // loop through all line items and upsert them in the DB
      for (const lineItem of lineItems) {
        if (!lineItem?.id) continue;
        if (!lineItem?.variant?.sku) continue;

        const productSku = await this.db.productVariant.findUnique({
          where: {
            sku_tenantId: {
              sku: lineItem.variant.sku,
              tenantId: this.tenantId,
            },
          },
        });
        if (!productSku) {
          this.logger.warn(
            `No internal product variant found for SKU ${lineItem.variant.sku}! Can't create line Item`,
          );
          continue;
        }

        const uniqueString = uniqueStringOrderLine(
          prefixedOrderNumber,
          lineItem.variant.sku,
          lineItem.quantity,
        );

        // Before Saleor 3.3.13, the discount value is calculated on the
        // gross price (which is just bullshit :D) so we have to calculate the discountValueNet
        // manually
        const discountValueNet = round(
          lineItem.unitDiscountValue === 0
            ? 0
            : lineItem.undiscountedUnitPrice.net.amount * lineItem.quantity -
                lineItem.totalPrice.net.amount,
          2,
        );

        if (discountValueNet < 0)
          throw new Error(
            `Calculated saleor discount is negative: ${discountValueNet}! This can never be. Failing..`,
          );

        await this.db.saleorLineItem.upsert({
          where: {
            id_installedSaleorAppId: {
              id: lineItem.id,
              installedSaleorAppId: this.installedSaleorAppId,
            },
          },
          create: {
            id: lineItem.id,
            lineItem: {
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
                  discountValueNet,
                  totalPriceNet: lineItem.totalPrice.net.amount,
                  totalPriceGross: lineItem.totalPrice.gross.amount,
                  taxPercentage: lineItem.taxRate * 100,
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
            lineItem: {
              update: {
                quantity: lineItem.quantity,
                discountValueNet,
                totalPriceNet: lineItem.totalPrice.net.amount,
                totalPriceGross: lineItem.totalPrice.gross.amount,
                taxPercentage: lineItem.taxRate * 100,
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
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
