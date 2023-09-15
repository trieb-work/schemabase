import { KencoveApiAppPricelistSyncService } from "@eci/pkg/integration-kencove-api";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiPricelistSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiPricelistSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiPricelistSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiPricelistSyncWorkflowClients,
        config: KencoveApiPricelistSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiPricelistSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api pricelist sync workflow run");

        const kencoveApiPricelistSyncService =
            new KencoveApiAppPricelistSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiPricelistSyncService.syncToEci();
        this.logger.info("Finished kencove api pricelist sync workflow run");
    }
}
