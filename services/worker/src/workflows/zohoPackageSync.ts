import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoPackageSyncService } from "@eci/pkg/integration-zoho-entities/src/packages";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoPackageSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoPackageSyncWorkflowConfig = {
  zohoAppId: string;
};

export class ZohoPackageSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoPackageSyncWorkflowClients,
    config: ZohoPackageSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoPackageSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.zohoAppId = config.zohoAppId;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho package sync workflow run");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoSalesOrdersSyncService = new ZohoPackageSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });
    await zohoSalesOrdersSyncService.syncToECI();

    this.logger.info("Finished zoho package sync workflow run");
  }
}
