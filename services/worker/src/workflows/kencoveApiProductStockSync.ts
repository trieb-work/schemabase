// eslint-disable-next-line max-len
import { KencoveApiAppProductStockSyncService } from "@eci/pkg/integration-kencove-api/src/productstocks";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiProductStockSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiProductStockSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiProductStockSyncWf implements Workflow {
    private prisma: PrismaClient;
    private logger: ILogger;
    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiProductStockSyncWorkflowClients,
        config: KencoveApiProductStockSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiProductStockSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info(
            "Starting kencove api product stock sync workflow run",
        );

        const kencoveApiProductStockSyncService =
            new KencoveApiAppProductStockSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiProductStockSyncService.syncToEci();
        this.logger.info(
            "Finished kencove api product stock sync workflow run",
        );
    }
}
