import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorCategorySyncService } from "@eci/pkg/integration-saleor-entities/src/categories";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorCategorySyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorCategorySyncWorkflowConfig = {
  installedSaleorAppId: string;
};

export class SaleorCategorySyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorCategorySyncWorkflowClients,
    config: SaleorCategorySyncWorkflowConfig,
  ) {
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.logger = ctx.logger.with({
      workflow: SaleorCategorySyncWf.name,
      installedSaleorAppId: this.installedSaleorAppId,
    });
    this.prisma = clients.prisma;
    this.installedSaleorAppId = config.installedSaleorAppId;
  }

  /**
   * Sync all saleor category
   */
  public async run(): Promise<void> {
    this.logger.info("Starting saleor category sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const saleorCategorySyncService = new SaleorCategorySyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      installedSaleorApp: installedSaleorApp,
      tenantId: installedSaleorApp.saleorApp.tenantId,
    });
    await saleorCategorySyncService.syncToEci();
    await saleorCategorySyncService.syncFromEci();
    this.logger.info("Finished saleor category sync workflow run");
  }
}
