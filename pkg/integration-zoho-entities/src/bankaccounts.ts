import type { Zoho, ZohoApiError } from "@trieb.work/zoho-ts";
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
      syncEntity: "bankaccounts",
    });
  }

  /**
   * Pull all bank accounts from Zoho and sync them with internal gateways
   */
  public async syncToECI() {
    const accounts = await this.zoho.bankaccount.list();

    this.logger.info(
      `Upserting ${accounts.length} bankaccounts with our internal DB`,
    );

    for (const account of accounts) {
      await this.db.zohoBankAccount.upsert({
        where: {
          id_zohoAppId: {
            zohoAppId: this.zohoApp.id,
            id: account.account_id,
          },
        },
        create: {
          id: account.account_id,
          zohoApp: {
            connect: {
              id: this.zohoApp.id,
            },
          },
          active: account.is_active,
        },
        update: {
          active: account.is_active,
        },
      });
    }
  }
}
