import { KencoveApiAppContactSyncService } from "@eci/pkg/integration-kencove-api/src/contacts";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiContactSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiContactSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiContactSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiContactSyncWorkflowClients,
        config: KencoveApiContactSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiContactSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api contact sync workflow run");

        const kencoveApiContactSyncService =
            new KencoveApiAppContactSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiContactSyncService.syncToECI();
        this.logger.info("Finished kencove api contact sync workflow run");
    }
}
