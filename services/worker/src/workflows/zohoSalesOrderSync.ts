import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoSalesOrdersSyncService } from "@eci/pkg/integration-zoho-entities/src/salesorders";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoSalesOrderSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoSalesOrderSyncWorkflowConfig = {
  zohoAppId: string;
};

export class ZohoSalesOrderSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoSalesOrderSyncWorkflowClients,
    config: ZohoSalesOrderSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoSalesOrderSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.zohoAppId = config.zohoAppId;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho contact sync workflow run");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoSalesOrdersSyncService = new ZohoSalesOrdersSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });
    await zohoSalesOrdersSyncService.syncToECI();

    await zohoSalesOrdersSyncService.syncFromECI();

    this.logger.info("Finished zoho contact sync workflow run");
  }
}
