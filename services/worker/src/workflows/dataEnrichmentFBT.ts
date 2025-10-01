// date enrichment frequently bought together workflow

import { FrequentlyBoughtTogetherService } from "@eci/pkg/data-enrichtment/src/frequently-bought-together/src";
import type { ILogger } from "@eci/pkg/logger";
import type { PrismaClient } from "@eci/pkg/prisma";
import { RuntimeContext, Workflow } from "@eci/pkg/scheduler/workflow";

export type DataEnrichmentFBTSyncWfClients = {
    prisma: PrismaClient;
};

export type DataEnrichmentFBTSyncWfConfig = {
    tenantId: string;
};

export class DataEnrichmentFBTSyncWf implements Workflow {
    private logger: ILogger;

    private prisma: PrismaClient;

    private tenantId: string;

    public constructor(
        ctx: RuntimeContext,
        clients: DataEnrichmentFBTSyncWfClients,
        config: DataEnrichmentFBTSyncWfConfig,
    ) {
        this.logger = ctx.logger.with({
            workflow: DataEnrichmentFBTSyncWf.name,
            tenantId: config.tenantId,
        });
        this.prisma = clients.prisma;
        this.tenantId = config.tenantId;
    }

    public async run(): Promise<void> {
        this.logger.info("Starting data enrichment FBT sync workflow run");

        const dataEnrichmentFBTSync = new FrequentlyBoughtTogetherService({
            logger: this.logger,
            db: this.prisma,
            tenantId: this.tenantId,
        });
        await dataEnrichmentFBTSync.addFBTVariants();
        this.logger.info("Finished data enrichment FBT sync workflow run");
    }
}
