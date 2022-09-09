import type { Invoice, Zoho, ZohoApiError } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";
import { Warning } from "./utils";

export interface ZohoInvoiceSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoApp;
}

export class ZohoInvoiceSyncService {
  private readonly logger: ILogger;

  private readonly zoho: Zoho;

  private readonly db: PrismaClient;

  private readonly zohoApp: ZohoApp;

  private readonly cronState: CronStateHandler;

  private readonly tenantId: string;

  public constructor(config: ZohoInvoiceSyncConfig) {
    this.logger = config.logger;
    this.zoho = config.zoho;
    this.db = config.db;
    this.zohoApp = config.zohoApp;
    this.tenantId = this.zohoApp.tenantId;
    this.cronState = new CronStateHandler({
      tenantId: this.tenantId,
      appId: this.zohoApp.id,
      db: this.db,
      syncEntity: "invoices",
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

    const invoices = await this.zoho.invoice.list({
      createdDateStart: gteDate,
    });

    this.logger.info(
      `We have ${invoices.length} Invoices that changed since last sync run.`,
    );
    if (invoices.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const invoice of invoices) {
      // We first have to check, if we already have a Zoho Customer to be connected to
      // this Invoice
      const customerExist = await this.db.zohoContact.findUnique({
        where: {
          id_zohoAppId: {
            id: invoice.customer_id,
            zohoAppId: this.zohoApp.id,
          },
        },
      });
      const zohoContactConnect = customerExist
        ? {
          connect: {
            id_zohoAppId: {
              id: invoice.customer_id,
              zohoAppId: this.zohoApp.id,
            },
          },
        }
        : undefined;

      // search for a corresponding order using the reference number from the invoice
      const orderExist = await this.db.order.findUnique({
        where: {
          orderNumber_tenantId: {
            orderNumber: invoice.reference_number,
            tenantId: this.tenantId,
          },
        },
      });
      const orderConnect = orderExist
        ? {
          connect: {
            id: orderExist.id,
          },
        }
        : undefined;

      await this.db.zohoInvoice.upsert({
        where: {
          id_zohoAppId: {
            id: invoice.invoice_id,
            zohoAppId: this.zohoApp.id,
          },
        },
        create: {
          id: invoice.invoice_id,
          createdAt: new Date(invoice.created_time),
          updatedAt: new Date(invoice.last_modified_time),
          number: invoice.invoice_number,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          invoice: {
            connectOrCreate: {
              where: {
                invoiceNumber_tenantId: {
                  invoiceNumber: invoice.invoice_number,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("invoice"),
                invoiceNumber: invoice.invoice_number,
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
                orders: orderConnect,
              },
            },
          },
          zohoContact: zohoContactConnect,
        },
        update: {
          createdAt: new Date(invoice.created_time),
          updatedAt: new Date(invoice.last_modified_time),
          invoice: {
            connectOrCreate: {
              where: {
                invoiceNumber_tenantId: {
                  invoiceNumber: invoice.invoice_number,
                  tenantId: this.tenantId,
                },
              },
              create: {
                id: id.id("invoice"),
                invoiceNumber: invoice.invoice_number,
                tenant: {
                  connect: {
                    id: this.tenantId,
                  },
                },
                orders: orderConnect,
              },
            },
          },
          zohoContact: zohoContactConnect,
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
  // TODO2: syncFromECI (standard syncs invoice object) (lower prio for the future)
  // TODO1: syncFromECIAutocreateFromSalesorder (creates an zohoinvoice and eci invoice from an zohosalesorder)
  public async syncFromECI_autocreateInvoiceFromSalesorder(): Promise<void> {
    const ordersWithoutZohoInvoicesFromEciDb = await this.db.order.findMany({
      where: {
        tenant: {
          id: this.zohoApp.tenantId,
        },
        // filter out orders which does have a zohoSalesOrders set with the current zohoAppId
        zohoSalesOrders: {
          some: {
            zohoAppId: this.zohoApp.id,
          },
        },
        invoices: { // TODO test/validate this with ECI db
          none: {
            zohoInvoice: {
              some: {
                zohoAppId: this.zohoApp.id,
              },
            },
          },
        },
      },
      include: {
        zohoSalesOrders: {
          where: {
            zohoAppId: this.zohoApp.id,
          }
        },
        invoices: {
          where: {
            tenantId: this.tenantId,
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
      `Received ${ordersWithoutZohoInvoicesFromEciDb.length} orders without a zohoInvoice. Creating zohoInvoices from them.`,
      {
        orderIds: ordersWithoutZohoInvoicesFromEciDb.map((o) => o.id),
        orderNumbers: ordersWithoutZohoInvoicesFromEciDb.map((o) => o.orderNumber),
      },
    );
    const invoicesToConfirm: Invoice[] = [];
    for (const ordersWithoutZohoInvoice of ordersWithoutZohoInvoicesFromEciDb) {
      try {  
        if (
          !ordersWithoutZohoInvoice?.zohoSalesOrders || ordersWithoutZohoInvoice?.zohoSalesOrders.length === 0
        ) {
          throw new Warning(
            "No zohoSalesOrders set for this order. Aborting sync of this order. Try again after zoho salesorder sync."
          );
        }
        if (ordersWithoutZohoInvoice?.zohoSalesOrders.length > 1) {
          throw new Error(
            "Multiple zohoSalesOrders set for this order. Aborting sync of this order.",
          );
        }
        const zohoSalesOrder = ordersWithoutZohoInvoice.zohoSalesOrders[0];
        const createdInvoice = await this.zoho.invoice.createFromSalesOrder(zohoSalesOrder.id);

        if(createdInvoice.contact_persons.length === 0) {
          this.logger.warn(
            "No contact person is set in invoice. Therefore zohoInvoice will be created without a zohoContactPerson"
          );
        }
        if(createdInvoice.contact_persons.length > 1) {
          // not sure how big this problem is, if its okay than may change this log-level to WARNING
          this.logger.error(
            "Multiple contact persons connected to one invoice but only one zohoContactPerson can be set for an zohoInvoice. "+
            "Therefore we just use the first contact person for the internal DB, please check this manually if thats okay. "+
            "(Change this to a WARNING if it is okay)"
          );
        }

        // TODO: handle case if invoice was already created in zoho but does not exist in DB
        // TODO: handle case for a salesorder without any lineitems / 100% discount / 0€ total
        await this.db.invoice.create({
          data: {
            id: id.id("invoice"),
            orders: {
              connect: {
                id: ordersWithoutZohoInvoice.id,
              },
            },
            invoiceNumber: createdInvoice.invoice_number,
            tenant: {
              connect: {
                id: this.tenantId,
              }
            },
            zohoInvoice: {
              connectOrCreate: {
                where: {
                  id_zohoAppId: {
                    id: createdInvoice.invoice_id,
                    zohoAppId: this.zohoApp.id,
                  }
                },
                create: {
                  id: createdInvoice.invoice_id,
                  createdAt: new Date(createdInvoice.created_time),
                  updatedAt: new Date(createdInvoice.last_modified_time),
                  number: createdInvoice.invoice_number,
                  zohoApp: {
                    connect: {
                      id: this.zohoApp.id,
                    }
                  },
                  zohoContact: {
                    connect: {
                      id_zohoAppId:{
                        id: createdInvoice.customer_id,
                        zohoAppId: this.zohoApp.id,
                      }
                    },
                  },
                  // TODO: should we change this in ECI db to also be able to connect multiple contact persons?
                  ...(createdInvoice.contact_persons?.[0] ? {zohoContactPerson:{
                    connect: {
                      id_zohoAppId: {
                        id: createdInvoice.contact_persons?.[0], // TODO add check if 
                        zohoAppId: this.zohoApp.id,
                      }
                    }
                  }} : {}),
                }
              }
            }
          },
        });
        this.logger.info(
          `Successfully created a zoho Invoice ${createdInvoice.invoice_number}`,
          {
            orderId: ordersWithoutZohoInvoice.id,
            orderNumber: ordersWithoutZohoInvoice.orderNumber,
            orderMainContactId: ordersWithoutZohoInvoice.mainContactId,
            invoiceMainContactId: createdInvoice.customer_id,
            invoiceNumber: createdInvoice.invoice_number,
            invoiceId: createdInvoice.invoice_id,
            referenceNumber: createdInvoice.reference_number,
            zohoAppId: this.zohoApp.id,
            tenantId: this.tenantId,
          },
        );
        invoicesToConfirm.push(createdInvoice);
      } catch (err) {
        if (err instanceof Warning) {
          this.logger.warn(err.message, { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber });
        } else if (err instanceof Error) {
          // TODO zoho-ts package: add enum for error codes . like this:
          // if(err as ZohoApiError).code === require(zoho-ts).apiErrorCodes.SalesOrderAlreadyExists){
          if ((err as ZohoApiError).code === 36004) {
            // 36004 = This sales order number already exists.
            this.logger.warn(err.message, { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber });
            // const searchedSalesOrders = await this.zoho.salesOrder.search(
            //   order.orderNumber,
            // );
            // if (searchedSalesOrders.length === 0) {
            //   this.logger.error(
            //     "Salesorder was already created and search with order.orderNumber returned no results. Aborting sync of this order.",
            //     { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber },
            //   );
            //   continue;
            // }
            // if (searchedSalesOrders.length > 1) {
            //   this.logger.error(
            //     "Salesorder was already created and search with order.orderNumber returned multiple results. Aborting sync of this order.",
            //     { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber },
            //   );
            //   continue;
            // }
            // const matchingSalesOrder = searchedSalesOrders[0];
            // await this.db.zohoSalesOrder.create({
            //   data: {
            //     id: matchingSalesOrder.salesorder_id,
            //     order: {
            //       connect: {
            //         id: order.id,
            //       },
            //     },
            //     zohoApp: {
            //       connect: {
            //         id: this.zohoApp.id,
            //       },
            //     },
            //     createdAt: new Date(matchingSalesOrder.created_time),
            //     updatedAt: new Date(matchingSalesOrder.last_modified_time),
            //     // zohoContact // TODO is this needed? --> remove it from the schema if it is really not needed
            //     // zohoContactPerson // TODO is this needed? --> remove it from the schema if it is really not needed
            //   },
            // });
            // this.logger.info(
            //   `Successfully attached zoho salesorder ${matchingSalesOrder.salesorder_number} from search request to the current order`,
            //   {
            //     orderId: order.id,
            //     mainContactId: order.mainContactId,
            //     orderNumber: order.orderNumber,
            //     referenceNumber: order.referenceNumber,
            //     zohoAppId: this.zohoApp.id,
            //     tenantId: this.tenantId,
            //   },
            // );
          } else {
            this.logger.error(err.message, { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber });
          }
        } else {
          this.logger.error(
            "An unknown Error occured: " + (err as any)?.toString(),
            { eciOrderId: ordersWithoutZohoInvoice.id, eciOrderNumber: ordersWithoutZohoInvoice.orderNumber },
          );
        }
      }
      try {
        await this.zoho.invoice.sent(
          invoicesToConfirm.map((inv) => inv.invoice_id),
        );
        this.logger.info(
          `Successfully confirmed ${invoicesToConfirm.length} invoice(s).`,
          {
            invoiceNumbersToConfirm: invoicesToConfirm.map(
              (inv) => inv.invoice_number,
            ),
            invoiceIDsToConfirm: invoicesToConfirm.map(
              (inv) => inv.invoice_id,
            ),
          },
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? `${err.name}:\n${err.message}`
            : JSON.stringify(err);
        this.logger.error(
          "Could not confirm all invoices after creating them. Please check Zoho and confirm them manually.",
          {
            submitedinvoiceIds: invoicesToConfirm.map(
              (inv) => inv.invoice_id,
            ),
            submitedinvoiceNumbers: invoicesToConfirm.map(
              (inv) => inv.invoice_number,
            ),
            zohoClientErrorMessage: errorMsg,
          },
        );
      }
    }
  }
}
