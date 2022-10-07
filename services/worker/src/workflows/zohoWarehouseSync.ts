import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { ZohoWarehouseSyncService } from "@eci/pkg/integration-zoho-entities/src/warehouses";
import { getZohoClientAndEntry } from "@eci/pkg/zoho/src/zoho";

export type ZohoWarehouseSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type ZohoWarehouseSyncWorkflowConfig = {
  zohoAppId: string;
};

/**
 * Workflow to sync needed "surrounding" entities from Zoho like Warehouses, Taxes, etc.
 */
export class ZohoWarehouseSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private zohoAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: ZohoWarehouseSyncWorkflowClients,
    config: ZohoWarehouseSyncWorkflowConfig,
  ) {
    this.zohoAppId = config.zohoAppId;
    this.logger = ctx.logger.with({
      workflow: ZohoWarehouseSyncWorkflow.name,
      zohoAppId: this.zohoAppId,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting Zoho Warehouse sync workflow run");

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
    await zohoWarehouseSyncService.syncToECI();

    this.logger.info("Finished Zoho Warehouse sync workflow run");
  }
}
