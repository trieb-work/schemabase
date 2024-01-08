import { KencoveApiAppOrderSyncService } from "@eci/pkg/integration-kencove-api/src/orders";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiOrderSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiOrderSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiOrderSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiOrderSyncWorkflowClients,
        config: KencoveApiOrderSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiOrderSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api order sync workflow run");

        const kencoveApiOrderSyncService = new KencoveApiAppOrderSyncService({
            logger: this.logger,
            db: this.prisma,
            kencoveApiApp: this.kencoveApiApp,
        });
        await kencoveApiOrderSyncService.syncToECI();
        this.logger.info("Finished kencove api order sync workflow run");
    }
}
