import { DHLTrackingSyncService } from "@eci/pkg/integration-dhl";
import type { ILogger } from "@eci/pkg/logger";
import type { DHLTrackingApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type DHLTrackingSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type DHLTrackingSyncWorkflowConfig = {
  dhlTrackingApp: DHLTrackingApp;
};

export class DHLTrackingSyncWorkflow implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private dhlTrackingApp: DHLTrackingApp;

  public constructor(
    ctx: RuntimeContext,
    clients: DHLTrackingSyncWorkflowClients,
    config: DHLTrackingSyncWorkflowConfig,
  ) {
    this.dhlTrackingApp = config.dhlTrackingApp;
    this.logger = ctx.logger.with({
      workflow: DHLTrackingSyncWorkflow.name,
      dhlTrackingApp: this.dhlTrackingApp.id,
    });
    this.prisma = clients.prisma;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting DHL Tracking sync workflow run");

    const zohoTaxSyncService = new DHLTrackingSyncService({
      logger: this.logger,
      db: this.prisma,
      dhlTrackingApp: this.dhlTrackingApp,
    });
    await zohoTaxSyncService.syncToECI();

    this.logger.info("Finished DHL Tracking sync workflow run");
  }
}
