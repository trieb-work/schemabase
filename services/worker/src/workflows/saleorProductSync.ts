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

export class SaleorProductSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorProductSyncWorkflowClients,
    config: SaleorProductSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: SaleorProductSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.installedSaleorAppId = config.installedSaleorAppId;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting saleor product sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const zohoContactSyncService = new SaleorProductSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      tenantId: installedSaleorApp.saleorApp.tenantId,
      installedSaleorAppId: this.installedSaleorAppId,
      channelSlug: installedSaleorApp.channelSlug || "",
    });
    await zohoContactSyncService.syncToECI();
    await zohoContactSyncService.syncFromECI();
    this.logger.info("Finished saleor product sync workflow run");
  }
}
