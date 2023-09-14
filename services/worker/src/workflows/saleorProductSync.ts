import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorProductSyncService } from "@eci/pkg/integration-saleor-entities/src/products";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorProductSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorProductSyncWorkflowConfig = {
  installedSaleorAppId: string;
};

export class SaleorProductSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  private ctx: RuntimeContext;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorProductSyncWorkflowClients,
    config: SaleorProductSyncWorkflowConfig,
  ) {
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.logger = ctx.logger.with({
      workflow: SaleorProductSyncWf.name,
      installedSaleorAppId: this.installedSaleorAppId,
    });
    this.prisma = clients.prisma;
    this.ctx = ctx;
    this.installedSaleorAppId = config.installedSaleorAppId;
  }

  /**
   * Sync all saleor products with the schemabase database
   */
  public async run(): Promise<void> {
    this.logger.info("Starting saleor product sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const saleorProductSyncService = new SaleorProductSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      tenantId: installedSaleorApp.saleorApp.tenantId,
      installedSaleorApp: installedSaleorApp,
      channelSlug: installedSaleorApp.channelSlug || "",
    });
    await saleorProductSyncService.syncToECI();
    this.ctx.job.updateProgress(50);
    await saleorProductSyncService.syncFromECI();
    this.logger.info("Finished saleor product sync workflow run");
  }
}
