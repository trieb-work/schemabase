import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorPackageSyncService } from "@eci/pkg/integration-saleor-entities/src/packages";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorPackageSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorPackageSyncWorkflowConfig = {
  installedSaleorAppId: string;
  orderPrefix: string;
};

export class SaleorPackageSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  private orderPrefix: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorPackageSyncWorkflowClients,
    config: SaleorPackageSyncWorkflowConfig,
  ) {
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.logger = ctx.logger.with({
      workflow: SaleorPackageSyncWorkflow.name,
      installedSaleorAppId: this.installedSaleorAppId,
    });
    this.orderPrefix = config.orderPrefix;
    this.prisma = clients.prisma;
    
  }

  public async run(): Promise<void> {
    this.logger.info("Starting saleor package sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const saleorPackageSyncService = new SaleorPackageSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      installedSaleorAppId: this.installedSaleorAppId,
      tenantId: installedSaleorApp.saleorApp.tenantId,
      orderPrefix: this.orderPrefix,
    });
    await saleorPackageSyncService.syncToECI();

    await saleorPackageSyncService.syncFromECI();

    this.logger.info("Finished saleor package sync workflow run");
  }
}
