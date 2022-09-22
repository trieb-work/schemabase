import { Zoho, ZohoApiError } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { addMinutes, format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { Warning } from "./utils";
import { CreatePayment } from "@trieb.work/zoho-ts/dist/types/payment";
import { orderToMainContactPerson } from "./salesorders/contacts";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoPaymentSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
  /**
   * Time offset in Minutes between creation and execution before this Entity will get synced.
   */
  createdTimeOffset: number;
}

export class ZohoPaymentSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly createdTimeOffsetMin: number;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoPaymentSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.createdTimeOffsetMin = config.createdTimeOffset;
    this.cronState = new CronStateHandler({
      tenantId: this.zohoApp.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "payments",
    });
  }

  public async syncToECI(): Promise<void> {
    // const tenantId = this.zohoApp.tenantId;

    const cronState = await this.cronState.get();

    const now = new Date();
    const yesterdayMidnight = setHours(subDays(now, 1), 0);
    let gteDate = format(yesterdayMidnight, "yyyy-MM-dd");

    if (cronState.lastRun === null) {
      gteDate = format(subYears(now, 1), "yyyy-MM-dd");
      this.logger.info(
        `This seems to be our first sync run. Setting GTE date to ${gteDate}`,
      );
    } else {
      this.logger.info(`Setting GTE date to ${gteDate}`);
    }

    const payments = await this.zoho.payment.list({
      dateStart: gteDate,
    });

    this.logger.info(
      `We have ${payments.length} payments that we need to sync.`,
    );
    if (payments.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const payment of payments) {
      const referenceNumber =
        payment.reference_number ||
        payment.cf_gateway_transaction_id ||
        payment.payment_number;
      // TODO: maybe add a second option as reference number identifier,
      // if no reference number is given
      if (!referenceNumber) {
        this.logger.warn(
          `Can't process payment, as no reference number is given ${payment.payment_id}`,
        );
        continue;
      }

      // We try to connect existing invoices with this payment using the invoice Ids
      const invoiceConnect:
        | Prisma.InvoiceCreateNestedManyWithoutPaymentsInput
        | undefined =
        payment.invoice_numbers_array?.length > 0
          ? {
            connect: payment.invoice_numbers_array.map((id) => ({
              invoiceNumber_tenantId: {
                invoiceNumber: id,
                tenantId: this.zohoApp.tenantId,
              },
            })),
          }
          : undefined;

      // connect or create the Zoho Payment with our internal payment entity
      const paymentConnectOrCreate: Prisma.PaymentCreateNestedOneWithoutZohoPaymentInput =
      {
        connectOrCreate: {
          where: {
            referenceNumber_tenantId: {
              referenceNumber,
              tenantId: this.zohoApp.tenantId,
            },
          },
          create: {
            id: id.id("payment"),
            amount: payment.amount,
            referenceNumber,
            paymentMethod: {
              connect: {
                zohoBankAccountId_zohoBankAccountZohoAppId: {
                  zohoBankAccountId: payment.account_id,
                  zohoBankAccountZohoAppId: this.zohoApp.id,
                },
              },
            },
            tenant: {
              connect: {
                id: this.zohoApp.tenantId,
              },
            },
            invoices: invoiceConnect,
          },
        },
      };

      await this.db.zohoPayment.upsert({
        where: {
          id_zohoAppId: {
            id: payment.payment_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: payment.payment_id,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          createdAt: new Date(payment.created_time),
          updatedAt: new Date(payment.last_modified_time),
          // zohoContact: zohoContactConnect,
          payment: paymentConnectOrCreate,
        },
        update: {
          createdAt: new Date(payment.created_time),
          updatedAt: new Date(payment.last_modified_time),
          // zohoContact: zohoContactConnect,
          payment: paymentConnectOrCreate,
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }

  public async syncFromECI(): Promise<void> {
    const paymentsWithoutZohoPaymentFromEciDb = await this.db.payment.findMany({
      where: {
        tenant: {
          id: this.zohoApp.tenantId,
        },
        // filter out payments which does have a zohoPayment set with the current zohoAppId
        zohoPayment: {
          none: {
            zohoAppId: this.zohoApp.id,
          },
        },
        // filter out orders which are newer than 30min to increase the likelihood that the
        // zoho invoice was created
        createdAt: {
          // TODO: schedule hint: make sure order and then invoice is created before this job runs
          lte: addMinutes(new Date(), -this.createdTimeOffsetMin),
        },
        order: {
          tenantId: this.zohoApp.tenantId,
        }
        // TEST this out: make sure braintree sync runs before this sync
        // NOT: {
        //   AND: {
        //     braintreeTransactions: {
        //       none: {
        //         braintreeApp: {
        //           tenantId: this.zohoApp.tenantId,
        //         },
        //       },
        //     },
        //     paymentMethod: {
        //       AND: {
        //         gatewayType: "braintree",
        //         methodType: "paypal",
        //       },
        //     },
        //   },
        // },
      },
      include: {
        order: {
          include: {
            mainContact: {
              include: {
                zohoContactPersons: {
                  where: {
                    zohoAppId: this.zohoApp.id,
                  },
                },
              },
            },
            invoices: {
              include: {
                zohoInvoice: {
                  where: {
                    zohoAppId: this.zohoApp.id,
                  },
                },
              },
            },
          },
        },
        paymentMethod: {
          include: {
            saleorPaymentGateway: true,
            zohoBankAccount: true,
          },
        },
        braintreeTransactions: true,
        // invoices: { // TODO maybe delete invoices in Payment schema
        //   where: {
        //     tenantId: this.zohoApp.tenantId,
        //   },
        //   include: {
        //     orders: {
        //       where: {
        //         tenantId: this.zohoApp.tenantId,
        //       },
        //     },
        //     zohoInvoice: {
        //       where: {
        //         zohoAppId: this.zohoApp.id,
        //       },
        //     },
        //   },
        // },
      },
    });

    this.logger.info(
      // eslint-disable-next-line max-len
      `Received ${paymentsWithoutZohoPaymentFromEciDb.length} payment(s) without a zohoPayment. Creating zohoPayments from them.`,
      {
        paymentIds: paymentsWithoutZohoPaymentFromEciDb.map((p) => p.id),
        paymentReferenceNumber: paymentsWithoutZohoPaymentFromEciDb.map(
          (p) => p.referenceNumber,
        ),
      },
    );
    for (const payment of paymentsWithoutZohoPaymentFromEciDb) {
      try {
        const zba = payment.paymentMethod.zohoBankAccount;
        if (!zba) {
          throw new Error(
            `No Zohobankaccount attached to the current payment method ${payment.paymentMethod.id}`,
          );
        }
        if (zba.zohoAppId !== this.zohoApp.id) {
          throw new Error(
            `the ZohoAppId (${zba.zohoAppId}) from the Zohobankaccountattached attached to the current payment method ` +
            `(${payment.paymentMethod.id}) does not equal the zohoAppId of the current workflow run (${this.zohoApp.id})`,
          );
        }
        if (payment.paymentMethod.gatewayType === "stripe") {
          // maybe it also works with stripe but this is untested so we throw an error first (also we need stripe payment fee sync)
          throw new Error(
            `Gateway Type stripe is currenctly unsuported, please extend and test zoho-ts client (zoho.payment.create)` +
            ` with stripe first.`,
          );
        }
        if (
          payment.paymentMethod.gatewayType === "braintree" &&
          payment.paymentMethod.methodType === "paypal" &&
          (!payment.braintreeTransactions || payment.braintreeTransactions.length === 0)
        ) {
          throw new Warning(
            `Payment is a braintree/paypal payment but no payment.braintreeTransactions and therefore `+
            `no payment fees are synced yet. Need them before we can create the payment. `+
            `Aborting and retrying sync later.`
          );
        }
        // Moved to another logic of using the payment.order and not payment.invoices
        // if (payment.invoices.some((inv) => inv.zohoInvoice.length > 0)){
        //   throw new Error(`Some invoices have more then one zohoInvoice attached for the current ZohoAppId`);
        // }
        // if (payment.invoices.some((inv) => inv.zohoInvoice.length === 0)){
        //   throw new Warning(
        //     `Some invoices have no zohoInvoice attached for the current ZohoAppId. Aborting`+
        //     ` sync and retry after Zoho Invoice creation.`
        //   );
        // }
        // if (payment.invoices.some((inv) => inv.orders.length > 0)){
        //   throw new Warning(
        //     `Some invoices have multiple orders attached for the current TenantId, therefore `+
        //     `we use the sum of all order.totalPriceGross as the amount applied, please double check this anomalie.`
        //   );
        // }
        // if (payment.invoices.some((inv) => inv.orders.length === 0)){
        //   throw new Error(
        //     `Some invoices have no order attached for the current TenantId, therefore `+
        //     `we do not know the amount_applied for the invoices. Aborting sync.`
        //   );
        // }
        // Make invoice optional and only implement standard logic
        // const invoices: CreatePayment["invoices"] = payment.invoices.map((inv) => ({
        //   invoice_id: inv.zohoInvoice?.[0]?.invoiceId,
        //   amount_applied: inv.orders.reduce((sum, order) => sum + order.totalPriceGross, 0),
        // }))

        if (!payment.order) {
          throw new Error(
            "Can only sync payments to zoho if the payment is accociated to an Order. Otherwise it is not possible to connect the zoho payment to a zoho customer.",
          );
        }
        if (!payment?.order?.invoices || payment?.order?.invoices?.length === 0) {
          throw new Warning("No Invoices attached to Order. Aborting Sync and retry next time.");
        }
        const invoices: CreatePayment["invoices"] = [];
        for (const inv of payment.order.invoices) {
          if (inv.zohoInvoice.length !== 1) {
            throw new Error(
              `None or Multiple Zoho Invoices exist for Invoice ${inv.invoiceNumber}/${inv.id}.`,
            );
          }
          invoices.push({
            invoice_id: inv.zohoInvoice?.[0].id,
            amount_applied: inv.invoiceTotalGross,
          });
        }

        const totalInvoicedAmount = invoices.reduce(
          (sum, { amount_applied }) => sum + amount_applied,
          0,
        );
        if (payment.amount !== totalInvoicedAmount) {
          throw new Error(
            `The sum of all invoice totals (${totalInvoicedAmount}) is not equeal to the payment amount (${payment.amount}). Aborting sync.`,
          );
        }

        this.logger.debug(`Creating a zoho payment for Reference Number ${payment.referenceNumber} Order Number ${payment.order.orderNumber}, customer_id:${orderToMainContactPerson(payment.order).zohoContactId}`);

        this.logger.debug(`submited payment create object`,{
          amount: payment.amount,
          account_id: zba.id,
          date: payment.createdAt.toISOString().substring(0, 10),
          payment_mode: payment.paymentMethod.gatewayType,
          bank_charges: payment.transactionFee,
          reference_number: payment.referenceNumber,
          customer_id: orderToMainContactPerson(payment.order).zohoContactId,
          invoices,
        });
        const createdPayment = await this.zoho.payment.create({
          amount: payment.amount,
          account_id: zba.id,
          date: payment.createdAt.toISOString().substring(0, 10),
          payment_mode: payment.paymentMethod.gatewayType,
          bank_charges: payment.transactionFee,
          reference_number: payment.referenceNumber,
          customer_id: orderToMainContactPerson(payment.order).zohoContactId,
          invoices,
        });
        await this.db.zohoPayment.create({
          data: {
            id: createdPayment.payment_id,
            createdAt: new Date(createdPayment.created_time),
            updatedAt: new Date((createdPayment as any).updated_time), // TODO remove this hack after zoho-ts PR #18 is merged
            zohoApp: {
              connect: {
                id: this.zohoApp.id,
              },
            },
            payment: {
              connect: {
                id: payment.id,
              },
            },
          },
        });
        this.logger.info(
          `Successfully created a zoho payment ${createdPayment.payment_number}`,
          {
            zohoPaymentNumber: createdPayment.payment_number,
            zohoPaymentId: createdPayment.payment_id,
            zohoAccountId: createdPayment.account_id,
            orderId: payment.id,
            orderNumber: payment.order.orderNumber,
            zohoAppId: this.zohoApp.id,
            tenantId: this.zohoApp.tenantId,
          },
        );
      } catch (err) {
        const defaultLogFields = {
          eciPaymentId: payment.id,
          eciPaymentReferenceNumber: payment.referenceNumber,
          eciOrderId: payment.orderId,
        };
        if (err instanceof Warning) {
          this.logger.warn(err.message, defaultLogFields);
        } else if (err instanceof Error) {
          // TODO zoho-ts package: add enum for error codes . like this:
          // if(err as ZohoApiError).code === require(zoho-ts).apiErrorCodes.NoItemsToBepaymentd){
          if ((err as ZohoApiError).code === 36026) {
            this.logger.warn(
              "Aborting sync of this payment since it was already created. The syncToEci will handle this. Original Error: " +
              err.message,
              defaultLogFields,
            );
          } else {
            this.logger.error(err.message, defaultLogFields);
          }
        } else {
          this.logger.error(
            "An unknown Error occured: " + (err as any)?.toString(),
            defaultLogFields,
          );
        }
      }
    }
  }

  // only runs once a month, should run after current braintree "Transaction Fee Report" is uploaded and attached to the payments
  // all payments with payment.updatedAt > zohoPayment.updatedAt
  // public async syncFromECI_updateBankCharges(): Promise<void> {
  // }
}
