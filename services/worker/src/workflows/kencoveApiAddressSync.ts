import { KencoveApiAppAddressSyncService } from "@eci/pkg/integration-kencove-api";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiAddressSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiAddressSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiAddressSyncWf implements Workflow {
    private prisma: PrismaClient;
    private logger: ILogger;
    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiAddressSyncWorkflowClients,
        config: KencoveApiAddressSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiAddressSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api address sync workflow run");

        const kencoveApiAddressSyncService =
            new KencoveApiAppAddressSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiAddressSyncService.syncToECI();
        this.logger.info("Finished kencove api address sync workflow run");
    }
}
