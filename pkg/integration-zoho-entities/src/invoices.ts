import type { Zoho } from "@trieb.work/zoho-ts";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, ZohoApp } from "@eci/pkg/prisma";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";
import { id } from "@eci/pkg/ids";

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
      const customerExist = await this.db.zohoContact.findFirst({
        where: {
          id: invoice.customer_id,
          zohoAppId: this.zohoApp.id,
        },
      });

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

      const zohoContactConnect = customerExist
        ? {
            connect: {
              id_zohoAppId: {
                id: invoice.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          }
        : {};

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
}
