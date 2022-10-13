import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorWarehouseSyncService } from "@eci/pkg/integration-saleor-entities/src/warehouses";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorWarehouseSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorWarehouseSyncWorkflowConfig = {
  installedSaleorAppId: string;
};

export class SaleorWarehouseSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorWarehouseSyncWorkflowClients,
    config: SaleorWarehouseSyncWorkflowConfig,
  ) {
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.logger = ctx.logger.with({
      workflow: SaleorWarehouseSyncWorkflow.name,
      installedSaleorAppId: this.installedSaleorAppId,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting saleor warehouse sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const saleorWarehouseSyncService = new SaleorWarehouseSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      installedSaleorAppId: this.installedSaleorAppId,
      tenantId: installedSaleorApp.saleorApp.tenantId,
    });
    await saleorWarehouseSyncService.syncToECI();
    this.logger.info("Finished saleor warehouse sync workflow run");
  }
}
