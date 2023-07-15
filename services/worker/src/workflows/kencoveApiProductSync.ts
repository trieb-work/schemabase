import { KencoveApiAppProductSyncService } from "@eci/pkg/integration-kencove-api/src/products";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiProductSyncWorkflowClients = {
  prisma: PrismaClient;
};

export type KencoveApiProductSyncWorkflowConfig = {
  kencoveApiApp: KencoveApiApp;
};

export class KencoveApiProductSyncWf implements Workflow {
  private prisma: PrismaClient;
  private logger: ILogger;
  private kencoveApiApp: KencoveApiApp;

  public constructor(
    ctx: RuntimeContext,
    clients: KencoveApiProductSyncWorkflowClients,
    config: KencoveApiProductSyncWorkflowConfig,
  ) {
    this.prisma = clients.prisma;
    this.kencoveApiApp = config.kencoveApiApp;
    this.logger = ctx.logger.with({
      workflow: KencoveApiProductSyncWf.name,
      kencoveApiAppId: config.kencoveApiApp.id,
    });
  }

  public async run(): Promise<void> {
    this.logger.info("Starting kencove api product sync workflow run");

    const kencoveApiProductSyncService = new KencoveApiAppProductSyncService({
      logger: this.logger,
      db: this.prisma,
      kencoveApiApp: this.kencoveApiApp,
    });
    await kencoveApiProductSyncService.syncToEci();
    this.logger.info("Finished kencove api product sync workflow run");
  }
}
