import { XentralProxyLieferscheinSyncService } from "@eci/pkg/integration-xentralProxy-entities";
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient, XentralProxyApp } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { XentralXmlClient } from "@eci/pkg/xentral";
import { XentralRestClient } from "@eci/pkg/xentral/src/rest";

export type XentralLieferscheinSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type XentralLieferscheinSyncWorkflowConfig = {
  xentralProxyApp: XentralProxyApp;
};

export class XentralLieferscheinSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private xentralProxyApp: XentralProxyApp;

  public constructor(
    ctx: RuntimeContext,
    clients: XentralLieferscheinSyncWorkflowClients,
    config: XentralLieferscheinSyncWorkflowConfig,
  ) {
    this.xentralProxyApp = config.xentralProxyApp;
    this.logger = ctx.logger.with({
      workflow: XentralLieferscheinSyncWf.name,
      xentralProxyApp: this.xentralProxyApp,
    });
    this.prisma = clients.prisma;
    this.xentralProxyApp = config.xentralProxyApp;
  }

  /**
   * Sync all xentral lieferscheine into ECI-DB
   */
  public async run(): Promise<void> {
    this.logger.info(
      `Starting xentral Lieferschein sync workflow run for xentral URL ${this.xentralProxyApp.url}`,
    );

    const xentralXmlClient = new XentralXmlClient(this.xentralProxyApp);
    const xentralRestClient = new XentralRestClient(this.xentralProxyApp);
    const xentralLieferscheinSync = new XentralProxyLieferscheinSyncService({
      xentralXmlClient,
      xentralRestClient,
      logger: this.logger,
      db: this.prisma,
      xentralProxyApp: this.xentralProxyApp,
    });
    await xentralLieferscheinSync.syncToECI();
    this.logger.info("Finished xentral Lieferschein sync workflow run");
  }
}
