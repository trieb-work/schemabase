import { KencoveApiAppCategorySyncService } from "@eci/pkg/integration-kencove-api/src/categories";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiCategorySyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiCategorySyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiCategorySyncWf implements Workflow {
    private prisma: PrismaClient;
    private logger: ILogger;
    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiCategorySyncWorkflowClients,
        config: KencoveApiCategorySyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiCategorySyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api category sync workflow run");

        const kencoveApiCategorySyncService =
            new KencoveApiAppCategorySyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiCategorySyncService.syncToECI();
        this.logger.info("Finished kencove api category sync workflow run");
    }
}
