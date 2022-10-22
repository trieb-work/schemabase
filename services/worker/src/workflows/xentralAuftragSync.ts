import { XentralProxyOrderSyncService } from "@eci/pkg/integration-xentralProxy-entities";
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";

export type XentralAuftragSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type XentralAuftragSyncWorkflowConfig = {
  xentralProxyApp: XentralProxyApp;
};

export class XentralAuftragSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private xentralProxyApp: XentralProxyApp;

  public constructor(
    ctx: RuntimeContext,
    clients: XentralAuftragSyncWorkflowClients,
    config: XentralAuftragSyncWorkflowConfig,
  ) {
    this.xentralProxyApp = config.xentralProxyApp;
    this.logger = ctx.logger.with({
      workflow: XentralAuftragSyncWorkflow.name,
      xentralProxyApp: this.xentralProxyApp,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.xentralProxyApp = config.xentralProxyApp;
  }

  /**
   * Sync all zoho invoices into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info(
      `Starting xentral artikel sync workflow run for xentral URL ${this.xentralProxyApp.url}`,
    );

    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);
    const xentralAuftragSync = new XentralProxyOrderSyncService({
      xentralXmlClient,
      xentralRestClient,
      logger: this.logger,
      db: this.prisma,
      xentralProxyApp: this.xentralProxyApp,
      warehouseId: this.xentralProxyApp.warehouseId,
    });
    await xentralAuftragSync.syncFromECI();
    this.logger.info("Finished xentral artikel sync workflow run");
  }
}
