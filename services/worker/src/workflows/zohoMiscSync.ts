import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoWarehouseSyncService } from "@eci/pkg/integration-zoho-entities/src/warehouses";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";
import { ZohoTaxSyncService } from "@eci/pkg/integration-zoho-entities/src/taxes";

export type ZohoMiscSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoMiscSyncWorkflowConfig = {
  zohoAppId: string;
};

/**
 * Workflow to sync needed "surrounding" entities from Zoho like Warehouses, Taxes, etc.
 */
export class ZohoMiscSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoMiscSyncWorkflowClients,
    config: ZohoMiscSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: ZohoMiscSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.zohoAppId = config.zohoAppId;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting Zoho misc sync workflow run");

    const { client: zoho, zohoApp } = await getZohoClientAndEntry(
      this.zohoAppId,
      this.prisma,
      undefined,
    );
    const zohoWarehouseSyncService = new ZohoWarehouseSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });
    const result1 = zohoWarehouseSyncService.syncToECI();

    const zohoTaxSyncService = new ZohoTaxSyncService({
      logger: this.logger,
      zoho,
      db: this.prisma,
      zohoApp,
    });
    const result2 = zohoTaxSyncService.syncToECI();

    await Promise.resolve([result1, result2]);

    this.logger.info("Finished Zoho Misc sync workflow run");
  }
}
