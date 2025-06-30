// eslint-disable-next-line max-len
import { KencoveApiAppProductStockSyncService } from "@eci/pkg/integration-kencove-api/src/productstocks";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";
import { subYears } from "date-fns";

export type KencoveApiNightlyStockSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiNightlyStockSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

/**
 * This workflow runs nightly to sync stocks from Kencove API to ECI
 * with a large window (1 year) to catch any data that might have been missed
 * during regular syncs
 */
export class KencoveApiNightlyStockSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiNightlyStockSyncWorkflowClients,
        config: KencoveApiNightlyStockSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiNightlyStockSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info(
            "Starting Kencove API nightly stock sync workflow run",
        );

        try {
            const kencoveApiProductStockSyncService =
                new KencoveApiAppProductStockSyncService({
                    logger: this.logger,
                    db: this.prisma,
                    kencoveApiApp: this.kencoveApiApp,
                });

            // Override the default date range with a 1-year window
            // This will be used instead of the cronState's lastRun
            const oneYearAgo = subYears(new Date(), 1);

            // Pass the custom date to force a full sync with 1-year window
            await kencoveApiProductStockSyncService.syncToEci(
                undefined,
                oneYearAgo,
            );

            this.logger.info(
                "Finished Kencove API nightly stock sync workflow run",
            );
        } catch (error) {
            this.logger.error(
                "Error in Kencove API nightly stock sync workflow",
                {
                    error:
                        error instanceof Error ? error.message : String(error),
                },
            );
            throw error;
        }
    }
}
