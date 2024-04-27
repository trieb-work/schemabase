import { FedexTrackingSyncService } from "@eci/pkg/integration-fedex";
import type { ILogger } from "@eci/pkg/logger";
import type { FedexTrackingApp, PrismaClient } from "@eci/pkg/prisma";
import type { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type FedexTrackingSyncWorkflowClients = {
    prisma: PrismaClient;
};
export type FedexTrackingSyncWorkflowConfig = {
    fedexTrackingApp: FedexTrackingApp;
};

export class FedexTrackingSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private fedexTrackingApp: FedexTrackingApp;

    public constructor(
        ctx: RuntimeContext,
        clients: FedexTrackingSyncWorkflowClients,
        config: FedexTrackingSyncWorkflowConfig,
    ) {
        this.fedexTrackingApp = config.fedexTrackingApp;
        this.logger = ctx.logger.with({
            workflow: FedexTrackingSyncWf.name,
            fedexTrackingApp: this.fedexTrackingApp.id,
        });
        this.prisma = clients.prisma;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting Fedex Tracking sync workflow run");

        const fedexTrackingSyncService = new FedexTrackingSyncService({
            logger: this.logger,
            db: this.prisma,
            fedexTrackingApp: this.fedexTrackingApp,
        });
        await fedexTrackingSyncService.syncToECI();

        this.logger.info("Finished Fedex Tracking sync workflow run");
    }
}
