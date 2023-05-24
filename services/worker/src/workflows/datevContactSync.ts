import type { ILogger } from "@eci/pkg/logger";
import type { DatevApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
// eslint-disable-next-line max-len
import { DatevContactServiceService } from "@eci/pkg/integration-datev/src/contacts";

export type DatevContactSyncWorkflowClients = {
  prisma: PrismaClient;
};
export type DatevContactSyncWorkflowConfig = {
  datevApp: DatevApp;
};

export class DatevContactSyncWf implements Workflow {
  private logger: ILogger;

  private prisma: PrismaClient;

  private datevApp: DatevApp;

  public constructor(
    ctx: RuntimeContext,
    clients: DatevContactSyncWorkflowClients,
    config: DatevContactSyncWorkflowConfig,
  ) {
    this.logger = ctx.logger.with({
      workflow: DatevContactSyncWf.name,
    });
    this.logger = ctx.logger;
    this.prisma = clients.prisma;
    this.datevApp = config.datevApp;
  }

  /**
   * Start the sync of datev Contacts with the ECI db
   */
  public async run(): Promise<void> {
    this.logger.info("Starting datev Contact sync workflow run");

    const DatevContactSync = new DatevContactServiceService({
      logger: this.logger,
      db: this.prisma,
      tenantId: this.datevApp.tenantId,
      datevAppId: this.datevApp.id,
    });
    await DatevContactSync.eciContactsFlow();
    this.logger.info("Finished datev transaction sync workflow run");
  }
}
