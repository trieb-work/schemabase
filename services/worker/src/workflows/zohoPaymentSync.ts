import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoPaymentSyncService } from "@eci/pkg/integration-zoho-entities/src/payments";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";
import { ZohoBankAccountsSyncService } from "@eci/pkg/integration-zoho-entities/src/bankaccounts";

export type ZohoPaymentSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoPaymentSyncWorkflowConfig = {
  zohoAppId: string;
};

export class ZohoPaymentSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoPaymentSyncWorkflowClients,
    config: ZohoPaymentSyncWorkflowConfig,
  ) {
    this.zohoAppId = config.zohoAppId;
    this.logger = ctx.logger.with({
      workflow: ZohoPaymentSyncWf.name,
      zohoAppId: this.zohoAppId,
    });
    this.prisma = clients.prisma;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho bank acounts + payment sync workflow run");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoBankAccountsSyncService = new ZohoBankAccountsSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });

    const zohoPaymentSyncService = new ZohoPaymentSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
      createdTimeOffset: 30,
    });

    await zohoBankAccountsSyncService.syncToECI();
    await zohoPaymentSyncService.syncToECI();
    await zohoPaymentSyncService.syncFromECI();

    this.logger.info("Finished zoho bank acounts + payment sync workflow run");
  }
}
