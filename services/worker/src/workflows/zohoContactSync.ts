import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoContactSyncService } from "@eci/pkg/integration-zoho-entities/src/contacts";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoContactSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoContactSyncWorkflowConfig = {
  zohoAppId: string;
};

export class ZohoContactSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoContactSyncWorkflowClients,
    config: ZohoContactSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoContactSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.zohoAppId = config.zohoAppId;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho invoices sync workflow run");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoContactSyncService = new ZohoContactSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });
    await zohoContactSyncService.syncToECI();
    this.logger.info("Finished zoho invoices sync workflow run");
  }
}
