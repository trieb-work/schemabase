import { KencoveApiAppProductSkuSyncService } from "@eci/pkg/integration-kencove-api/src/products/skus";
import { ILogger } from "@eci/pkg/logger";
import { KencoveApiApp, PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type KencoveApiNightlyProductSkuSyncWorkflowClients = {
    prisma: PrismaClient;
};

export type KencoveApiNightlyProductSkuSyncWorkflowConfig = {
    kencoveApiApp: KencoveApiApp;
};

/**
 * This workflow runs nightly to sync product SKUs from Kencove API to ECI.
 */
export class KencoveApiNightlyProductSkuSyncWf implements Workflow {
    private prisma: PrismaClient;

    private logger: ILogger;

    private kencoveApiApp: KencoveApiApp;

    public constructor(
        ctx: RuntimeContext,
        clients: KencoveApiNightlyProductSkuSyncWorkflowClients,
        config: KencoveApiNightlyProductSkuSyncWorkflowConfig,
    ) {
        this.prisma = clients.prisma;
        this.kencoveApiApp = config.kencoveApiApp;
        this.logger = ctx.logger.with({
            workflow: KencoveApiNightlyProductSkuSyncWf.name,
            kencoveApiAppId: config.kencoveApiApp.id,
        });
    }

    public async run(): Promise<void> {
        this.logger.info(
            "Starting Kencove API nightly product SKU sync workflow run",
        );

        try {
            const skuSyncService = new KencoveApiAppProductSkuSyncService({
                logger: this.logger,
                db: this.prisma,
                kencoveApiApp: this.kencoveApiApp,
            });

            await skuSyncService.syncToECI();

            this.logger.info(
                "Finished Kencove API nightly product SKU sync workflow run",
            );
        } catch (error) {
            this.logger.error(
                "Error in Kencove API nightly product SKU sync workflow",
                error instanceof Error
                    ? {
                          error: {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                          },
                      }
                    : { error },
            );
            throw error;
        }
    }
}
