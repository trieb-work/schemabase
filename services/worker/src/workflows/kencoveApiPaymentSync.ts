import { KencoveApiAppPaymentSyncService } from "@eci/pkg/integration-kencove-api/src/payments";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiPaymentSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiPaymentSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

export class KencoveApiPaymentSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiPaymentSyncWorkflowClients,
        config: KencoveApiPaymentSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiPaymentSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info("Starting kencove api payment sync workflow run");

        const kencoveApiPaymentSyncService =
            new KencoveApiAppPaymentSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });
        await kencoveApiPaymentSyncService.syncToECI();
        this.logger.info("Finished kencove api payment sync workflow run");
    }
}
