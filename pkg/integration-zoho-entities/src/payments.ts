import { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { Warning } from "./utils";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoPaymentSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohoPaymentSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoAppWithTenant;

  private readonly cronState: CronStateHandler;

  public constructor(config: ZohoPaymentSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
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

      /**
       * Match the different payment types that might come from Zoho to our
       * more generic internal types
       */
      // const paymentMethodMatch: { [key: string]: PaymentMethodType } = {
      //   braintree: "braintree",
      //   banküberweisung: "banktransfer",
      //   "Bank Geldüberweisung": "banktransfer",
      //   banktransfer: "banktransfer",
      //   paypal: "paypal",
      //   onlinepayment: "onlinepayment",
      // };
      // const paymentMethod: PaymentMethodType =
      //   paymentMethodMatch[payment.payment_mode.toLowerCase()];

      // if (!paymentMethod) {
      //   this.logger.error(
      //     // eslint-disable-next-line max-len
      //     `Can't match the payment method type of payment ${payment.payment_id}. Got type: ${payment.payment_mode} from Zoho`,
      //   );
      //   continue;
      // }
      // We first have to check, if we already have a Zoho Customer to be connected to
      // this payment
      const customerExist = await this.db.zohoContact.findUnique({
        where: {
          id_zohoAppId: {
            id: payment.customer_id,
            zohoAppId: this.zohoApp.id,
          },
        },
      });
      const zohoContactConnect = customerExist
        ? {
            connect: {
              id_zohoAppId: {
                id: payment.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          }
        : {};

      // We try to connect existing invoices with this payment using the invoice Ids
      const invoiceConnect =
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
      const paymentConnectOrCreate = {
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
          zohoContact: zohoContactConnect,
          payment: paymentConnectOrCreate,
        },
        update: {
          createdAt: new Date(payment.created_time),
          updatedAt: new Date(payment.last_modified_time),
          zohoContact: zohoContactConnect,
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
          some: {
            zohoAppId: this.zohoApp.id,
          },
        },
      },
      include: {
        invoices: {
          where: {
            tenantId: this.zohoApp.tenantId,
          },
          include: {
            zohoInvoice: {
              where: {
                zohoAppId: this.zohoApp.id,
              }
            }
          }
        }
      },
    });

    this.logger.info(
      `Received ${paymentsWithoutZohoPaymentFromEciDb.length} orders without a zohoInvoice. Creating zohoInvoices from them.`,
      {
        paymentIds: paymentsWithoutZohoPaymentFromEciDb.map((p) => p.id),
        paymentReferenceNumber: paymentsWithoutZohoPaymentFromEciDb.map((p) => p.referenceNumber),
      },
    );
    for (const payment of paymentsWithoutZohoPaymentFromEciDb) {
      try {  
        const createdPayment = await this.zoho.payment.create({
          "amount": payment.amount,
          "account_id": payment.paymentMethod
        });

        // await this.db.payment.create({
        //   data: {
        //     id: id.id("payment"),
        //     orders: {
        //       connect: {
        //         id: payment.id,
        //       },
        //     },
        //     paymentNumber: createdPayment.payment_number,
        //     tenant: {
        //       connect: {
        //         id: this.tenantId,
        //       }
        //     },
        //     zohopayment: {
        //       connectOrCreate: {
        //         where: {
        //           id_zohoAppId: {
        //             id: createdPayment.payment_id,
        //             zohoAppId: this.zohoApp.id,
        //           }
        //         },
        //         create: {
        //           id: createdPayment.payment_id,
        //           createdAt: new Date(createdPayment.created_time),
        //           updatedAt: new Date(createdPayment.last_modified_time),
        //           number: createdPayment.payment_number,
        //           zohoApp: {
        //             connect: {
        //               id: this.zohoApp.id,
        //             }
        //           },
        //           zohoContact: {
        //             connect: {
        //               id_zohoAppId:{
        //                 id: createdPayment.customer_id,
        //                 zohoAppId: this.zohoApp.id,
        //               }
        //             },
        //           },
        //           // TODO: should we change this in ECI db to also be able to connect multiple contact persons?
        //           ...(createdPayment.contact_persons?.[0] ? {zohoContactPerson:{
        //             connect: {
        //               id_zohoAppId: {
        //                 id: createdPayment.contact_persons?.[0], // TODO add check if 
        //                 zohoAppId: this.zohoApp.id,
        //               }
        //             }
        //           }} : {}),
        //         }
        //       }
        //     }
        //   },
        // });
        // this.logger.info(
        //   `Successfully created a zoho payment ${createdPayment.payment_number}`,
        //   {
        //     orderId: payment.id,
        //     orderNumber: payment.orderNumber,
        //     orderMainContactId: payment.mainContactId,
        //     paymentMainContactId: createdPayment.customer_id,
        //     paymentNumber: createdPayment.payment_number,
        //     paymentId: createdPayment.payment_id,
        //     referenceNumber: createdPayment.reference_number,
        //     zohoAppId: this.zohoApp.id,
        //     tenantId: this.tenantId,
        //   },
        // );
      } catch (err) {
        if (err instanceof Warning) {
          this.logger.warn(err.message, { eciOrderId: payment.id, eciOrderNumber: payment.orderNumber });
        } else if (err instanceof Error) {
          // TODO zoho-ts package: add enum for error codes . like this:
          // if(err as ZohoApiError).code === require(zoho-ts).apiErrorCodes.NoItemsToBepaymentd){
          if ((err as ZohoApiError).code === 36026) {
            this.logger.warn(
              "Aborting sync of this payment since it was already created. The syncToEci will handle this. Original Error: "+err.message,
              { eciOrderId: payment.id, eciOrderNumber: payment.orderNumber }
            );
          } else {
            this.logger.error(err.message, { eciOrderId: payment.id, eciOrderNumber: payment.orderNumber });
          }
        } else {
          this.logger.error(
            "An unknown Error occured: " + (err as any)?.toString(),
            { eciOrderId: payment.id, eciOrderNumber: payment.orderNumber },
          );
        }
      }
    }
  }
}
