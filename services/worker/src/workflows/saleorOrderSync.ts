import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { SaleorOrderSyncService } from "@eci/pkg/integration-saleor-entities/src/orders";
import { getSaleorClientAndEntry } from "@eci/pkg/saleor";

export type SaleorOrderSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type SaleorOrderSyncWorkflowConfig = {
  installedSaleorAppId: string;
  orderPrefix: string;
};

export class SaleorOrderSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private installedSaleorAppId: string;

  private orderPrefix: string;

  public constructor(
    ctx: RuntimeContext,
    clients: SaleorOrderSyncWorkflowClients,
    config: SaleorOrderSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: SaleorOrderSyncWorkflow.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.installedSaleorAppId = config.installedSaleorAppId;
    this.orderPrefix = config.orderPrefix;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info("Starting saleor order sync workflow run");
    const { client: saleorClient, installedSaleorApp } =
      await getSaleorClientAndEntry(this.installedSaleorAppId, this.prisma);

    const zohoContactSyncService = new SaleorOrderSyncService({
      logger: this.logger,
      saleorClient,
      db: this.prisma,
      tenantId: installedSaleorApp.saleorApp.tenantId,
      installedSaleorAppId: this.installedSaleorAppId,
      channelSlug: installedSaleorApp.channelSlug || "",
      orderPrefix: this.orderPrefix,
    });
    await zohoContactSyncService.syncToECI();
    this.logger.info("Finished saleor order sync workflow run");
  }
}
