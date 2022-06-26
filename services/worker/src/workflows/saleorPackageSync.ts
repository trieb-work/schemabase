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
    this.logger = ctx.logger.with({
      workflow: SaleorPackageSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.orderPrefix = config.orderPrefix;
    this.prisma = clients.prisma;
    this.installedSaleorAppId = config.installedSaleorAppId;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting saleor payment sync workflow run");
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

    this.logger.info("Finished saleor payment sync workflow run");
  }
}
