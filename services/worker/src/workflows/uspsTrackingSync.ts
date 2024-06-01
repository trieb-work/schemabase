import { USPSTrackingSyncService } from "@eci/pkg/integration-usps";
import type { ILogger } from "@eci/pkg/logger";
import type { UspsTrackingApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type UspsTrackingSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type UspsTrackingSyncWorkflowConfig = {
    uspsTrackingApp: UspsTrackingApp;
};

export class UspsTrackingSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private uspsTrackingApp: UspsTrackingApp;

    public constructor(
        ctx: RuntimeContext,
        clients: UspsTrackingSyncWorkflowClients,
        config: UspsTrackingSyncWorkflowConfig,
    ) {
        this.uspsTrackingApp = config.uspsTrackingApp;
        this.logger = ctx.logger.with({
            workflow: UspsTrackingSyncWf.name,
            uspsTrackingApp: this.uspsTrackingApp.id,
        });
        this.prisma = clients.prisma;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting USPS Tracking sync workflow run");

        const uspsTrackingSyncService = new USPSTrackingSyncService({
            logger: this.logger,
            db: this.prisma,
            uspsTrackingApp: this.uspsTrackingApp,
        });
        await uspsTrackingSyncService.syncToECI();

        this.logger.info("Finished USPS Tracking sync workflow run");
    }
}
