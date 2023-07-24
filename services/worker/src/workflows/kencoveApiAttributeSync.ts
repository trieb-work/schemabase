import { KencoveApiAppAttributeSyncService } from "@eci/pkg/integration-kencove-api/src/attributes";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiAttributeSyncWorkflowClients = {
  prisma: PrismaClient;
};

export type KencoveApiAttributeSyncWorkflowConfig = {
  kencoveApiApp: KencoveApiApp;
};

export class KencoveApiAttributeSyncWf implements Workflow {
  private prisma: PrismaClient;
  private logger: ILogger;
  private kencoveApiApp: KencoveApiApp;

  public constructor(
    ctx: RuntimeContext,
    clients: KencoveApiAttributeSyncWorkflowClients,
    config: KencoveApiAttributeSyncWorkflowConfig,
  ) {
    this.prisma = clients.prisma;
    this.kencoveApiApp = config.kencoveApiApp;
    this.logger = ctx.logger.with({
      workflow: KencoveApiAttributeSyncWf.name,
      kencoveApiAppId: config.kencoveApiApp.id,
    });
  }

  public async run(): Promise<void> {
    this.logger.info("Starting kencove api attribute sync workflow run");

    const kencoveApiAttributeSyncService =
      new KencoveApiAppAttributeSyncService({
        logger: this.logger,
        db: this.prisma,
        kencoveApiApp: this.kencoveApiApp,
      });
    await kencoveApiAttributeSyncService.syncToECI();
    this.logger.info("Finished kencove api product sync workflow run");
  }
}
