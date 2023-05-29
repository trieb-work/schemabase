import { UPSTrackingSyncService } from "@eci/pkg/integration-ups";
import type { ILogger } from "@eci/pkg/logger";
import type { UPSTrackingApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type UPSTrackingSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type UPSTrackingSyncWorkflowConfig = {
  upsTrackingApp: UPSTrackingApp;
};

export class UPSTrackingSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private upsTrackingApp: UPSTrackingApp;

  public constructor(
    ctx: RuntimeContext,
    clients: UPSTrackingSyncWorkflowClients,
    config: UPSTrackingSyncWorkflowConfig,
  ) {
    this.upsTrackingApp = config.upsTrackingApp;
    this.logger = ctx.logger.with({
      workflow: UPSTrackingSyncWf.name,
      upsTrackingApp: this.upsTrackingApp.id,
    });
    this.prisma = clients.prisma;
  }

  public async run(): Promise<void> {
    this.logger.info("Starting UPS Tracking sync workflow run");

    const zohoTaxSyncService = new UPSTrackingSyncService({
      logger: this.logger,
      db: this.prisma,
      upsTrackingApp: this.upsTrackingApp,
    });
    await zohoTaxSyncService.syncToECI();

    this.logger.info("Finished UPS Tracking sync workflow run");
  }
}
