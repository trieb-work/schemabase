/// Kencove Api Package sync workflow
import { KencoveApiAppPackageSyncService } from "@eci/pkg/integration-kencove-api/src/packages";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiPackageSyncWorkflowClients = {
  prisma: PrismaClient;
};

export type KencoveApiPackageSyncWorkflowConfig = {
  kencoveApiApp: KencoveApiApp;
};

export class KencoveApiPackageSyncWf implements Workflow {
  private prisma: PrismaClient;
  private logger: ILogger;
  private kencoveApiApp: KencoveApiApp;

  public constructor(
    ctx: RuntimeContext,
    clients: KencoveApiPackageSyncWorkflowClients,
    config: KencoveApiPackageSyncWorkflowConfig,
  ) {
    this.prisma = clients.prisma;
    this.kencoveApiApp = config.kencoveApiApp;
    this.logger = ctx.logger.with({
      workflow: KencoveApiPackageSyncWf.name,
      kencoveApiAppId: config.kencoveApiApp.id,
    });
  }

  public async run(): Promise<void> {
    this.logger.info("Starting kencove api package sync workflow run");

    const kencoveApiPackageSyncService = new KencoveApiAppPackageSyncService({
      logger: this.logger,
      db: this.prisma,
      kencoveApiApp: this.kencoveApiApp,
    });
    await kencoveApiPackageSyncService.syncToEci();
    this.logger.info("Finished kencove api package sync workflow run");
  }
}
