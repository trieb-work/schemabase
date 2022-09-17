/* eslint-disable max-len */
import { ILogger } from "@eci/pkg/logger";
import { queryWithPagination, SaleorCronPaymentsQuery } from "@eci/pkg/saleor";
import {
  GatewayType,
  PaymentMethodType,
  Prisma,
  PrismaClient,
} from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { checkCurrency } from "@eci/pkg/normalization/src/currency";
import { Warning } from "@eci/pkg/integration-zoho-entities/src/utils"; // TODO move to Warning to antoher place
// import { id } from "@eci/pkg/ids";

interface SaleorPaymentSyncServiceConfig {
  saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPaymentsQuery>;
  };
  installedSaleorAppId: string;
  tenantId: string;
  db: PrismaClient;
  logger: ILogger;
  orderPrefix: string;
}

export class SaleorPaymentSyncService {
  public readonly saleorClient: {
    saleorCronPayments: (variables: {
      first: number;
      after: string;
      createdGte: string;
    }) => Promise<SaleorCronPaymentsQuery>;
  };

  private readonly logger: ILogger;

  public readonly installedSaleorAppId: string;

  public readonly tenantId: string;

  private readonly cronState: CronStateHandler;

  private readonly db: PrismaClient;

  private readonly orderPrefix: string;

  public constructor(config: SaleorPaymentSyncServiceConfig) {
    this.saleorClient = config.saleorClient;
    this.logger = config.logger;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.tenantId = config.tenantId;
    this.db = config.db;
    this.orderPrefix = config.orderPrefix;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.installedSaleorAppId,
      db: this.db,
      syncEntity: "payments",
    });
  }

  /**
   * Pull payment metadata from braintree
   */
  //   private async braintreeGetPaymentDetails() {}

  public async syncToECI(): Promise<void> {
    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let createdGte = format(yesterdayMidnight, "yyyy-MM-dd");
    if (!cronState.lastRun) {
      createdGte = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        // eslint-disable-next-line max-len
        `This seems to be our first sync run. Syncing data from now - 1 Year to: ${createdGte}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${createdGte}`);
    }

    const result = await queryWithPagination(({ first, after }) =>
      this.saleorClient.saleorCronPayments({
        first,
        after,
        createdGte,
      }),
    );
    console.log(
      "queried",
      result.orders?.totalCount,
      result.orders?.edges.length,
    );

    // Only sycn active payments. For exampe if a payment was captured twice and only one was successfull, the unsuccessfull payment is unactive and should be filtered out.
    const payments = result.orders?.edges
      .flatMap((order) => order.node.payments)
      .filter((payment) => payment?.isActive);

    if (!result.orders || result.orders.edges.length === 0 || !payments) {
      this.logger.info("Saleor returned no orders. Don't sync anything");
      return;
    }
    this.logger.info(`Syncing ${payments?.length} payments`);

    for (const payment of payments) {
      // TODO add try/catch Warning handle logic // TODO rewrite all continues with Warning try/catch logger
      if (!payment || !payment?.id) continue;
      if (!payment?.order?.id) {
        this.logger.warn(
          `Can't sync payment ${payment.id} - No related order id given`,
        );
        continue;
      }
      const saleorOrder = payment.order;
      if (typeof saleorOrder.number !== "string") continue;

      /**
       * The full order number including prefix
       */
      const prefixedOrderNumber = `${this.orderPrefix}-${saleorOrder.number}`;

      const successfullTransactions = payment.transactions?.filter(
        (tr) => tr?.isSuccess,
      );
      if (!successfullTransactions || successfullTransactions?.length === 0) {
        throw new Error(
          `No successfull transaction included in payment. Cant't sync ${payment.id}.`,
        );
      }
      if (successfullTransactions?.length > 1) {
        // Do not throw if gateway is triebwork.payments.rechnung because in the old version this was possible.
        if (payment.gateway !== "triebwork.payments.rechnung") {
          throw new Error(
            `Multiple successfull transaction included in payment. Cant't sync ${payment.id}.`,
          );
        }
      }
      const paymentReference = successfullTransactions?.[0]?.token;
      if (!paymentReference) {
        throw new Warning(
          `No payment gateway transaction Id given. We use this value as internal payment reference. Cant't sync ${payment.id}`,
        );
      }

      // TODO include payment status failed, fully charged etc. somehow!!
      // TODO test failed payments etc.
      let gatewayType: GatewayType;
      let methodType: PaymentMethodType;
      // modern webhook based integration have the schema `app:17:triebwork.payments.rechnung` and not `triebwork.payments.rechnung`
      const gatewayId = payment.gateway.startsWith("app")
        ? payment.gateway.split(":")?.[2]
        : payment.gateway;

      if (gatewayId === "mirumee.payments.braintree") {
        gatewayType = "braintree";
        // new braintree implementation has a bug and classifies PayPal payments as card payment
        if (payment.paymentMethodType === "card") {
          if (payment.creditCard) {
            methodType = "card";
          } else {
            methodType = "paypal";
          }
          // old Braintree PayPal integration sets paymentMethodType correctly
        } else if (payment.paymentMethodType === "paypal") {
          methodType = "paypal";
          // Edge case if applepay does not give the details back
        } else if (
          payment.paymentMethodType === "" &&
          payment.creditCard === null
        ) {
          methodType = "card";
        }
      } else if (gatewayId === "triebwork.payments.rechnung") {
        methodType = "banktransfer";
        gatewayType = "banktransfer";
      }
      if (!gatewayType!) {
        throw new Error(
          `Could not determine gatewayType for payment ${payment.id} with gateway ` +
            `${payment.gateway} and paymentMethodType ${payment.paymentMethodType}.`,
        );
      }
      if (!methodType!) {
        throw new Error(
          `Could not determine methodType for payment ${payment.id} with gateway ` +
            `${payment.gateway} and paymentMethodType ${payment.paymentMethodType}.`,
        );
      }

      const paymentMethodConnect: Prisma.PaymentMethodCreateNestedOneWithoutPaymentsInput =
        {
          connect: {
            gatewayType_methodType_currency_tenantId: {
              gatewayType,
              methodType,
              currency: checkCurrency(payment.total?.currency),
              tenantId: this.tenantId,
            },
          },
        };
      const orderExist = await this.db.order.findUnique({
        where: {
          orderNumber_tenantId: {
            orderNumber: prefixedOrderNumber,
            tenantId: this.tenantId,
          },
        },
      });
      const orderConnect:
        | Prisma.OrderCreateNestedOneWithoutPaymentsInput
        | undefined = orderExist
        ? {
            connect: {
              id: orderExist.id,
            },
          }
        : undefined;

      const paymentCreateOrConnect: Prisma.PaymentCreateNestedOneWithoutSaleorPaymentInput =
        {
          connectOrCreate: {
            where: {
              referenceNumber_tenantId: {
                referenceNumber: paymentReference,
                tenantId: this.tenantId,
              },
            },
            create: {
              id: id.id("payment"),
              amount: payment.total?.amount as number,
              referenceNumber: paymentReference,
              tenant: {
                connect: {
                  id: this.tenantId,
                },
              },
              paymentMethod: paymentMethodConnect,
              order: orderConnect,
            },
          },
        };

      // check, if we already have this saleor order created, so that we can
      // connect the payment
      const existingSaleorOrder = await this.db.saleorOrder.findUnique({
        where: {
          id_installedSaleorAppId: {
            id: saleorOrder.id,
            installedSaleorAppId: this.installedSaleorAppId,
          },
        },
      });
      const saleorOrderConnect = existingSaleorOrder
        ? {
            connect: {
              id_installedSaleorAppId: {
                id: existingSaleorOrder?.id,
                installedSaleorAppId: this.installedSaleorAppId,
              },
            },
          }
        : undefined;

      await this.db.saleorPayment.upsert({
        where: {
          id_installedSaleorAppId: {
            id: payment?.id,
            installedSaleorAppId: this.installedSaleorAppId,
          },
        },
        create: {
          id: payment?.id,
          createdAt: payment?.created,
          updatedAt: payment?.modified,
          saleorOrder: saleorOrderConnect,
          installedSaleorApp: {
            connect: {
              id: this.installedSaleorAppId,
            },
          },
          payment: paymentCreateOrConnect,
        },
        update: {
          createdAt: payment?.created,
          updatedAt: payment?.modified,
          saleorOrder: saleorOrderConnect,
          payment: paymentCreateOrConnect,
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  /**
   * Should be run AFTER syncToECI() - all orders with a related SaleorOrder
   * and related payments. Tries to create these payments in saleor
   */
  public async syncFromECI(): Promise<void> {
    /**
     * We search all payments that have a related saleor order, but that don't have any related payments in saleor,
     * but related payment in our DB. This happens, when you charge the customer in a 3rd party system
     *
     * This query is expensive right now! It uses many to many relation, which is not possible to improve / index
     */
    const paymentsNotYetInSaleor = await this.db.payment.findMany({
      where: {
        AND: [
          {
            order: {
              saleorOrders: {
                some: {
                  installedSaleorAppId: {
                    contains: this.installedSaleorAppId,
                  },
                },
              },
            },
          },
          {
            saleorPayment: {
              none: {
                installedSaleorAppId: {
                  contains: this.installedSaleorAppId,
                },
              },
            },
          },
        ],
      },
    });
    this.logger.info(
      `Received ${paymentsNotYetInSaleor.length} orders that have a payment and are saleor orders`,
    );

    // for (const payment of paymentsNotYetInSaleor) {

    //   // Pull current order data from saleor - only capture payment, if payment
    //   // does not exit yet. Uses the orderCapture mutation from saleor

    // }
  }
}
