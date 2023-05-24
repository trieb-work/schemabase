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

export class ZohoPackageSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoPackageSyncWorkflowClients,
    config: ZohoPackageSyncWorkflowConfig,
  ) {
    this.zohoAppId = config.zohoAppId;
    this.logger = ctx.logger.with({
      workflow: ZohoPackageSyncWf.name,
      zohoAppId: this.zohoAppId,
    });
    this.prisma = clients.prisma;
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
    await zohoSalesOrdersSyncService.syncFromECI();

    this.logger.info("Finished zoho package sync workflow run");
  }
}
