import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoInvoiceSyncService } from "@eci/pkg/integration-zoho-entities/src/invoices";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoInvoiceSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoInvoiceSyncWorkflowConfig = {
  zohoAppId: string;
};

export class ZohoInvoiceSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoInvoiceSyncWorkflowClients,
    config: ZohoInvoiceSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoInvoiceSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.zohoAppId = config.zohoAppId;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting zoho invoice sync workflow run");
    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoInvoiceSyncService = new ZohoInvoiceSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp: zohoApp,
      createdTimeOffset: 20,
    });
    await zohoInvoiceSyncService.syncToECI();

    this.logger.info("Finished zoho invoice sync workflow run");
  }
}
