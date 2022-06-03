import { Zoho, Payment } from "@trieb.work/zoho-ts/dist/v2";
import { ILogger } from "@eci/pkg/logger";
import { PrismaClient, Prisma, ZohoApp } from "@eci/pkg/prisma";
// import { id } from "@eci/pkg/ids";
import { CronStateHandler } from "@eci/pkg/cronstate";
import { format, setHours, subDays, subYears } from "date-fns";

type ZohoAppWithTenant = ZohoApp & Prisma.TenantInclude;

export interface ZohoPaymentSyncConfig {
  logger: ILogger;
  zoho: Zoho;
  db: PrismaClient;
  zohoApp: ZohoAppWithTenant;
}

export class ZohopaymentSyncService {
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
    }

    const payments = await this.zoho.payment.list({
      dateStart: gteDate,
    });

    this.logger.info(
      `We have ${payments.length} payments that changed since last sync run.`,
    );
    if (payments.length === 0) {
      await this.cronState.set({
        lastRun: new Date(),
        lastRunStatus: "success",
      });
      return;
    }

    for (const payment of payments) {
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
          createdAt: payment.created_time,
          updatedAt: payment.last_modified_time,
          zohoContact: {
            connect: {
              id_zohoAppId: {
                id: payment.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          },
        },
        update: {
          createdAt: payment.created_time,
          updatedAt: payment.last_modified_time,
          zohoContact: {
            connect: {
              id_zohoAppId: {
                id: payment.customer_id,
                zohoAppId: this.zohoApp.id,
              },
            },
          },
        },
      });
    }

    await this.cronState.set({
      lastRun: new Date(),
      lastRunStatus: "success",
    });
  }
}
