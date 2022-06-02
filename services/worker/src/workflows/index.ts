import { ZohoAppWithTenant, ZohoContactSyncService } from "@eci/pkg/integration-zoho-entities/src/contacts";
import { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { Zoho } from "@trieb.work/zoho-ts/dist/v2";

export type ZohoSyncInvoicesWorkflowClients = {
  prisma: PrismaClient;
  zoho: Zoho;
};
export type ZohoSyncInvoicesWorkflowConfig = {
  zohoApp: ZohoAppWithTenant;
};
export class ZohoSyncInvoicesWorkflow implements Workflow {
  private logger: ILogger;

  private zohoContactSyncService: ZohoContactSyncService;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoSyncInvoicesWorkflowClients,
    config: ZohoSyncInvoicesWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoSyncInvoicesWorkflow.name,
    });
    this.zohoContactSyncService = new ZohoContactSyncService({
      logger: this.logger,
      zoho: clients.zoho,
      db: clients.prisma,
      zohoApp: config.zohoApp,
    })
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho invoices sync workflow run");
    await this.zohoContactSyncService.syncToECI();
  }
}
