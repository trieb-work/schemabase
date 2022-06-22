import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorPaymentSyncService } from "@eci/pkg/integration-saleor-entities/src/payments";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorPaymentSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorPaymentSyncWorkflowConfig = {
  installedSaleorAppId: string;
};

export class SaleorPaymentSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorPaymentSyncWorkflowClients,
    config: SaleorPaymentSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: SaleorPaymentSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.installedSaleorAppId = config.installedSaleorAppId;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting saleor warehouse sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const saleorPaymentSyncService = new SaleorPaymentSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      installedSaleorAppId: this.installedSaleorAppId,
      tenantId: installedSaleorApp.saleorApp.tenantId,
    });
    await saleorPaymentSyncService.syncToECI();
    this.logger.info("Finished saleor warehouse sync workflow run");
  }
}
